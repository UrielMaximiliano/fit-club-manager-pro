module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#0A3D62', // Azul oscuro
        accent: '#A7D36F', // Verde lima
        accent2: '#8BC34A', // Alternativa verde lima
        text: '#333333', // Gris oscuro
        secondary: '#757575', // Gris medio
        light: '#F5F5F5', // Gris muy claro 
        white: '#FFFFFF',
        border: 'var(--border)', // o el color que desees 
      },
    },
  },
  plugins: [],
}; 