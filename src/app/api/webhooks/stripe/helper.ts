import stripe from "@/lib/stripe";
import prisma from "@/db/prisma";
import Stripe from "stripe";




export function verifyStripeWebhookSignature(
    payload: string,
    signature: string,
    secret: string
): Stripe.Event {
    // A cryptographic signature - 
    // Stripe generates for every webhook event to send it our endpoint.
    // So only Stripe can trigger this logic

    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    return event;
}




export async function handleStripeWebhookEventRoute(event: Stripe.Event) {

    switch (event.type) {

        // Delegates to specific handler...

        case "checkout.session.completed":
            await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
            break;

        case "customer.subscription.deleted":
            await handleCustomerSubscriptionDeleted(event.data.object as Stripe.Subscription);
            break;

        default:
            console.warn(`Unhandled event type: ${event.type}`);
            // Optionally log to monitoring tool (Sentry, etc.)
            break;
    }
}




async function handleCheckoutSessionCompleted(sessionObj: Stripe.Checkout.Session) {
    // Retrieve session with expanded line_items to → gets product/price info
    const session = await stripe.checkout.sessions.retrieve(
        sessionObj.id,
        { expand: ["line_items"] }
    );

    const customerDetails = session.customer_details; // → identifies user
    if (!customerDetails?.email) {
        console.warn("No customer email found in checkout session.");
        return;
    }

    // Sync user record with Stripe customer ID
    const user = await syncUserWithStripeCustomerId(
        customerDetails.email,
        session.customer as string
    );

    const lineItems = session.line_items?.data || [];

    for (const item of lineItems) {
        const priceId = item.price?.id;
        const isSubscription = item.price?.type === "recurring";

        if (isSubscription && priceId) {
            await updateSubscriptionInfoForUser(user.id, priceId);
        } else {
            console.log("One-time purchase detected — skipping subscription update.");
        }
    }

}




async function syncUserWithStripeCustomerId(email: string, customerId: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error(`User with email ${email} not found in database.`);

    // If user has no customerId → update DB with Stripe’s customerId
    if (!user.customerId) {
        await prisma.user.update({
            where: { id: user.id },
            data: { customerId }
        });
    }

    return user;
}




async function updateSubscriptionInfoForUser(userId: string, priceId: string) {
    const { period, endDate } = getPlanDetails(priceId);

    console.log({ period });

    const planInfo = {
        plan: "premium" as const,
        startDate: new Date(),
        endDate,
        period
    };

    // Upsert's subscription in DB → create if new, update if exists
    await prisma.subscription.upsert({
        where: { userId },
        create: { userId, ...planInfo },
        update: planInfo
    });

    // Update user's plan
    await prisma.user.update({
        where: { id: userId },
        data: { plan: "premium" }
    });
}




function getPlanDetails(priceId: string) {
    const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID!;
    const YEARLY_PRICE_ID = process.env.STRIPE_YEARLY_PRICE_ID!;

    const now = new Date();

    if (priceId === YEARLY_PRICE_ID) {
        return {
            period: "yearly" as const,
            endDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        };
    }

    if (priceId === MONTHLY_PRICE_ID) {
        return {
            period: "monthly" as const,
            endDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
        };
    }

    throw new Error(`Unknown Stripe price ID: ${priceId}`);
}



async function handleCustomerSubscriptionDeleted(subscriptionObj: Stripe.Subscription) {
    const customerId = subscriptionObj.customer as string;

    const user = await prisma.user.findUnique({ where: { customerId } });

    if (!user) {
        console.warn(`No user found for customerId: ${customerId} on subscription deletion.`);
        return;
    }

    // Downgrade user plan
    await prisma.user.update({
        where: { id: user.id },
        data: { plan: "free" }
    });

    console.log(`User ${user.email} downgraded to free plan.`);
}