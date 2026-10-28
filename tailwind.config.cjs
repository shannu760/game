module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          bg: '#080B14',
          secondaryBg: '#101625',
          card: '#151D30',
          primary: '#8B5CF6',
          secondary: '#22D3EE',
          success: '#34D399',
          warning: '#FBBF24',
          text: '#F8FAFC',
          muted: '#94A3B8',
          border: 'rgba(148,163,184,0.16)',
        },
      },
    },
  },
  plugins: [],
}
