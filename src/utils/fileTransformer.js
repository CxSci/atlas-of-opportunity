const path = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  // eslint-disable-next-line no-unused-vars
  process(_src, filename, _config, _options) {
    return "module.exports = " + JSON.stringify(path.basename(filename)) + ";";
  },
};
