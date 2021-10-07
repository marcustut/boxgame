import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      cursor: {
        grab: 'grab'
      },
      colors: {
        warning: '#fdd000',
        success: '#7FBA7A',
        error: '#FF754C',
        primary: {
          DEFAULT: '#37a18e',
          ring: '#67e0c6',
          hover: '#398574',
          disabled: '#fffae6'
        },
        secondary: {
          DEFAULT: '#df445c',
          ring: '#e06578',
          hover: '#c73c51',
          light: '#ffb5c1',
          disabled: '#942e3e'
        },
        background: {
          light: '#f9f9f9',
          dark: '#1f2937'
        },
        white: '#fff',
        black: '#000'
      }
    }
  },
  plugins: [require('windicss/plugin/line-clamp'), require('windicss/plugin/forms')]
})
