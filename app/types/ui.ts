export interface SelectOption<V extends string | number = string | number> {
  value: V
  label: string
  icon?: string
}
