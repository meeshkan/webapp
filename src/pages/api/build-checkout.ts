import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-03-02",
});

export default async (req, res) => {
  // Premium monthly
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: "price_1GuiI6A2WCpbIMtYlK6yuCrX", quantity: 1 }],
    mode: "subscription",
    success_url: `${process.env.LOGOUT_REDIRECT_URL}success`,
    cancel_url: `${process.env.LOGOUT_REDIRECT_URL}`,
  });

  res.json(session);
};
