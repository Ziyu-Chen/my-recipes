function generateError(errorMessages) {
  return Object.entries(errorMessages)
    .map(([key, messages]) => `${key}: ${messages.join(". ")}`)
    .join("\n");
}

module.exports = { generateError };
