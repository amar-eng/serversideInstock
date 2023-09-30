//credit for isValidPhone to Paul Schreiber on stack overflow

const isValidPhone = (phone) => {
  var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  var digits = phone.replace(/\D/g, "");
  return phoneRegex.test(digits);
};

//credit for isValidemail to user rnevius on stack overflow
const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

module.exports = (req, res, next) => {
  const { name, address, city, country, contact } = req.body;
  if (!name) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!address) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!city) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!country) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!contact) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!contact.name) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!contact.phone) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!contact.position) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!contact.email) {
    return res.status(422).json({
      error: "This field is required",
    });
  }

  if (!isValidPhone(contact.phone)) {
    return res.status(422).json({
      error: "Phone number is not valid",
    });
  }

  if (!isValidEmail(contact.email)) {
    return res.status(422).json({
      error: "Email is not valid",
    });
  }

  next();
};
