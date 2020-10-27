const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [autoprefixer({ overrideBrowserslist: "cover 99.5%" })],
};
