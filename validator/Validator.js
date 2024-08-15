import validate from "validatorjs";

class Validator {

  static async loginValidation(data) {
    let rules = {
      email: "required|email",
      password: "required|max:10|min:4",
    };
    let validation = new validate(data, rules);
    if (validation.fails()) {
      return validation.errors.all();
    }
    return { success: true };
  }
}
export default Validator;
