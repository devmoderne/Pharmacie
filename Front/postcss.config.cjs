// postcss.config.cjs
module.exports = {
  plugins: [
    require('tailwindcss'),  // Ajoutez Tailwind CSS
    require('autoprefixer'),  // Ajoutez Autoprefixer pour la compatibilité des navigateurs
  ],
};
