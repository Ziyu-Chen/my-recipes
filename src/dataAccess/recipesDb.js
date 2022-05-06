const Id = require("../Id");

async function makeRecipesDb({ makeDb }) {
  const db = await makeDb();
  const recipesCollection = db.collection("recipes");

  return Object.freeze({
    findById,
    findByName,
    insert,
    update,
    remove
  });

  async function findById({ id: _id }) {
    const result = await recipesCollection.find({ _id });
    const recipes = await result.toArray();
    if (recipes.length === 0) return null;
    const { _id: id, ...info } = recipes[0];
    return { id, ...info };
  }
  async function findByName({ name }) {
    const result = await recipesCollection.find({ name });
    const recipes = await result.toArray();
    if (recipes.length === 0) return null;
    const { _id: id, ...info } = recipes[0];
    return { id, ...info };
  }
  async function insert({ id: _id, ...info }) {
    const { acknowledged, insertedId: id } = await recipesCollection.insertOne({ _id, ...info });
    if (!acknowledged) throw new Error("Not inserted");
    return { id, ...info };
  }
  async function update({ id: _id, ...info }) {
    const { matchedCount, modifiedCount } = await recipesCollection.updateOne(
      { _id },
      {
        $set: { ...info }
      }
    );
    if (matchedCount === 0) throw new Error("Non-existent recipes cannot be edited");
    if (modifiedCount === 0) throw new Error("Not modified");
    return { id: _id };
  }
  async function remove({ id: _id }) {
    await findById({ id: _id });
    const { deletedCount } = await recipesCollection.deleteOne({ _id });
    if (deletedCount === 0) throw new Error("Non-existent recipes cannot be deleted");
    return { id: _id };
  }
}

module.exports = makeRecipesDb;
