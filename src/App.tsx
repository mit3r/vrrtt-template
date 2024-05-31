import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='flex justify-center flex-col w-full'>
      <div className='text-center'>Counter {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
}

export default App
