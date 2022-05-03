const makeRecipe = require("../entities");

function buildAddRecipe({ recipesDb }) {
  return async function addRecipe(recipeInfo) {
    const recipe = makeRecipe(recipeInfo);
    const existingRecipe = await recipesDb.findByName({ name: recipe.getName() });
    if (existingRecipe) {
      return existingRecipe;
    }

    const ingredients = recipe.getIngredients().map((ingredient) => ({
      name: ingredient.getName(),
      unit: ingredient.getUnit(),
      quantity: ingredient.getQuantity()
    }));
    const insertedRecipe = await recipesDb.insert({
      id: recipe.getId(),
      name: recipe.getName(),
      notes: recipe.getNotes(),
      author: recipe.getAuthor(),
      difficulty: recipe.getDifficulty(),
      type: recipe.getType(),
      ingredients,
      published: recipe.isPublished(),
      createdOn: recipe.getCreatedOn(),
      modifiedOn: recipe.getModifiedOn()
    });
    return insertedRecipe;
  };
}

module.exports = buildAddRecipe;
