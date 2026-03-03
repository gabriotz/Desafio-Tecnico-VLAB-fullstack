import axios from 'axios'

const api = axios.create({   // parêntese + chave, não só chave
  baseURL: 'http://localhost:8000',  // porta do back, não do front!
})

export default api