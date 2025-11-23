const addRequestContext = (requestContexts) => (req, res, next) => {
  req.context = {};

  if (
    !requestContexts ||
    typeof requestContexts !== "object" ||
    Array.isArray(requestContexts)
  ) {
    throw new Error("Invalid request context : Not an object");
  }

  const contexts = Object.keys(requestContexts);

  for (let context of contexts) {
    req.context[context] = requestContexts[context];
  }

  next();
};

module.exports = addRequestContext;
