import React, { createContext, Dispatch, FC, SetStateAction } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useLocalStorage } from 'react-use'

export const ChosenTheme = createContext<IChosenTheme>({} as IChosenTheme)

export const ChosenThemeProvider: FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [theme, setTheme] = useLocalStorage<ThemeName>('theme', prefersDarkMode ? 'dark' : 'light', { raw: true })

  if (theme) {
    return <ChosenTheme.Provider value={{ theme, setTheme }}>{children}</ChosenTheme.Provider>
  } else {
    return <></>
  }
}

type ThemeName = 'dark' | 'light'
interface IChosenTheme {
  theme: ThemeName
  setTheme: Dispatch<SetStateAction<ThemeName | undefined>>
}
