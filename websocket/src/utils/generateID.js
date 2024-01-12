const { v4: uuidv4 } = require("uuid");

const generateID = () => uuidv4();

module.exports = generateID;
