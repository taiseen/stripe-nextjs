> 6 - September - 2025

## Stripe Payment System

### 🧐 Some Features:-

- ⚛️ Tech Stack: Next.js 14, TypeScript, Prisma, MongoDB, Stripe
- 🔐 User Authentication with Kinde Auth
- 💸 Monthly & Annually Subscriptions with Stripe
- 💵 Building a Stripe Billing Portal
- 🪝 Subscriptions Webhooks
- 🔄 Stripe Event Types
- 🌗 Light/Dark Mode
- 🌐 Deployment

### ⚙️ Setup `.env` file

```js
DATABASE_URL= get_your_mongo_db_url

KINDE_CLIENT_SECRET = 
KINDE_CLIENT_ID = 
KINDE_ISSUER_URL = 
KINDE_SITE_URL = 
KINDE_POST_LOGOUT_REDIRECT_URL = 
KINDE_POST_LOGIN_REDIRECT_URL = 

STRIPE_MONTHLY_PLAN_LINK = get_from_stripe
STRIPE_YEARLY_PLAN_LINK = get_from_stripe

STRIPE_MONTHLY_PRICE_ID = get_from_stripe
STRIPE_YEARLY_PRICE_ID = get_from_stripe

STRIPE_SECRET_KEY = get_from_stripe
STRIPE_WEBHOOK_SECRET = get_from_stripe

NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL = get_from_stripe
```

### Install dependencies

```shell
npm install
```

### Start the app

```shell
npm run dev
```

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

### 🛠️ This project falls under

    - System Design 
    - API Integration 
    - State Management
    - Integration Engineering
    - Practical Software Engineering

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
🔐 2. VERIFY SIGNATURE          — verify_Stripe_Webhook_Signature(...)
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
└── verifyStripeWebhookSignature

🧭 Layer 2: Routing & Event Handling
handleStripeWebhookEventRoute
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
verifyStripeWebhookSignature(payload, signature, secret) → returns Stripe.Event
       │
       ▼
handleStripeWebhookEventRoute(event) → routes by event.type
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
- Stripe sends 20+ events for one checkout — we only need 1–2 to start.
- Stripe sends one webhook event per system action &
  - a subscription checkout triggers many actions - almost 7+
- [WEBHOOK - ENDPOINT](http://localhost:3000/api/webhooks/stripe)

```js
2025-09-20 20:21:00   --> charge.succeeded [evt_3SuX]               → 💰 Money captured!
2025-09-20 20:21:00   --> payment_method.attached [evt_1Sgb]
2025-09-20 20:21:00   --> customer.created [evt_1SX3]
2025-09-20 20:21:00   --> customer.updated [evt_1Shv]
2025-09-20 20:21:00   --> checkout.session.completed [evt_1SiA]     → 🎯 THIS IS OUR WORKING EVENT AREA
2025-09-20 20:21:00   --> customer.subscription.created [evt_1S8k]
2025-09-20 20:21:00  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1Sgb]
2025-09-20 20:21:00  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_3SuX]
2025-09-20 20:21:00  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SX3]
2025-09-20 20:21:00  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1S8k]
2025-09-20 20:21:00  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1Shv]
2025-09-20 20:21:01   --> payment_intent.created [evt_3S9o]
2025-09-20 20:21:01   --> payment_intent.succeeded [evt_3SIm]       → ✅ Payment authorized & succeeded
2025-09-20 20:21:01  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_3S9o]
2025-09-20 20:21:01  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_3SIm]
2025-09-20 20:21:01   --> invoice.created [evt_1Sm8]
2025-09-20 20:21:01   --> invoice.finalized [evt_1SOF]
2025-09-20 20:21:01  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1Sm8]
2025-09-20 20:21:01  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SOF]
2025-09-20 20:21:01   --> invoice.paid [evt_1SQa]
2025-09-20 20:21:01   --> invoice.payment_succeeded [evt_1Swm]
2025-09-20 20:21:01  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SQa]
2025-09-20 20:21:01  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1Swm]
2025-09-20 20:21:08  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SiA]
2025-09-20 20:21:15   --> invoice_payment.paid [evt_1SEa]
2025-09-20 20:21:15  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SEa]

2025-09-21 03:56:05   --> billing_portal.configuration.created [evt_1SJL]
2025-09-21 03:56:05   --> billing_portal.configuration.updated [evt_1SwW]
2025-09-21 03:56:08  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SwW]
2025-09-21 03:56:08  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SJL]
2025-09-21 03:58:43   --> billing_portal.configuration.updated [evt_1SQW]
2025-09-21 03:58:44  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SQW]
2025-09-21 04:03:22   --> billing_portal.session.created [evt_1SSt]
2025-09-21 04:03:24  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SSt]
2025-09-21 04:08:46   --> setup_intent.created [evt_1SIf]
2025-09-21 04:08:46  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SIf]

2025-09-21 04:15:17   --> customer.subscription.updated [evt_1SeJ]
2025-09-21 04:15:17  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SeJ]

2025-09-21 04:18:12   --> customer.subscription.deleted [evt_1SoF]  → 🎯 THIS IS OUR WORKING EVENT AREA
2025-09-21 04:18:17  <--  [200] POST [WEBHOOK - ENDPOINT] [evt_1SoF]
```
