const { makeDb, closeDb, clearDb } = require("../../__test__/db");
const makeRecipesDb = require("../dataAccess/recipesDb");
const buildAddRecipe = require("./addRecipe");
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

describe("Add Recipe", () => {
  let recipesDb;
  let addRecipe;

  beforeAll(() => {
    recipesDb = makeRecipesDb({ makeDb });
    addRecipe = buildAddRecipe({ recipesDb });
  });

  afterAll(async () => {
    await clearDb();
    await closeDb();
  });

  it("should insert recipe into the database", async () => {
    const recipe = makeFakeRecipe();
    const insertedRecipe = await addRecipe(recipe);
    expect(Id.isValidId(insertedRecipe.id)).toBeTrue;

    verifyEquality(insertedRecipe, recipe);
    const foundRecipe = await recipesDb.findById({ id: insertedRecipe.id });
    expect(foundRecipe.id).toBe(insertedRecipe.id);
    verifyEquality(foundRecipe, recipe);
  });

  it("should not insert a recipe if there is already a recipe with the same name in the database", async () => {
    const recipe1 = makeFakeRecipe({ name: "Sheng Jian Bao", notes: "It's very simple!", author: "adfasdf@nyu.edu" });
    const insertedRecipe1 = await addRecipe(recipe1);
    const recipe2 = makeFakeRecipe({
      name: "Sheng Jian Bao",
      notes: "Yes, you need some new notes.",
      author: "zccafads3@nyu.edu"
    });
    const insertedRecipe2 = await addRecipe(recipe2);
    expect(insertedRecipe1.id).toBe(insertedRecipe2.id);
    verifyEquality(insertedRecipe1, insertedRecipe2);
  });
});
