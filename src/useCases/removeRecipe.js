function buildRemoveRecipe({ recipesDb }) {
  return async function removeRecipe({ id }) {
    await recipesDb.remove({ id });
    return { id };
  };
}

module.exports = buildRemoveRecipe;
