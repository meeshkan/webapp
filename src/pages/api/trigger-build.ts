export default async (req, res) =>
  fetch("https://meeshkan.io/webhook-prod/trigger-build", {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: {
      "Api-Key": process.env.MEESHKAN_WEBHOOK_TOKEN,
      "Content-Type": "application/json",
    },
  }).then((r) => {
    if (r.status !== 200) {
      res.status(r.status).send("Bad things happened");
      return;
    }

    return r
      .json()
      .then((data) => {
        res.json(data);
      })
      .catch((error) => {
        res.status(error).send("Not JSON");
      });
  });
