// postcss.config.cjs
module.exports = {
  plugins: {
    'postcss-nesting': {},  // doit être AVANT Tailwind
    tailwindcss: {},
    autoprefixer: {},
  },
};