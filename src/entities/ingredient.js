const constraints = {
  name: {
    presence: true,
    length: {
      minimum: 1,
      tooShort: "must be at least 1 character",
      maximum: 20,
      tooLong: "must be fewer than 20 characters."
    }
  },
  unit: {
    presence: true,
    inclusion: {
      within: [
        "gram(s)",
        "kilogram(s)",
        "milliliter(s)",
        "liter(s)",
        "ounce(s)",
        "pound(s)",
        "teaspoon(s)",
        "tablespoon(s)",
        "cup(s)",
        "pint(s)",
        "gallon(s)"
      ],
      message: "must be valid"
    }
  },
  quantity: {
    presence: true,
    numericality: { noStrings: true, greaterThan: 0, message: "Quantity must be larger than 0." }
  }
};

function buildMakeIngredient({ validate, generateError }) {
  return function makeIngredient({ name, unit, quantity } = {}) {
    const errorMessages = validate({ name, unit, quantity }, constraints);
    if (errorMessages) {
      throw new Error(generateError(errorMessages));
    }

    return Object.freeze({
      getName: () => name,
      getUnit: () => unit,
      getQuantity: () => quantity
    });
  };
}

module.exports = buildMakeIngredient;
