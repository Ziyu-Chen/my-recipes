const { makeDb, closeDb, clearDb } = require("../../__test__/db");
const makeRecipesDb = require("../dataAccess/recipesDb");
const buildAddRecipe = require("./addRecipe");
const buildEditRecipe = require("./editRecipe");
const makeFakeRecipe = require("../../__test__/makeFakeRecipe");
const Id = require("../Id");

function verifyEquality(recipe, benchmarkRecipe) {
  expect(recipe.name).toBe(benchmarkRecipe.name);
  expect(recipe.notes).toBe(benchmarkRecipe.notes);
  expect(recipe.author).toBe(benchmarkRecipe.author);
  expect(recipe.difficulty).toBe(benchmarkRecipe.difficulty);
  expect(recipe.type).toBe(benchmarkRecipe.type);
  const ingredients = benchmarkRecipe.ingredients;
  for (let i = 0; i < ingredients.length; i++) {
    expect(ingredients[i].name).toBe(benchmarkRecipe.ingredients[i].name);
    expect(ingredients[i].unit).toBe(benchmarkRecipe.ingredients[i].unit);
    expect(ingredients[i].quantity).toBe(benchmarkRecipe.ingredients[i].quantity);
  }
}

describe("Edit Recipe", () => {
  let recipesDb;
  let addRecipe;
  let editRecipe;

  beforeAll(async () => {
    recipesDb = await makeRecipesDb({ makeDb });
    addRecipe = buildAddRecipe({ recipesDb });
    editRecipe = buildEditRecipe({ recipesDb });
  });

  it("should throw an error when the recipe to be edited does not exist in the database", async () => {
    const recipe = makeFakeRecipe({ id: Id.makeId() });
    expect(editRecipe(recipe)).rejects.toThrow("Non-existent recipes cannot be edited");
  });

  it("should edit an existing recipe without publishing it", async () => {
    const recipe = makeFakeRecipe({ notes: "This is a great recipe." });
    const insertedRecipe = await addRecipe(recipe);
    const newRecipe = makeFakeRecipe({
      id: insertedRecipe.id,
      notes: "This is a even greater recipe.",
      published: true
    });
    const { id } = await editRecipe(newRecipe);
    expect(id).toBe(insertedRecipe.id);
    const editedRecipe = await recipesDb.findById({ id });
    expect(editedRecipe.id).toBe(insertedRecipe.id);
    verifyEquality(editedRecipe, newRecipe);
    expect(editedRecipe.published).toBeFalse;
  });
});
