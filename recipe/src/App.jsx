import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import food from './assets/foods.jpg';
import bin from './assets/bin.png';
import './App.css'

function App() {
  const [ingredient, setIngredient] = useState(''); // State to capture the entered ingredient
  const [ingredientsList, setIngredientsList] = useState([]); // State to store the list of ingredients

  const handleIngredientChange = (e) => {
    setIngredient(e.target.value); // Update the ingredient state when the input changes
  };

  const handleAddIngredient = () => {
    if (ingredient.trim() !== '') {
      setIngredientsList([...ingredientsList, ingredient]); // Append the ingredient to the list
      setIngredient(''); // Clear the input field
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (index) => {
    const updatedList = [...ingredientsList];
    updatedList.splice(index, 1); // Remove the ingredient at the specified index
    setIngredientsList(updatedList);
  };

  return (
    <>
      <h1 class="text-4xl font-bold mb-6">Grocery Run</h1>
      <div class="flex flex-col space-y-4">
        <h2 class="text-2xl font-bold">Enter your ingredients below</h2>
        <div class="mb-4">
          <input class="shadow appearance-none border rounded w-2/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4" id="ingredient" type="text" placeholder="Enter your ingredient!" value={ingredient} onChange={handleIngredientChange} onKeyUp={handleEnter}></input>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"  onClick={handleAddIngredient}>
            Enter
          </button>
          <div class="ingredients">
            <ul className='flex flex-col'>
              {ingredientsList.map((item, index) => (
                <li key={index} className="mr-4 mb-4">
                  <div class = "bg-blue-500 w-64 rounded-md" key={index}>
                    <span>{item}</span>
                    <img
                      src={bin} 
                      alt="Remove"
                      class= "h-5 w-5 ml-2 cursor-pointer"
                      onClick={() => handleRemoveIngredient(index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div class="flex justify-center items-center"> 
          <div className="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 justify-center items-center">
            <h1 class="text-3xl font-bold">Here's how it works:</h1>
            <ol class="list-decimal list-outside">
              <li>You enter the recipe that you want</li>
              <li>We find the best deals from local stores to fulfill your recipe</li>
              <li>You save time and money for that next meal!</li>
            </ol>
        </div>
        </div>
        
      </div>
      
      
      <p className="footer">
        Made with Vite
      </p>
    </>
  )
}

export default App
