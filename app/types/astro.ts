export type Method = 'direct' | 'reverse'

export const PLANETS = [
  'Mars', 'Sun', 'Venus', 'Mercury', 'Moon', 'Saturn', 'Jupiter'
] as const
export type Planet = typeof PLANETS[number]

export const ZODIAC = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
] as const
export type ZodiacSign = typeof ZODIAC[number]

export const MONTHS = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
] as const

export interface DMS {
  degrees: number
  minutes: number
  seconds: number
}

export interface BirthInput {
  day: number
  month: number // 0-11
  year: number
  planet: Planet
  sign: ZodiacSign
  position: DMS
}

export interface CalculationResult {
  planet: Planet
  sign: ZodiacSign
  position: DMS
}

export function getPlanet(index: number): Planet {
  const planet = PLANETS[index]
  if (!planet) throw new Error(`Неверный индекс планеты: ${index}`)
  return planet
}

export function getSign(index: number): ZodiacSign {
  const sign = ZODIAC[index]
  if (!sign) throw new Error(`Неверный индекс знака: ${index}`)
  return sign
}

export const PLANET_SYMBOLS: Record<Planet, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄'
}

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈',
  Taurus: '♉',
  Gemini: '♊',
  Cancer: '♋',
  Leo: '♌',
  Virgo: '♍',
  Libra: '♎',
  Scorpio: '♏',
  Sagittarius: '♐',
  Capricorn: '♑',
  Aquarius: '♒',
  Pisces: '♓'
}