import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = token_decode.id;

    req.role = token_decode.role || "user";
    next();
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
