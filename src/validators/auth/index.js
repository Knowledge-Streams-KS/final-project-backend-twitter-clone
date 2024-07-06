import Joi from "joi";

const authValidator = {
  signup: (req, res, next) => {
    const schema = Joi.object({
      fullName: Joi.string().alphanum().min(3).max(20).required(),
      username: Joi.string().alphanum().min(3).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
        .required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) {
      console.log(error);
      let customErrMessage = error.details[0].message;
      customErrMessage = customErrMessage
        .split("")
        .filter((char) => {
          let result = char.match(/^[a-z0-9A-Z ]+$/);
          return result;
        })
        .join("");

      return res.status(400).json({
        message: "Invalid Credentials",
        details: customErrMessage,
      });
    }
    next();
  },
};

export default authValidator;
