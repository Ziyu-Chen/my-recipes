const makeRecipe = require("./index");
const makeFakeRecipe = require("../../__test__/makeFakeRecipe");

describe("Recipe", () => {
  it("should have a valid id", () => {
    const recipe = makeFakeRecipe({ id: 1 });
    expect(() => makeRecipe(recipe)).toThrow("Recipe must have a valid id");
  });

  it("should have a name that contains 1-100 characters", () => {
    const recipe1 = makeFakeRecipe({ name: null });
    expect(() => makeRecipe(recipe1)).toThrow("name: Name can't be blank");
    const recipe2 = makeFakeRecipe({ name: "" });
    expect(() => makeRecipe(recipe2)).toThrow("name: Name must contain at least 1 character");
    const recipe3 = makeFakeRecipe({ name: Array(101).fill("a").join("") });
    expect(() => makeRecipe(recipe3)).toThrow("name: Name must contain fewer than 100 characters");
  });

  it("should have notes that contain 1-1000 characters", () => {
    const recipe1 = makeFakeRecipe({ notes: null });
    expect(() => makeRecipe(recipe1)).toThrow("notes: Notes can't be blank");
    const recipe2 = makeFakeRecipe({ notes: "" });
    expect(() => makeRecipe(recipe2)).toThrow("notes: Notes must contain at least 1 character");
    const recipe3 = makeFakeRecipe({ notes: Array(1001).fill("a").join("") });
    expect(() => makeRecipe(recipe3)).toThrow("notes: Notes must contain fewer than 1000 characters");
  });

  it("should have an author that is a valid email", () => {
    const recipe1 = makeFakeRecipe({ author: null });
    expect(() => makeRecipe(recipe1)).toThrow("author: Author can't be blank");
    const recipe2 = makeFakeRecipe({ author: "Ziyu Chen" });
    expect(() => makeRecipe(recipe2)).toThrow("author: Author is not a valid email");
  });

  it("should have a difficulty that is an integer between 1 and 5", () => {
    const recipe1 = makeFakeRecipe({ difficulty: null });
    expect(() => makeRecipe(recipe1)).toThrow("difficulty: Difficulty can't be blank");
    const recipe2 = makeFakeRecipe({ difficulty: 0 });
    expect(() => makeRecipe(recipe2)).toThrow("difficulty: Difficulty must be an integer between 1 and 5");
    const recipe3 = makeFakeRecipe({ difficulty: 6 });
    expect(() => makeRecipe(recipe3)).toThrow("difficulty: Difficulty must be an integer between 1 and 5");
    const recipe4 = makeFakeRecipe({ difficulty: 4.5 });
    expect(() => makeRecipe(recipe4)).toThrow("difficulty: Difficulty must be an integer between 1 and 5");
  });

  it("should have a type that contains 1-20 characters", () => {
    const recipe1 = makeFakeRecipe({ type: null });
    expect(() => makeRecipe(recipe1)).toThrow("type: Type can't be blank");
    const recipe2 = makeFakeRecipe({ type: "" });
    expect(() => makeRecipe(recipe2)).toThrow("type: Type must contain at least 1 character");
    const recipe3 = makeFakeRecipe({ type: Array(21).fill("a").join("") });
    expect(() => makeRecipe(recipe3)).toThrow("type: Type must contain fewer than 20 characters");
  });

  it("should have valid ingredients", () => {
    const recipe1 = makeFakeRecipe({ ingredients: [] });
    expect(() => makeRecipe(recipe1)).toThrow("Recipe must have at least one ingredient");
    const recipe2 = makeFakeRecipe({ ingredients: [{ name: null, unit: "liter(s)", quantity: 100 }] });
    expect(() => makeRecipe(recipe2)).toThrow("name: Name can't be blank");
    const recipe3 = makeFakeRecipe({ ingredients: [{ name: "Water", unit: null, quantity: 100 }] });
    expect(() => makeRecipe(recipe3)).toThrow("unit: Unit can't be blank");
    const recipe4 = makeFakeRecipe({ ingredients: [{ name: null, unit: "liter(s)", quantity: null }] });
    expect(() => makeRecipe(recipe4)).toThrow("quantity: Quantity can't be blank");
    const recipe5 = makeFakeRecipe({ ingredients: [{ name: "Water", unit: "degree(s)", quantity: 100 }] });
    expect(() => makeRecipe(recipe5)).toThrow("unit: Unit must be valid");
    const recipe6 = makeFakeRecipe({
      ingredients: [
        { name: "Pork", unit: "gram(s)", quantity: 100 },
        { name: "Water", unit: "degree(s)", quantity: 100 }
      ]
    });
    expect(() => makeRecipe(recipe6)).toThrow("unit: Unit must be valid");
  });

  it("should have valid ingredients", () => {
    const recipe1 = makeFakeRecipe({ ingredients: [] });
    expect(() => makeRecipe(recipe1)).toThrow("Recipe must have at least one ingredient");
    const recipe2 = makeFakeRecipe({ ingredients: [{ name: null, unit: "liter(s)", quantity: 100 }] });
    expect(() => makeRecipe(recipe2)).toThrow("name: Name can't be blank");
    const recipe3 = makeFakeRecipe({ ingredients: [{ name: "Water", unit: null, quantity: 100 }] });
    expect(() => makeRecipe(recipe3)).toThrow("unit: Unit can't be blank");
    const recipe4 = makeFakeRecipe({ ingredients: [{ name: null, unit: "liter(s)", quantity: null }] });
    expect(() => makeRecipe(recipe4)).toThrow("quantity: Quantity can't be blank");
    const recipe5 = makeFakeRecipe({ ingredients: [{ name: "Water", unit: "degree(s)", quantity: 100 }] });
    expect(() => makeRecipe(recipe5)).toThrow("unit: Unit must be valid");
    const recipe6 = makeFakeRecipe({
      ingredients: [
        { name: "Pork", unit: "gram(s)", quantity: 100 },
        { name: "Water", unit: "degree(s)", quantity: 100 }
      ]
    });
    expect(() => makeRecipe(recipe6)).toThrow("unit: Unit must be valid");
  });

  it("should have sanitized notes", () => {
    const regularRecipe = makeRecipe({
      ...makeFakeRecipe({ notes: "<p>This is fine</p>" })
    });
    const contaminatedRecipe = makeRecipe({
      ...makeFakeRecipe({
        notes: "<script>This is not so fine</script><p>but this is ok</p>"
      })
    });
    const completelyContaminatedRecipe = makeFakeRecipe({
      notes: "<script>All your base belongs to us!</script>"
    });

    expect(regularRecipe.getNotes()).toBe("<p>This is fine</p>");
    expect(contaminatedRecipe.getNotes()).toBe("<p>but this is ok</p>");
    expect(() => makeRecipe(completelyContaminatedRecipe)).toThrow("notes: Notes must contain at least 1 character");
  });

  it("should have functioning methods", () => {
    const recipe = makeFakeRecipe();
    const correctRecipe = makeRecipe(recipe);
    expect(correctRecipe.getName()).toBe(recipe.name);
    expect(correctRecipe.getNotes()).toBe(recipe.notes);
    expect(correctRecipe.getAuthor()).toBe(recipe.author);
    expect(correctRecipe.getDifficulty()).toBe(recipe.difficulty);
    expect(correctRecipe.getType()).toBe(recipe.type);
    const ingredients = correctRecipe.getIngredients();
    for (let i = 0; i < ingredients.length; i++) {
      expect(ingredients[i].getName()).toBe(recipe.ingredients[i].name);
      expect(ingredients[i].getUnit()).toBe(recipe.ingredients[i].unit);
      expect(ingredients[i].getQuantity()).toBe(recipe.ingredients[i].quantity);
    }
  });

  it("can be published", () => {
    const unpublished = makeFakeRecipe({ published: false });
    const recipe = makeRecipe(unpublished);
    expect(recipe.isPublished()).toBe(false);
    recipe.publish();
    expect(recipe.isPublished()).toBe(true);
  });

  it("can be unpublished", () => {
    const published = makeFakeRecipe({ published: true });
    const recipe = makeRecipe(published);
    expect(recipe.isPublished()).toBe(true);
    recipe.unpublish();
    expect(recipe.isPublished()).toBe(false);
  });

  it("should be created now", () => {
    const noCreationDate = makeFakeRecipe();
    expect(noCreationDate.createdOn).not.toBeDefined();
    const createdOn = makeRecipe(noCreationDate).getCreatedOn();
    expect(createdOn).toBeDefined();
    expect(new Date().getTime() - new Date(createdOn).getTime()).toBeLessThan(10);
  });

  it("should be modified now", () => {
    const noModificationDate = makeFakeRecipe();
    expect(noModificationDate.modifiedOn).not.toBeDefined();
    const modifiedOn = makeRecipe(noModificationDate).getCreatedOn();
    expect(modifiedOn).toBeDefined();
    expect(new Date().getTime() - new Date(modifiedOn).getTime()).toBeLessThan(10);
  });
});
