import type { DMS, BirthInput, CalculationResult, ZodiacSign } from '~/types/astro'
import { ZODIAC } from '~/types/astro'

const TROPICAL_YEAR = 365.24
const SECONDS_PER_DEGREE = 3600
const SECONDS_PER_CIRCLE = 360 * SECONDS_PER_DEGREE
const SECONDS_PER_SIGN = 30 * SECONDS_PER_DEGREE

export function dmsToSeconds(dms: DMS): number {
  return dms.degrees * SECONDS_PER_DEGREE + dms.minutes * 60 + dms.seconds
}

export function secondsToDms(totalSeconds: number): DMS {
  const s = Math.round(totalSeconds)
  return {
    degrees: Math.floor(s / SECONDS_PER_DEGREE),
    minutes: Math.floor((s % SECONDS_PER_DEGREE) / 60),
    seconds: s % 60
  }
}

export function daysBetween(
  birth: { day: number; month: number; year: number },
  event: { day: number; month: number; year: number }
): number {
  const MS_PER_DAY = 86_400_000
  const birthUtc = Date.UTC(birth.year, birth.month, birth.day)
  const eventUtc = Date.UTC(event.year, event.month, event.day)
  return Math.round((eventUtc - birthUtc) / MS_PER_DAY)
}

function calculateDirect(
  startSeconds: number,
  days: number,
  signIndex: number
): { withinSign: number; signIndex: number } {
  const traveled = (startSeconds * days) / TROPICAL_YEAR
  let total = startSeconds + traveled

  total = ((total % SECONDS_PER_CIRCLE) + SECONDS_PER_CIRCLE) % SECONDS_PER_CIRCLE

  const signShift = Math.floor(total / SECONDS_PER_SIGN)
  const withinSign = total - signShift * SECONDS_PER_SIGN
  const newSignIndex = ((signIndex + signShift) % 12 + 12) % 12

  return { withinSign, signIndex: newSignIndex }
}

function calculateReverse(
  startSeconds: number,
  days: number,
  signIndex: number
): { withinSign: number; signIndex: number } {
  const stepBack = SECONDS_PER_SIGN - startSeconds
  const traveled = (stepBack * days) / TROPICAL_YEAR
  let total = startSeconds - traveled

  // Оставляем в диапазоне (−360, 0]
  while (total <= -SECONDS_PER_CIRCLE) total += SECONDS_PER_CIRCLE
  while (total > 0) total -= SECONDS_PER_CIRCLE

  const signBack = Math.ceil(-total / SECONDS_PER_SIGN)
  const withinSign = total + signBack * SECONDS_PER_SIGN
  const newSignIndex = ((signIndex - signBack) % 12 + 12) % 12

  return { withinSign, signIndex: newSignIndex }
}

export function calculatePosition(
  input: BirthInput,
  eventDate: { day: number; month: number; year: number },
  method: 'direct' | 'reverse' = 'direct'
): CalculationResult {
  const days = daysBetween(input, eventDate)

  if (days < 0) {
    throw new Error('Дата события не может быть раньше даты рождения')
  }

  const startSeconds = dmsToSeconds(input.position)
  const signIndex = ZODIAC.indexOf(input.sign)

  const { withinSign, signIndex: newSignIndex } =
    method === 'direct'
      ? calculateDirect(startSeconds, days, signIndex)
      : calculateReverse(startSeconds, days, signIndex)

  return {
    planet: input.planet,
    sign: ZODIAC[newSignIndex] as ZodiacSign,
    position: secondsToDms(withinSign)
  }
}

export function formatDms(dms: DMS): string {
  return `${dms.degrees}°\u2009${String(dms.minutes).padStart(2, '0')}′\u2009${String(dms.seconds).padStart(2, '0')}″`
}