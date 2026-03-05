/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      letterSpacing: {
        tightest: '-.04em',
      },
      // ДОБАВЛЕНО: Плавная анимация появления
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#111',
            a: {
              color: '#111',
              textDecoration: 'underline',
              textUnderlineOffset: '4px', // Отодвигаем подчеркивание от текста
              textDecorationColor: '#d1d5db', // Светло-серое подчеркивание
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#000',
                textDecorationColor: '#000', // При наведении становится черным
              },
            },
            li: {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};