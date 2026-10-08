export interface SelectOption<V extends string | number = string | number> {
  value: V
  label: string
  icon?: string
  /** Как фильтровать иконку: по текущей теме оформления (по умолчанию), adaptive — инверсия в тёмной, none — как есть */
  iconFilter?: 'adaptive' | 'none'
}
