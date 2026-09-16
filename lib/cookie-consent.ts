export const COOKIE_CONSENT_NAME = 'burgama-cookie-consent'
export const COOKIE_CONSENT_EVENT = 'burgama:cookie-consent'
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

const HEADLINE_COOKIE_NAME = 'burgama-hero-message'

type CookieConsent = 'accepted' | 'necessary'

function readCookie(name: string) {
  if (typeof document === 'undefined') return null
  const prefix = `${name}=`
  const cookie = document.cookie.split('; ').find((value) => value.startsWith(prefix))
  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

function writeCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE_SECONDS) {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

export function getCookieConsent(): CookieConsent | null {
  const value = readCookie(COOKIE_CONSENT_NAME)
  return value === 'accepted' || value === 'necessary' ? value : null
}

export function setCookieConsent(value: CookieConsent) {
  writeCookie(COOKIE_CONSENT_NAME, value)
}

export function readHeadlinePreference() {
  const value = readCookie(HEADLINE_COOKIE_NAME)
  return value !== null && /^[0-2]$/.test(value) ? Number(value) : null
}

export function setHeadlinePreference(value: number) {
  writeCookie(HEADLINE_COOKIE_NAME, String(value))
}

export function clearHeadlinePreference() {
  writeCookie(HEADLINE_COOKIE_NAME, '', 0)
}

export type { CookieConsent }
