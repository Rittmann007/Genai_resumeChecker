const {validationResult} = require("express-validator")

// Validation middleware function
/**
 * @name handleValidationErrors 
 * @description takes express validator errors and returns them in a structured
 * format in an array
 * @returns errors array in response
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = handleValidationErrors