const Id = require("../Id");

function makeRecipesDb({ makeDb }) {
  return Object.freeze({
    findById,
    findByName,
    insert,
    update
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
  async function update({ id: _id, ...info }) {
    const db = await makeDb();
    const { matchedCount, modifiedCount } = await db.collection("recipes").updateOne(
      { _id },
      {
        $set: { ...info }
      }
    );
    if (matchedCount == 0) throw new Error("Non-existent recipes cannot be edited");
    if (modifiedCount == 0) throw new Error("Not modified");
    return { id: _id };
  }
}

module.exports = makeRecipesDb;
