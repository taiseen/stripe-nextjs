> 6 - September - 2025

## Stripe Payment System

### 🧠 Learning context:-

- File & Folder Structure
- Stripe product setup
  - create product link + id
    - same product 2 version for monthly & yearly
  - webhook - `local running` for testing
    - yarn add stripe
    - download & install `stripe cli` & PATH configure
    - stripe login
    - stripe listen --forward-to localhost:3000/api/webhooks/stripe  

### 🎨 UI Packages

- npx shadcn@latest add dropdown-menu
- npx shadcn@latest add navigation-menu
- npx shadcn@latest add badge
- npx shadcn@latest add card

### 🛢️ Database

- prisma + mongodb
- npx prisma init
- npx prisma db push

### 🛡️ Auth & Payment System

- [Kinde auth system][authSide]
- [Stripe dashboard][stripe]

[authSide]: https://app.kinde.com
[stripe]: https://dashboard.stripe.com

### STRIPE WEBHOOK — STEPS & FUNCTION DEPENDENCY GRAPH

- 🏗️ Architecture with 🧠 clarity

```js
🌐 1. ENTRY POINT               — POST /api/webhooks
🔐 2. VERIFY SIGNATURE          — verify_Webhook_Signature(...)
🧭 3. ROUTE EVENT               — handle_Webhook_Event_Route(...)
🛒 4. HANDLE CHECKOUT COMPLETED — handle_Checkout_Session_Completed(...)
👤 5. SYNC USER                 — sync_User_With_Stripe_Customer_Id(...)
📅 6. UPDATE SUBSCRIPTION       — update_Subscription_Info_For_User(...)
```

```js
Verify → Route → Sync → Update → Plan

[Stripe POST]
    ↓
[Verify Signature] → Trust ✅
    ↓
[Route by Event Type] → checkout.session.completed
    ↓
[Retrieve Session + Line Items]
    ↓
[Find User by Email] → Sync/Link customerId
    ↓
[For Each Item] → Is Subscription?
        ↓ [Yes] → Update Subscription + Upgrade User Plan
        ↓ [No]  → Skip (One-time)
    ↓
[Return 200] → Done ✅
```

```js
🚪 Layer 1: Entry & Verification
route.ts
└── verifyWebhookSignature

🧭 Layer 2: Routing & Event Handling
handleWebhookEventRoute
└── handleCheckoutSessionCompleted

🧑 Layer 3: User Sync
handleCheckoutSessionCompleted
└── syncUserWithStripeCustomerId
    └── Prisma (find + update)
    
📦 Layer 4: Subscription & Plan Activation    
handleCheckoutSessionCompleted
└── updateSubscriptionInfoForUser
    ├── getPlanDetails
    └── Prisma (upsert subscription + update user plan)
```

```js
POST /api/webhooks (route.ts)
       │
       ▼
verifyWebhookSignature(payload, signature, secret) → returns Stripe.Event
       │
       ▼
handleWebhookEventRoute(event) → routes by event.type
       │
       ▼
handleCheckoutSessionCompleted(session) → main logic for payment success
       │
       ├───────────────► syncUserWithStripeCustomerId(email, customerId) → returns User
       │                         │
       │                         ▼
       │                  prisma.user.findUnique + .update
       │
       ▼
FOR EACH line_item → if subscription → updateSubscriptionInfoForUser(userId, priceId)
                                 │
                                 ▼
                         getPlanDetails(priceId) → returns { period, endDate }
                                 │
                                 ▼
                         prisma.subscription.upsert
                                 │
                                 ▼
                         prisma.user.update → set plan = "premium"
```

### STRIPE EVENT LOG

- ⏰ All events happened within ~15 seconds — typical for a successful subscription checkout.

```js
2025-09-20 20:21:00   --> charge.succeeded [evt_3SuX]               → 💰 Money captured!
2025-09-20 20:21:00   --> payment_method.attached [evt_1Sgb]
2025-09-20 20:21:00   --> customer.created [evt_1SX3]
2025-09-20 20:21:00   --> customer.updated [evt_1Shv]
2025-09-20 20:21:00   --> checkout.session.completed [evt_1SiA]     → 🎯 THIS IS OUR MAIN EVENT
2025-09-20 20:21:00   --> customer.subscription.created [evt_1S8k]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1Sgb]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_3SuX]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1SX3]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S8k]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1Shv]
2025-09-20 20:21:01   --> payment_intent.created [evt_3S9o]
2025-09-20 20:21:01   --> payment_intent.succeeded [evt_3SIm]       → ✅ Payment authorized & succeeded
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_3S9o]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_3SIm]
2025-09-20 20:21:01   --> invoice.created [evt_1Sm8]
2025-09-20 20:21:01   --> invoice.finalized [evt_1SOF]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1Sm8]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1SOF]
2025-09-20 20:21:01   --> invoice.paid [evt_1SQa]
2025-09-20 20:21:01   --> invoice.payment_succeeded [evt_1Swm]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1SQa]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1Swm]
2025-09-20 20:21:08  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1SiA]
2025-09-20 20:21:15   --> invoice_payment.paid [evt_1SEa]
2025-09-20 20:21:15  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1SEa]
```
