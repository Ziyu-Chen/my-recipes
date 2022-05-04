const makeRecipe = require("../entities");

function buildEditRecipe({ recipesDb }) {
  return async function editRecipe(recipeInfo) {
    const recipe = makeRecipe({ ...recipeInfo, isPublished: false, modifiedOn: null });

    const ingredients = recipe.getIngredients().map((ingredient) => ({
      name: ingredient.getName(),
      unit: ingredient.getUnit(),
      quantity: ingredient.getQuantity()
    }));
    const updatedRecipe = await recipesDb.update({
      id: recipe.getId(),
      notes: recipe.getNotes(),
      difficulty: recipe.getDifficulty(),
      type: recipe.getType(),
      ingredients,
      published: recipe.isPublished(),
      modifiedOn: recipe.getModifiedOn()
    });
    return updatedRecipe;
  };
}

module.exports = buildEditRecipe;
