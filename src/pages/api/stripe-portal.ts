import { stripe } from "../../utils/stripe";
export default async ({ query: { customer, return_url } }, res) =>
  stripe()
    .billingPortal.sessions.create({
      customer,
      return_url,
    })
    .then(
      ({ url }) => Promise.resolve(res.json({ url })),
      () =>
        Promise.resolve(res.status(400).send("Could not retrieve stripe url"))
    );
