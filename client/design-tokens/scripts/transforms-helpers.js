const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

const attributesToString = (attributesArray) =>
  attributesArray
    .filter(Boolean)
    .join("");

const getPropNamePatterns = (prop) => {
  let { category, type, item, subitem } = prop.attributes;

  category = category === "base" ? "" : category;
  type = type === "base" ? "" : type;
  item = item === "base" ? "" : item;
  subitem = subitem === "base" ? "" : subitem;

  return {
    c_t_i: attributesToString([category, capitalize(type), capitalize(item)]),
    i_t_si: attributesToString([item, capitalize(type), ...(subitem ? ["-"] : []), subitem]),
  };
};

const getTransformer = (prop, namePatterns) => {
  const { category } = prop.attributes;

  if (category === "color") {
    return namePatterns.i_t_si;
  } else {
    return namePatterns.c_t_i;
  }
};

module.exports = {getPropNamePatterns, getTransformer};