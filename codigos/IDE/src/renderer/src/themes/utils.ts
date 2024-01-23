import { themes } from './index'

export interface ITheme {
  [key: string]: string
}

/**
 * This file defines utility functions and interfaces for handling themes in the application.
 * It includes:
 * - Importing the 'themes' object from the index file.
 * - The ITheme, IThemes, and IMappedTheme interfaces to define the structure of a theme.
 * - The 'mapTheme' function which takes a theme and maps it to a new object with CSS variable names as keys.
 * - The 'applyTheme' function which takes a theme name, maps the corresponding theme to CSS variables using 'mapTheme', and applies these variables to the root of the document.
 * - If the theme name is not found in the 'themes' object, 'applyTheme' does nothing.
 */

export interface IThemes {
  [key: string]: ITheme
}

export interface IMappedTheme {
  [key: string]: string | null
}

export const mapTheme = (variables: ITheme): IMappedTheme => {
  return {
    '--color-primary': variables.primary || '',
    '--color-secondary': variables.secondary || '',
    '--color-positive': variables.positive || '',
    '--color-negative': variables.negative || '',
    '--color-text-primary': variables.textPrimary || '',
    '--background-primary': variables.backgroundPrimary || '',
    '--background-sec': variables.backgroundSecondary || ''
  }
}

export const applyTheme = (theme: string): void => {
  const themeObject: IMappedTheme = mapTheme(themes[theme])
  if (!themeObject) return

  const root = document.documentElement

  Object.keys(themeObject).forEach((property) => {
    if (property === 'name') {
      return
    }

    root.style.setProperty(property, themeObject[property])
  })
}

export const extend = (extending: ITheme, newTheme: ITheme): ITheme => {
  return { ...extending, ...newTheme }
}
