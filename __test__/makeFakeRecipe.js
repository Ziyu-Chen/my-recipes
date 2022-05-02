function makeFakeRecipe(customizedRecipe) {
  const recipe = {
    name: "Xiao Long Bao",
    notes: "Making Xiao Long Bao is actually very simple. You just need to follow the steps below.",
    author: "ziyu-chen@abc.com",
    difficulty: 3,
    type: "Shanghainese",
    ingredients: [
      {
        name: "Flour",
        unit: "gram(s)",
        quantity: 200
      },
      {
        name: "Pork",
        unit: "kilogram(s)",
        quantity: 1
      },
      {
        name: "Water",
        unit: "milliliter(s)",
        quantity: 200
      }
    ]
  };
  return { ...recipe, ...customizedRecipe };
}

module.exports = makeFakeRecipe;
