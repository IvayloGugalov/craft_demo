import { FormFields } from '../types/Form'

export const validateForm = (name: string, value: FormFields[keyof FormFields]) => {
  if (name === 'label' && !value) {
    return 'Label is required.'
  }

  if (name === 'choices') {
    const newChoices = Array.isArray(value) ? value : (value as string).split('\n')
    if (newChoices.length > 50) {
      return 'Cannot have more than 50 choices.'
    }
    if (new Set(newChoices).size !== newChoices.length) {
      return 'Duplicate choices are not allowed.'
    }
  }

  return null
}
