/* eslint-disable no-restricted-syntax */
import { translations } from '@/translations'

// Strongly-typed translation shape based on the `en` dictionary
export type TranslationsType = typeof translations.en

// Helper type: select only keys whose value is a string
export type StringKeysGeneric<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T]

// Short-hand for the project's translations
export type StringTranslationKey = StringKeysGeneric<TranslationsType>

/**
 * Safely get a string translation from a translation object.
 * This enforces at compile time that the key points to a string value.
 */
export function getStringTranslation<K extends StringTranslationKey>(t: TranslationsType, key: K): string {
  return t[key] as unknown as string
}

/** Generic version that works with any translation-like object */
// The helper below intentionally performs a narrow dynamic access on translation-like objects.
// We allow this file to use that pattern because it centralizes and controls the unsafe cast.
/* eslint-disable no-restricted-syntax */
export function getStringTranslationGeneric<T>(t: T, key: StringKeysGeneric<T>): string {
  // internal helper: we intentionally narrow unknown translation-like objects to access a string key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (t as any)[key] as string
}
/* eslint-enable no-restricted-syntax */

export default translations
