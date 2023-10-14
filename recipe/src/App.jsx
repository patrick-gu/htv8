import { useState } from "react";
import bin from "./assets/bin.png";

function StoreSuggestions({ selectedStores }) {
  // For now, let's assume it's a simple array of suggestions
  const suggestions = [
    "Remove FreshCo from your run for $3.54 more to save 15 minutes on your run",
    "Add FoodBasics to your run to save $15.20 for 10 minutes on your run",
    "Don't eat to save 100% of the costs on this run",
  ];

  return (
    <div
      className={`suggestions ${
        selectedStores.length > 0 ? "block" : "hidden"
      }`}
    >
      <h2 className="text-2xl font-bold">Store Suggestions:</h2>
      <div className="flex space-x-2">
        {suggestions.map((suggestion, index) => (
          <div className="bg-yellow-100 w-fit+1 h-fit+2 p-2" key={index}>
            {suggestion}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [ingredient, setIngredient] = useState(""); // State to capture the entered ingredient
  const [ingredientsList, setIngredientsList] = useState([]); // State to store the list of ingredients
  const [storesSelected, setStoresSelected] = useState([]);
  const stores = [
    "Walmart",
    "Metro",
    "Food Basics",
    "Your Independent Grocer",
    "No Frills",
    "Sobeys",
    "Fortino's",
    "Foodland",
    "Real Canadian Superstore",
    "Longos",
    "Loblaws",
    "T&T Supermarket",
    "Farm Boy",
    "Canadian Tire Gas+",
    "Wild Fork",
    "Costco",
    "FreshCo",
    "Wholesale Club and Club EntrepÃ´t",
    "Marche Adonis",
    "Healthy Planet",
    "M&M Food Market",
    "Independent City Market",
    "Valu-Mart",
    "Giant Tiger",
    "Coppa's Fresh Market",
    "London Drugs",
  ]; //possible stores

  const [screenId, setScreenId] = useState(0);

  const translate = [
    "",
    "translate-x-[-100vw]",
    "translate-x-[-200vw]",
    "translate-x-[-300vw]",
  ][screenId];

  return (
    <div className="w-full overflow-hidden h-full">
      <main
        className={`w-[400vw] ${translate} transition-transform h-full flex flex-row`}
      >
        <Ingredients
          ingredient={ingredient}
          setIngredient={setIngredient}
          ingredientsList={ingredientsList}
          setIngredientsList={setIngredientsList}
          setScreenId={setScreenId}
        />
        <Another
          stores={stores}
          storesSelected={storesSelected}
          setStoresSelected={setStoresSelected}
          setScreenId={setScreenId}
        />
        <SuggestRecipes setScreenId={setScreenId} />
        <GetYourStuff setScreenId={setScreenId} />
      </main>
    </div>
  );
}

function Ingredients({
  ingredient,
  setIngredient,
  ingredientsList,
  setIngredientsList,
  setScreenId,
}) {
  //change of state when user types into the ingredients bar
  const handleIngredientChange = (e) => {
    setIngredient(e.target.value); // Update the ingredient state when the input changes
  };

  //append ingredient to list
  const handleAddIngredient = () => {
    if (ingredient.trim() !== "") {
      setIngredientsList([...ingredientsList, ingredient]); // Append the ingredient to the list
      setIngredient(""); // Clear the input field
    }
  };

  //called when user wants to remove ingredients
  const handleRemoveIngredient = (index) => {
    const updatedList = [...ingredientsList];
    updatedList.splice(index, 1); // Remove the ingredient at the specified index
    setIngredientsList(updatedList);
  };

  //called when user presses enter after entering value to search bar
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  return (
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-end">
        <button
          onClick={() => setScreenId(1)}
          className="bg-blue-500 rounded-full py-2 px-4 text-white"
        >
          Next
        </button>
      </div>
      <div className="grid grid-cols-1 gap-8 space-y-8 md:grid-cols-2 flex-grow">
        <div className="flex flex-col gap-4 justify-center h-full">
          <h1 className="text-4xl font-bold text-center">Grocery Run</h1>
          <p className="text-center">
            Start by adding the ingredients you want to buy
          </p>
          <div className="flex justify-center items-center">
            <div className="block max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 justify-center items-center">
              <h1 className="text-3xl font-bold">Here{"'"}s how it works:</h1>
              <ol className="list-decimal list-outside">
                <li>You enter the recipe that you want</li>
                <li>
                  We find the best deals from local stores to fulfill your
                  recipe
                </li>
                <li>You save time and money for that next meal!</li>
              </ol>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-center">Ingredients</h2>
          <div className="mb-4">
            <input
              className="shadow appearance-none border rounded w-2/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
              id="ingredient"
              type="text"
              placeholder="Enter your ingredient!"
              value={ingredient}
              onChange={handleIngredientChange}
              onKeyUp={handleEnter}
            ></input>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={handleAddIngredient}
            >
              Enter
            </button>
            <div className="ingredients">
              <ul className="flex flex-col">
                {ingredientsList.map((item, index) => (
                  <li key={index} className="mr-4 mb-4">
                    <div
                      className="flex p-4 bg-blue-500 w-full rounded-md cursor-pointer"
                      key={index}
                    >
                      <span>{item}</span>
                      <span>1.95lb</span>
                      <span>FreshCo, Bulk, $2.31/lb</span>
                      <span>$4.50</span>
                      <img
                        src={bin}
                        alt="Remove"
                        className="h-5 w-5 ml-2 cursor-pointer"
                        onClick={() => handleRemoveIngredient(index)}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Another({ stores, storesSelected, setStoresSelected, setScreenId }) {
  const handleStoreSelect = (store) => {
    if (storesSelected.includes(store)) {
      // Store is already selected, remove it and change the background to white
      setStoresSelected(
        storesSelected.filter((selectedStore) => selectedStore !== store)
      );
    } else {
      // Store is not selected, add it and change the background to green
      setStoresSelected([...storesSelected, store]);
    }
  };
  return (
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-between">
        <button
          onClick={() => setScreenId(0)}
          className="bg-blue-500 rounded-full py-2 px-4 text-white"
        >
          Back
        </button>
        <button
          onClick={() => setScreenId(2)}
          className="bg-blue-500 rounded-full py-2 px-4 text-white"
        >
          Next
        </button>
      </div>
      <div className="space-y-8 flex-grow">
        <h1 className="text-4xl font-bold">
          Let{"'"}s figure out your grocery run!
        </h1>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-4 gap-4">
              {stores.map((store, index) => (
                <div
                  key={index}
                  onClick={() => handleStoreSelect(store)}
                  className={`cursor-pointer p-2 border rounded ${
                    storesSelected.includes(store) ? "bg-green-500" : "bg-white"
                  }`}
                >
                  {store}
                </div>
              ))}
            </div>
            <StoreSuggestions selectedStores={storesSelected} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SuggestRecipes({ setScreenId }) {
  return (
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-between">
        <button
          onClick={() => setScreenId(1)}
          className="bg-blue-500 rounded-full py-2 px-4 text-white"
        >
          Back
        </button>
        <button
          onClick={() => setScreenId(3)}
          className="bg-blue-500 rounded-full py-2 px-4 text-white"
        >
          Next
        </button>
      </div>
      <div className="space-y-8 flex-grow">
        <h1 className="text-4xl font-bold">What are you cooking?</h1>
      </div>
    </section>
  );
}

export function GetYourStuff({ setScreenId }) {
  const [nonce] = useState(() => Math.random().toString());
  const [paybiltData, setPaybiltData] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  return (
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8">
      <div className="flex justify-between">
        <button
          onClick={() => setScreenId(2)}
          className="bg-blue-500 rounded-full py-2 px-4 text-white"
        >
          Back
        </button>
      </div>
      <div className="space-y-8 flex-grow">
        <h1 className="text-4xl font-bold">Get your stuff</h1>
        <button
          className={`p-2 rounded-full ${
            !isOrdering ? "bg-blue-500" : "bg-blue-100"
          }`}
          onClick={() => setIsOrdering(false)}
        >
          I&apos;ll get it myself
        </button>
        <button
          className={`p-2 rounded-full ${
            isOrdering ? "bg-blue-500" : "bg-blue-100"
          }`}
          onClick={() => setIsOrdering(true)}
        >
          Order it (Paybilt integration)
        </button>
        {isOrdering && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target;
              const formData = new FormData(form);
              const dict = {};
              for (const [key, value] of formData) {
                dict[key] = value;
              }
              dict.items = [
                {
                  name: "tomato",
                  quantity: 1,
                  description: "just a tomato",
                  unit_price: 2,
                },
              ];
              dict.nonce = nonce;
              console.log(dict);
              const res = await fetch("http://127.0.0.1:8080/paybilt", {
                method: "POST",
                body: JSON.stringify(dict),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const body = await res.json();
              console.log(body);
              setPaybiltData(body.message);
            }}
          >
            <label>
              Email
              <input type="email" name="email" className="border" />
            </label>

            <label>
              Phone{" "}
              <input
                type="phone"
                name="phone"
                defaultValue="0000000000"
                className="border p-2 rounded"
              />
            </label>

            <label>
              First Name{" "}
              <input
                type="text"
                name="first_name"
                defaultValue="King"
                className="border"
              />
            </label>

            <label>
              Last Name
              <input
                type="text"
                name="last_name"
                defaultValue="Warrior"
                className="border"
              />
            </label>

            <label>
              Address
              <input
                type="text"
                name="address"
                defaultValue="200 University Ave W"
                className="border"
              />
            </label>

            <label>
              City
              <input
                type="text"
                name="city"
                defaultValue="Waterloo"
                className="border"
              />
            </label>
            <label>
              Province (State)
              <input
                type="text"
                name="state"
                defaultValue="Ontario"
                className="border"
              />
            </label>
            <label>
              Country{" "}
              <select name="country" className="border">
                <option defaultValue="CA">Canada</option>
              </select>
            </label>

            <label>
              Postal Code (Zip Code){" "}
              <input
                type="text"
                name="zip_code"
                defaultValue="N2L 3G1"
                className="border"
              />
            </label>

            <button
              type="submit"
              className="bg-blue-500 rounded-full py-2 px-4 text-white"
            >
              Pay with Paybilt
            </button>
          </form>
        )}
        {paybiltData !== null && (
          <>
            <h2 className="text-2xl font-bold">
              Thanks for shopping! Please complete your transaction with
              Paybilt.
            </h2>
            <div dangerouslySetInnerHTML={{ __html: paybiltData }}></div>
          </>
        )}
      </div>
    </section>
  );
}

export default App;
