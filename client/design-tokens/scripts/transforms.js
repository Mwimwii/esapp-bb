const {
  getPropNamePatterns,
  getTransformer
} = require('./transforms-helpers');

const titlTokenName = {
  name: "name/cti/titlTokenName",
  type: "name",
  transformer: prop => {
    return getTransformer(
      prop,
      getPropNamePatterns(prop),
      true
    );
  }
};

module.exports = [titlTokenName];
