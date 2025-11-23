const addRequestContext =
  (...requestContexts) =>
  (req, res, next) => {
    req.context = {};
    let contextLength = req.context.length;

    for (let requestContext of requestContexts) {
      req.context[contextLength] = requestContext;
      contextLength++;
    }

    next();
  };

module.exports = addRequestContext;
