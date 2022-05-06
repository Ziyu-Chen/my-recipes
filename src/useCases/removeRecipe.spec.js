const { makeDb, closeDb, clearDb } = require("../../__test__/db");
const makeRecipesDb = require("../dataAccess/recipesDb");
const buildAddRecipe = require("./addRecipe");
const buildRemoveRecipe = require("./removeRecipe");
const makeFakeRecipe = require("../../__test__/makeFakeRecipe");
const Id = require("../Id");

describe("Remove Recipe", () => {
  let recipesDb;
  let addRecipe;
  let removeRecipe;

  beforeAll(async () => {
    recipesDb = await makeRecipesDb({ makeDb });
    addRecipe = buildAddRecipe({ recipesDb });
    removeRecipe = buildRemoveRecipe({ recipesDb });
  });

  it("should throw an error when the recipe to be removed does not exist in the database", () => {
    expect(removeRecipe({ id: Id.makeId() })).rejects.toThrow("Non-existent recipes cannot be deleted");
  });

  it("should remove a recipe", async () => {
    const recipe = makeFakeRecipe({ isPublished: true });
    const insertedRecipe = await addRecipe(recipe);
    const foundRecipe = await recipesDb.findById({ id: insertedRecipe.id });
    expect(foundRecipe.id).toBe(insertedRecipe.id);
    const { id: removedId } = await removeRecipe({ id: insertedRecipe.id });
    expect(removedId).toBe(insertedRecipe.id);
    const nonExistentRecipe = await recipesDb.findById({ id: insertedRecipe.id });
    expect(nonExistentRecipe).toBe(null);
  });
});
