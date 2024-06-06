import React, { useState } from 'react'
import { FieldService } from '../lib/api/MockService'
import { localStorage } from '../lib/hooks/useLocalStorage'
import { DisplayOrder, FormFields } from '../lib/types/Form'
import { validateForm } from '../lib/utils/validateForm'
import '../styles/Form.css'

const defaultFormFields: FormFields = {
  label: '',
  required: false,
  default: '',
  choices: [],
  displayAlpha: true,
}

const Form = ({ formFieldsData }: { formFieldsData: FormFields }) => {
  const [formFields, setFormFields] = useState<FormFields>(formFieldsData)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target

    const validationError = validateForm(name, value)
    let updatedFormFields
    if (name === 'choices') {
      const newOptions = value.split('\n')

      updatedFormFields = {
        ...formFields,
        choices: newOptions,
      }
    } else if (name === 'displayAlpha') {
      updatedFormFields = {
        ...formFields,
        displayAlpha: value === DisplayOrder.alphabetical,
      }
    } else {
      updatedFormFields = {
        ...formFields,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }
    }
    setFormFields(updatedFormFields)
    localStorage()?.setItem('form-fields', updatedFormFields)

    validationError ? setError(validationError) : setError(null)
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let fieldJson = {
      ...formFields,
      choices: formFields.choices.filter((choice) => choice),
    }

    if (!formFields.choices.includes(formFields.default)) {
      fieldJson = {
        ...fieldJson,
        choices: [...fieldJson.choices, formFields.default],
      }
    }

    setFormFields(fieldJson)
    localStorage()?.setItem('form-fields', fieldJson)

    const result = await FieldService.saveFields(JSON.stringify(fieldJson))
    if (result?.error) {
      alert(result.error)
    }
  }

  const handleClear = () => {
    setFormFields(defaultFormFields)
    localStorage()?.setItem('form-fields', defaultFormFields)
    setError('Label is required.')
  }

  return (
    <article>
      <div className='title'>
        <h2>Field builder</h2>
      </div>

      <form className='form-fields-grid' onSubmit={handleSave}>
        <label>Label</label>
        <input
          type='text'
          name='label'
          className='input-field'
          value={formFields.label}
          onChange={handleInputChange}
        />

        <label>Type</label>
        <div className='checkbox-group'>
          <span>Multi-select</span>
          <input
            type='checkbox'
            name='required'
            className='input-field'
            checked={formFields.required}
            onChange={handleInputChange}
          />
          <span>A Value is required</span>
        </div>

        <label>Default Value</label>
        <input
          type='text'
          name='default'
          className='input-field'
          value={formFields.default}
          onChange={handleInputChange}
        />

        <label>Choices</label>
        <textarea
          name='choices'
          className='input-field'
          value={formFields.choices.join('\n')}
          onChange={handleInputChange}
        />

        <label>Order</label>
        <select
          name='displayAlpha'
          className='input-field'
          value={formFields.displayAlpha ? DisplayOrder.alphabetical : DisplayOrder.unOrdered}
          onChange={handleInputChange}
        >
          <option value={DisplayOrder.alphabetical}>Display choices in Alphabetical</option>
          <option value={DisplayOrder.unOrdered}>Display choices in no order</option>
        </select>

        {error && <div className='error'>{error}</div>}

        <div className='actions'>
          <button type='submit' disabled={!!error}>
            Save changes
          </button>
          <p>Or</p>
          <button type='reset' onClick={handleClear}>
            Cancel
          </button>
        </div>
      </form>
    </article>
  )
}

export default Form
