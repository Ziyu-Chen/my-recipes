const constraints = {
  name: {
    presence: true,
    length: {
      minimum: 1,
      tooShort: "must contain at least 1 character",
      maximum: 100,
      tooLong: "must contain fewer than 100 characters"
    }
  },
  notes: {
    presence: true,
    length: {
      minimum: 1,
      tooShort: "must contain at least 1 character",
      maximum: 1000,
      tooLong: "must contain fewer than 1000 characters"
    }
  },
  author: {
    presence: true,
    email: true
  },
  difficulty: {
    presence: true,
    inclusion: {
      within: [1, 2, 3, 4, 5],
      message: "must be an integer between 1 and 5"
    }
  },
  type: {
    presence: true,
    length: {
      minimum: 1,
      tooShort: "must contain at least 1 character",
      maximum: 20,
      tooLong: "must contain fewer than 20 characters"
    }
  }
};

function builtMakeRecipe({ Id, sanitize, validate, makeIngredient, RecipeException, generateError }) {
  return function makeRecipe({
    id = Id.makeId(),
    name,
    notes,
    author,
    difficulty,
    type,
    ingredients,
    published = false,
    createdOn = Date.now(),
    modifiedOn = Date.now()
  } = {}) {
    if (!Id.isValidId(id)) {
      throw new Error("Recipe must have a valid id");
    }
    const sanitizedNotes = notes && sanitize(notes).trim();
    const errorMessages = validate({ name, notes: sanitizedNotes, author, difficulty, type }, constraints);
    if (errorMessages) {
      throw new Error(generateError(errorMessages));
    }
    if (ingredients.length < 1) {
      throw new Error("Recipe must have at least one ingredient");
    }

    const validatedIngredients = ingredients.map(makeIngredient);

    return Object.freeze({
      getId: () => id,
      getName: () => name,
      getNotes: () => sanitizedNotes,
      getAuthor: () => author,
      getDifficulty: () => difficulty,
      getType: () => type,
      getIngredients: () => validatedIngredients,
      isPublished: () => published,
      getCreatedOn: () => createdOn,
      getModifiedOn: () => modifiedOn,
      publish: () => {
        published = true;
      },
      unpublish: () => {
        published = false;
      }
    });
  };
}

module.exports = builtMakeRecipe;
