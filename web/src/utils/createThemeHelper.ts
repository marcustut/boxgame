import { createTheme } from '@mui/material'

const brandColor = '#37a18e'
export const createThemeHelper = (theme: 'dark' | 'light') => {
  const isDark = theme === 'dark'
  return createTheme({
    palette: {
      mode: theme,
      background: {
        default: isDark ? '#202020' : '#f0f0f0',
        paper: isDark ? '#242526' : '#ffffff'
      },
      primary: {
        main: brandColor
      },
      secondary: {
        main: '#df445c'
      },
      error: {
        main: 'rgb(232, 51, 51)'
      },
      success: {
        main: 'rgb(76,175,80)'
      }
    },
    typography: {
      fontFamily: [
        'Inter',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif'
      ].join(', ')
    }
  })
}
