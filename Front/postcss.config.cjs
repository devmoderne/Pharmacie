// postcss.config.cjs
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
  plugins: [
    require('tailwindcss'),  // Ajoutez Tailwind CSS
    require('autoprefixer'),  // Ajoutez Autoprefixer pour la compatibilité des navigateurs
  ],
};
