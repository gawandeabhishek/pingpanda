import Stripe from "stripe"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePriceId = process.env.STRIPE_PRICE_ID
const appUrl = process.env.NEXT_PUBLIC_APP_URL

if (!stripeSecretKey || !stripePriceId || !appUrl) {
  throw new Error("Missing Stripe or App environment variables.")
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
})

export const createCheckoutSession = async ({
  userEmail,
  userId,
}: {
  userEmail: string
  userId: string
}) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${appUrl}/dashboard?success=true`,
    cancel_url: `${appUrl}/pricing`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
  })

  return session
}
