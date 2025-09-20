import { handleWebhookEventRoute, verifyWebhookSignature } from "./helper";


const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;


export async function POST(req: Request) {

    const body = await req.text();

    const signature = req.headers.get("stripe-signature")!;

    if (!signature) return new Response("Missing stripe-signature header", { status: 400 });


    try {
        const event = verifyWebhookSignature(body, signature, WEBHOOK_SECRET);

        await handleWebhookEventRoute(event);

        return new Response("Webhook received", { status: 200 });

    } catch (err: any) {

        console.error("Webhook processing failed:", err.message || err);

        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
}