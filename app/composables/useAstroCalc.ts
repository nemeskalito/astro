import type { DMS, BirthInput, CalculationResult, ZodiacSign } from '~/types/astro'
import { ZODIAC } from '~/types/astro'

const TROPICAL_YEAR = 365.24
const SECONDS_PER_DEGREE = 3600
const SECONDS_PER_CIRCLE = 360 * SECONDS_PER_DEGREE
const SECONDS_PER_SIGN = 30 * SECONDS_PER_DEGREE

/** DMS → секунды дуги */
export function dmsToSeconds(dms: DMS): number {
  return dms.degrees * SECONDS_PER_DEGREE
    + dms.minutes * 60
    + dms.seconds
}

/** Секунды дуги → DMS (с нормализацией переносов) */
export function secondsToDms(totalSeconds: number): DMS {
  const s = Math.round(totalSeconds)
  return {
    degrees: Math.floor(s / SECONDS_PER_DEGREE),
    minutes: Math.floor((s % SECONDS_PER_DEGREE) / 60),
    seconds: s % 60
  }
}

/** Разница в днях между двумя датами (UTC, без времени) */
export function daysBetween(
  birth: { day: number; month: number; year: number },
  event: { day: number; month: number; year: number }
): number {
  const MS_PER_DAY = 86_400_000
  const birthUtc = Date.UTC(birth.year, birth.month, birth.day)
  const eventUtc = Date.UTC(event.year, event.month, event.day)
  return Math.round((eventUtc - birthUtc) / MS_PER_DAY)
}

/** Основной расчёт */
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

  // Знаковый индекс изначального положения
  let signIndex = ZODIAC.indexOf(input.sign)

  // 1. Пройденный путь: старт * days / 365.24  (прямой метод)
  //    для обратного — та же формула, но с обратным знаком
  const traveledSeconds =
    (startSeconds * days) / TROPICAL_YEAR * (method === 'direct' ? 1 : -1)

  // 2. Сумма
  let totalSeconds = startSeconds + traveledSeconds

  // 3. Отбрасываем лишние циклы по 360°
  totalSeconds = ((totalSeconds % SECONDS_PER_CIRCLE) + SECONDS_PER_CIRCLE)
    % SECONDS_PER_CIRCLE

  // 4. Отбрасываем лишние тридцатки → сдвигаем знак
  const signShift = Math.floor(totalSeconds / SECONDS_PER_SIGN)
  const withinSign = totalSeconds - signShift * SECONDS_PER_SIGN

  // 5. Итоговый знак
  signIndex = ((signIndex + signShift) % 12 + 12) % 12

  return {
    planet: input.planet,
    sign: ZODIAC[signIndex] as ZodiacSign,
    position: secondsToDms(withinSign)
  }
}

/** Форматирование: "8° 12' 20''" */
export function formatDms(dms: DMS): string {
  return `${dms.degrees}° ${String(dms.minutes).padStart(2, '0')}' ${String(dms.seconds).padStart(2, '0')}''`
}