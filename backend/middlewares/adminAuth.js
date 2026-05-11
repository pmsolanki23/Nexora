const adminAuth = async (req, res, next) => {
  try {
    if (req.role !== "admin") {
      return res.json({
        success: false,
        message: "Admin Only",
      });
    }

    next();
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default adminAuth;
