const {
  dateHeader,
  getMarkdownTablesByType,
  generateTailwindTokenObj
} = require('./formats-helpers');

const tailwindTokenObj = {
    name: "tailwindTokenObj",
    formatter: dictionary => {
      return `/**\n${dateHeader}\n*/\nmodule.exports = ${JSON.stringify(generateTailwindTokenObj(dictionary), null, 2)}`;
    }
};

const markdownColor = {
  name: "markdownColor",
  formatter: dictionary => {
    const typeDisplayNameMap = {
      base: "All Colors",
      bg: "Backgrounds",
      border: "Borders",
      brand: "Brand",
      text: "Text and Icon",
    };
    return getMarkdownTablesByType(dictionary, typeDisplayNameMap);
  }
};

const markdownFont = {
  name: "markdownFont",
  formatter: dictionary => {
    const typeDisplayNameMap = {
      family: "Font stacks",
      leading: "Line Heights",
      size: "Font sizes",
      weight: "Font weights",
    };
    return getMarkdownTablesByType(dictionary, typeDisplayNameMap);
  }
};

module.exports = [tailwindTokenObj, markdownFont, markdownColor];
