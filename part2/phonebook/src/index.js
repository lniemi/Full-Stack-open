import ReactDOM from 'react-dom/client'
import axios from 'axios'
import "./index.css"

import App from './App'

axios.get('http://localhost:3001/api/persons').then(response => {
  
  ReactDOM.createRoot(document.getElementById('root')).render(<App />)})