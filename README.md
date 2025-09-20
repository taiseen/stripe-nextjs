> 6 - September - 2025

## Stripe Payment System

### Learning context:-

- File & Folder Structure
- Stripe product setup
  - create product link + id
    - same product 2 version for monthly & yearly
  - webhook - local running for testing
    - yarn add stripe
    - install stripe cli and config
    - stripe login
    - stripe listen --forward-to localhost:3000/api/webhooks/stripe  

### UI Packages

- npx shadcn@latest add dropdown-menu
- npx shadcn@latest add navigation-menu
- npx shadcn@latest add badge
- npx shadcn@latest add card

### Database

- prisma + mongodb
- npx prisma init
- npx prisma db push

### Auth System

- [Kinde auth system][authSide]
- [Stripe dashboard][stripe]

[authSide]: https://app.kinde.com
[stripe]: https://dashboard.stripe.com

```js
2025-09-20 20:21:00   --> charge.succeeded [evt_3S9Rf6Hje2ICnTUd0i5dUSuX]
2025-09-20 20:21:00   --> payment_method.attached [evt_1S9Rf9Hje2ICnTUdlBsborgb]
2025-09-20 20:21:00   --> customer.created [evt_1S9Rf9Hje2ICnTUdknbNOtX3]
2025-09-20 20:21:00   --> customer.updated [evt_1S9Rf9Hje2ICnTUdmhmTw8hv]
2025-09-20 20:21:00   --> checkout.session.completed [evt_1S9Rf9Hje2ICnTUdcy58V0iA]
2025-09-20 20:21:00   --> customer.subscription.created [evt_1S9Rf9Hje2ICnTUdVFHqbI8k]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdlBsborgb]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_3S9Rf6Hje2ICnTUd0i5dUSuX]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdknbNOtX3]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdVFHqbI8k]
2025-09-20 20:21:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdmhmTw8hv]
2025-09-20 20:21:01   --> payment_intent.created [evt_3S9Rf6Hje2ICnTUd05DKbA9o]
2025-09-20 20:21:01   --> payment_intent.succeeded [evt_3S9Rf6Hje2ICnTUd0pOlP9Im]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_3S9Rf6Hje2ICnTUd05DKbA9o]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_3S9Rf6Hje2ICnTUd0pOlP9Im]
2025-09-20 20:21:01   --> invoice.created [evt_1S9Rf9Hje2ICnTUdSVzCnfm8]
2025-09-20 20:21:01   --> invoice.finalized [evt_1S9Rf9Hje2ICnTUdRxWb0qOF]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdSVzCnfm8]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdRxWb0qOF]
2025-09-20 20:21:01   --> invoice.paid [evt_1S9Rf9Hje2ICnTUdCrxNG8Qa]
2025-09-20 20:21:01   --> invoice.payment_succeeded [evt_1S9RfAHje2ICnTUdLswxYRwm]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdCrxNG8Qa]
2025-09-20 20:21:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9RfAHje2ICnTUdLswxYRwm]
2025-09-20 20:21:08  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9Rf9Hje2ICnTUdcy58V0iA]
2025-09-20 20:21:15   --> invoice_payment.paid [evt_1S9RfOHje2ICnTUdVmu5PZEa]
2025-09-20 20:21:15  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_1S9RfOHje2ICnTUdVmu5PZEa]
```
