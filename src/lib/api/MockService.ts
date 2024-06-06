export const FieldService = {
  getFields: function () {
    return {
      label: 'Sales region',
      required: false,
      choices: [
        'Asia',
        'Australia',
        'Western Europe',
        'North America',
        'Eastern Europe',
        'Latin America',
        'Middle East and Africa',
      ],
      displayAlpha: true,
      default: 'North America',
    }
  },
  saveFields: (fieldJson: string) =>
    fetch(import.meta.env.VITE_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fieldJson),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log({ payload: fieldJson, response: data })
          })
        } else {
          console.error('Error:', response.statusText)
          return { error: 'Something went wrong' }
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        return { error: 'Something went wrong' }
      }),
}
