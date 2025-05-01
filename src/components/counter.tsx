import { useState } from 'react'




function Counter() {
  const [counter, setCounter] = useState(0)

  function sumCounter(){
    setCounter(counter + 1)
    }

    function resCounter(){
     setCounter(counter - 1)
    }

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Esto es el contador de felipao
      </h1>
      <div className="text-xl font-mono text-gray-700 dark:text-gray-200 mb-6">
        Contador: {counter}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={sumCounter}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Suma
        </button>
        <button
          onClick={resCounter}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Resta
        </button>
      </div>
    </div>
  )
}

export default Counter