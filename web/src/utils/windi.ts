import { WindiUtilities } from '@/types/windi'

/**
 * Get a specified utility's className string
 * @param utilities - the utilities object
 * @param key - the utility to get
 * @param defaultClassName - an optional fallback className
 * @returns the utility's className string if found else the default className
 */
export const getUtilityString = (
  utilities: WindiUtilities | undefined,
  key: keyof WindiUtilities,
  defaultClassName = ''
): string => {
  // if utilities or the specified utility is undefined, return the default className
  if (!utilities || !utilities[key]) return defaultClassName

  return utilities[key] as string
}

/**
 * Construct className string from given utilities object
 * @param utilities - the utilites object
 * @param defaultUtilities - the default utilities object for a component
 * @param className - the additional className
 * @returns the constructed utilities className string, if utilities is undefined
 *          it will construct the className from default utilites.
 */
export const constructClassName = (
  utilities: WindiUtilities | undefined,
  defaultUtilities: WindiUtilities,
  className = ''
): string => {
  // join all default utilites
  const defaultUtilitiesCN = Object.values(defaultUtilities).join(' ')

  // if utitlies is undefined, return the default utilities
  if (!utilities) return `${defaultUtilitiesCN} ${className}`

  // merge two utilities into default utilities
  const utilitiesMerged = { ...defaultUtilities, ...utilities }

  // form classNames from the merged utilities
  const utilitiesCN = Object.values(utilitiesMerged).join(' ')

  return `${utilitiesCN} ${className}`
}
