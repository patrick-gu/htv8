import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import food from './assets/foods.jpg';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 class="text-4xl font-bold mb-6">Grocery Run</h1>
      <div class="flex flex-col space-y-4">
        <h2 class="text-2xl font-bold">Enter your recipe's site below</h2>
        <div class="mb-4">
          <input class="shadow appearance-none border rounded w-4/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" id="recipe-link" type="text" placeholder="Recipe Link"></input>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Button
          </button>
        </div>
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 justify-center items-center">
          <h1 class="text-3xl font-bold">Here's how it works:</h1>
          <ol class="list-decimal">
            <li>You enter the recipe that you want</li>
            <li>We find the best deals from local stores to fulfill your recipe</li>
            <li>You save time and money for that next meal!</li>
          </ol>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      </div>
      
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
