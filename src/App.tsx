import './App.css'
import 'tailwindcss/tailwind.css';
import { BrowserRouter } from 'react-router-dom'
import { Router } from './route/router'

function App() {

  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  )
}

export default App
