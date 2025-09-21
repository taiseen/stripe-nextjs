import { handleStripeWebhookEventRoute, verifyStripeWebhookSignature } from "./helper";


const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;


// 🟩🟩🟩 backend - controller logic
export async function POST(req: Request) {

    const body = await req.text();

    const signature = req.headers.get("stripe-signature")!;

    if (!signature) return new Response("Missing stripe-signature header", { status: 400 });


    try {
        const event = verifyStripeWebhookSignature(body, signature, WEBHOOK_SECRET);

        await handleStripeWebhookEventRoute(event);

        return new Response("Webhook received", { status: 200 });

    } catch (err) {

        console.error("Webhook processing failed:", err instanceof Error ? err.message : err);

        const message = err instanceof Error ? err.message : "Unknown error";

        return new Response(`Webhook Error: ${message}`, { status: 400 });
    }
}