import Joi from "joi";

const postValidator = {
  post: (req, res, next) => {
    const schema = Joi.object({
      text: Joi.string().max(50),
      img: Joi.string().allow(null),
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
        message: customErrMessage,
      });
    }
    next();
  },
  comment: (req, res, next) => {
    const schema = Joi.object({
      text: Joi.string().max(20),
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
        message: customErrMessage,
      });
    }
    next();
  },
};

export default postValidator;
