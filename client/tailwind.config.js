const { color: colors, font } = require('./design-tokens/dist/titl-design-tokens');

const {
  family: fontFamily,
  leading: lineHeight,
  size: fontSize,
  weight: fontWeight
} = font;

module.exports = {
  mode: 'jit',
  purge: [
   './public/**/*.html',
   './src/**/*.{js,jsx,ts,tsx,vue}',
   ],
  darkMode: false,
  theme: {
    extend: {
      fontFamily,
      fontSize,
      fontWeight,
      lineHeight,
      minWidth: {
        '32': '8rem',
      },
      minHeight: {
        '15': '3.75rem',
      },
      width: {
        overlayCard: '36rem',
        '5/16': '31.25%',
        '7/16': '43.75%',
        '4/16': '25%'
      },
      skew: {
        full: '90deg',
      },
    },
    colors,
  },
  variants: {
    extend: {}
  },
  plugins: []
};
