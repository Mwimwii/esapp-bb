const StyleDictionary = require('style-dictionary').extend('./design-tokens/config.json');

const transforms = require("./transforms");
const formats = require("./formats");

const app = 'titl';

transforms.forEach(t => {
    console.info(`Registering Transform: '${t.name}'`);
    StyleDictionary.registerTransform(t);
});

formats.forEach(f => {
    console.info(`Registering Format: '${f.name}'`);
    StyleDictionary.registerFormat(f);
});

StyleDictionary.registerTransformGroup({
    name: `${app}Default`,
    transforms: ["attribute/cti", `name/cti/${app}TokenName`, "size/rem", "color/css"]
});

StyleDictionary.buildAllPlatforms();
