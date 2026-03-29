// postcss.config.cjs
module.exports = {
<<<<<<< HEAD
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
=======
  plugins: [
    require('tailwindcss'),  // Ajoutez Tailwind CSS
    require('autoprefixer'),  // Ajoutez Autoprefixer pour la compatibilité des navigateurs
  ],
};
>>>>>>> a45223998defebbae8d29fde1e3be01e5f3c73f8
