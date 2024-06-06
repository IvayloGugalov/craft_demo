import { useEffect, useState } from 'react'

import './styles/App.css'
import Form from './components/Form'
import { FieldService } from './lib/api/MockService'
import { localStorage } from './lib/hooks/useLocalStorage'
import { FormFields } from './lib/types/Form'

function App() {
  const [formFields, setFormFields] = useState<FormFields | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const storedFields = localStorage()?.getItem('form-fields')

    if (storedFields) {
      setFormFields(storedFields)
      return
    }

    setLoading(true)

    setTimeout(() => {
      Promise.resolve(FieldService.getFields())
        .then((fields) => setFormFields(fields))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false))
    }, 500)
  }, [])

  return (
    <div className='App'>
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : formFields ? (
        <Form formFieldsData={formFields!} />
      ) : (
        <div>No data found</div>
      )}
    </div>
  )
}

export default App
