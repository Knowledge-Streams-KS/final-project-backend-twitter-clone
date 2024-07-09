import Joi from "joi";

const userValidator = {
  updateProfile: (req, res, next) => {
    const schema = Joi.object({
      fullName: Joi.string().alphanum().min(3).max(20),
      username: Joi.string().alphanum().min(3).max(20),
      email: Joi.string().email(),
      currentPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
      newPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
      bio: Joi.string().min(1).max(50),
      link: Joi.string(),
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

export default userValidator;
