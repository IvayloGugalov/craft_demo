export type FormFields = {
  label: string
  required: boolean
  choices: string[]
  displayAlpha: boolean
  default: string
}

export const DisplayOrder = {
  alphabetical: 'alphabetical',
  unOrdered: 'un-ordered',
} as const