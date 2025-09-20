import stripe from "@/lib/stripe";
import prisma from "@/db/prisma";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {

    const body = await req.text();

    const signature = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed.", err);

        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }


    try {
        switch (event.type) {

            case "checkout.session.completed":

                const session = await stripe.checkout.sessions.retrieve(
                    (event.data.object as Stripe.Checkout.Session).id,
                    { expand: ["line_items"] }
                );

                const customerId = session.customer as string;
                const customerDetails = session.customer_details;

                if (!customerDetails?.email) {
                    console.log("No customer email found in session.");
                    break;
                }

                const user = await prisma.user.findUnique({
                    where: { email: customerDetails.email }
                });

                if (!user) throw new Error("User not found");

                if (!user.customerId) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { customerId }
                    });
                }

                const lineItems = session.line_items?.data || [];

                for (const item of lineItems) {

                    const priceId = item.price?.id;

                    const isUserSubscription = item.price?.type === "recurring";

                    if (isUserSubscription) {

                        let endDate = new Date();

                        if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
                            endDate.setFullYear(endDate.getFullYear() + 1);
                        } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
                            endDate.setMonth(endDate.getMonth() + 1);
                        } else {
                            throw new Error("Unknown price ID");
                        }


                        const planInfo = {
                            plan: 'premium',
                            startDate: new Date(),
                            endDate,
                            period: priceId === process.env.STRIPE_YEARLY_PRICE_ID ? 'yearly' : 'monthly'
                        } as const;

                        // Create a subscription record in database...
                        // if it doesn't exist create one or update the existing one
                        await prisma.subscription.upsert({
                            where: { userId: user.id },
                            create: { userId: user.id, ...planInfo },
                            update: { ...planInfo }
                        });

                        // Update user plan to premium in database
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { plan: 'premium' }
                        });

                    } else {
                        // Handle one-time purchases if needed
                        console.log("One-time purchase detected, no subscription to update.");
                    }

                }

                break;

            default:
                console.error(`Unhandled event type ${event.type}`);
                break;

        }

    } catch (err) {

        console.error("Error in webhook handler:", err);

        return new Response("Webhook handler failed", { status: 400 });
    }

    return new Response("Webhook received", { status: 200 });
}