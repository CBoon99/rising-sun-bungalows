/** One-shot Identity invite. Call with ?k=INVITE_ONCE then delete this function. */
exports.handler = async (event, context) => {
  const key = (event.queryStringParameters && event.queryStringParameters.k) || "";
  if (!process.env.INVITE_ONCE || key !== process.env.INVITE_ONCE) {
    return { statusCode: 401, body: "no" };
  }
  const identity = context.clientContext && context.clientContext.identity;
  if (!identity || !identity.url || !identity.token) {
    return { statusCode: 500, body: "identity not on this function context" };
  }
  const r = await fetch(identity.url + "/invite", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + identity.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: "risingsunbungalows@gmail.com" }),
  });
  const text = await r.text();
  return { statusCode: r.status, body: text };
};
