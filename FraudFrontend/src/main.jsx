import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div className='bg-blue-600'>Hello</div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
