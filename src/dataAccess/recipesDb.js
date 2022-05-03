const Id = require("../Id");

function makeRecipesDb({ makeDb }) {
  return Object.freeze({
    findById,
    findByName,
    insert
  });
  async function findById({ id: _id }) {
    const db = await makeDb();
    const result = await db.collection("recipes").find({ _id });
    const recipes = await result.toArray();
    if (recipes.length === 0) return null;
    const { _id: id, ...info } = recipes[0];
    return { id, ...info };
  }
  async function findByName({ name }) {
    const db = await makeDb();
    const result = await db.collection("recipes").find({ name });
    const recipes = await result.toArray();
    if (recipes.length === 0) return null;
    const { _id: id, ...info } = recipes[0];
    return { id, ...info };
  }
  async function insert({ id: _id = Id.makeId(), ...info }) {
    const db = await makeDb();
    const { acknowledged, insertedId: id } = await db.collection("recipes").insertOne({ _id, ...info });
    if (!acknowledged) throw new Error("Not inserted");
    return { id, ...info };
  }
}

module.exports = makeRecipesDb;
