const DEMO_USER_ID = 6;

function blockDemoWrites(req, res, next) {
  if (!req.session?.userId) return next();

  const isDemoUser = req.session.userId === DEMO_USER_ID;
  const isWriteMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);

  if (isDemoUser && isWriteMethod) {
    return res.status(403).json({
      message: "Demo mode is read-only"
    });
  }

  next();
}

module.exports = blockDemoWrites;
