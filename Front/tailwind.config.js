module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}", // Assurez-vous d'inclure toutes les extensions nécessaires
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/forms'), // Si vous utilisez le plugin forms
      require('daisyui'), // Si vous utilisez DaisyUI
    ],
  }