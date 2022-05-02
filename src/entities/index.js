const sanitizeHtml = require('sanitize-html');
const validate = require('validate.js');
const Id = require('../Id');
const buildMakeIngredient = require('./ingredient');
const builtMakeRecipe = require('./recipe');
const { generateError } = require('./utils');

function sanitize(text) {
  return sanitizeHtml(text, {
    allowedIframeHostnames: ['codesandbox.io', 'repl.it']
  });
}

const makeIngredient = buildMakeIngredient({ validate, generateError });

const makeRecipe = builtMakeRecipe({ Id, sanitize, validate, makeIngredient, generateError });

module.exports = makeRecipe;
