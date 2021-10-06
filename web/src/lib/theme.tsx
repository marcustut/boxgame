import React, { createContext, useContext, useMemo } from 'react'
import { useMediaQuery } from '@mui/material'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import { useLocalStorage } from 'react-use'
import CssBaseline from '@mui/material/CssBaseline'

type ThemeName = 'dark' | 'light'
interface IChosenTheme {
  theme: ThemeName
  setTheme: React.Dispatch<React.SetStateAction<ThemeName | undefined>>
}

export const ChosenTheme = createContext<IChosenTheme>({} as IChosenTheme)

export const ChosenThemeProvider: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [theme, setTheme] = useLocalStorage<ThemeName>('theme', prefersDarkMode ? 'dark' : 'light', { raw: true })

  if (theme) {
    return <ChosenTheme.Provider value={{ theme, setTheme }}>{children}</ChosenTheme.Provider>
  } else {
    return <></>
  }
}

export const ThemeProvider: React.FC = ({ children }) => {
  const { theme } = useContext(ChosenTheme)
  const muiTheme = useMemo(() => createThemeHelper(theme), [theme])

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

const brandColor = '#ff781f'
const createThemeHelper = (theme: 'dark' | 'light') => {
  const isDark = theme === 'dark'
  return createTheme({
    palette: {
      mode: theme,
      background: {
        default: isDark ? '#212121' : '#f0f0f0',
        paper: isDark ? '#242526' : '#fffff'
      },
      primary: {
        main: brandColor
      },
      error: {
        main: 'rgb(232, 51, 51)'
      },
      success: {
        main: 'rgb(76,175,80)'
      }
    }
  })
}
