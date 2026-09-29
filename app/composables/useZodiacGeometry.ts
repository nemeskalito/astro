// Угол в градусах: 0° = Aries на востоке (справа), против часовой
// В экранных координатах ось Y инвертирована, поэтому вычитаем угол из 0.
/** Базовое смещение: чтобы 0° Aries был вверху, а не справа */
export const BASE_ROTATION = 90

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
) {
  const rad = ((angleDeg + BASE_ROTATION) * Math.PI) / 180
  return {
    // Минус перед cos зеркалит всё по горизонтали:
    // то, что было слева, окажется справа, и наоборот
    x: cx - radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad)
  }
}

/** SVG-путь сектора-кольца между двумя радиусами */
export function describeAnnularSector(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
): string {
  const p1 = polarToCartesian(cx, cy, outerR, startAngle)
  const p2 = polarToCartesian(cx, cy, outerR, endAngle)
  const p3 = polarToCartesian(cx, cy, innerR, endAngle)
  const p4 = polarToCartesian(cx, cy, innerR, startAngle)

  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0

  // После зеркалирования по X направление обхода меняется,
  // поэтому sweep инвертируем: было 0 → стало 1, было 1 → стало 0
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ')
}

/** Позиция "градус внутри знака" → абсолютный угол на круге */
export function degreeToAngle(signIndex: number, degreeInSign: number): number {
  // Aries начинается с 0°, дальше против часовой
  return signIndex * 30 + degreeInSign
}