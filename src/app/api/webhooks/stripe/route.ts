import { db } from "@/db"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    const event = stripe.webhooks.constructEvent(
      body,
      signature ?? "",
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    )

    console.log("Stripe event received:\n", event)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId

      console.log("User ID from metadata:\n", userId)

      if (!userId) {
        return new Response("Missing userId in metadata", { status: 400 })
      }

      await db.user.update({
        where: { id: userId },
        data: { plan: "PRO" },
      })
    }

    return new Response("OK")
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
}
