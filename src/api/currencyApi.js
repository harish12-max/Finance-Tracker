import axios from 'axios'

export async function fetchExchangeRates(baseCurrency = 'INR') {
  const response = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/${encodeURIComponent(baseCurrency)}`,
  )
  return response?.data?.rates || {}
}
