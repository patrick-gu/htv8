import { useEffect, useState } from "react";
import axios from 'axios';
import chevronDown from "./assets/chevron-down.png";
import chevronUp from "./assets/chevron-up.png";
import SearchResultItem from "./entry";
import checkMark from "./assets/check-mark.png";


function InitMapRoute() {
  return( <div style={ {height: 600 + "px"}} id="map"></div> )
}




function MapRoute(initSuggestions) {
  async function initMap() {
    let origin = { lat: 43.7867303, lng: -79.1920265 };
   

    // Initializing the map
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker")

    const map = new Map(document.getElementById("map"), {
    center: origin,
    zoom: 12,
    mapId: 'd5dc8cb3b04938bd',
    });




      const infoWindow = new InfoWindow();

      
      let glyphImg = document.createElement("img");


      glyphImg.style.cssText = "border-radius:50% ; width:30px ; height:30px; ";
      
  
      glyphImg.src = "https://cdn-icons-png.flaticon.com/512/25/25694.png"


      const home = new AdvancedMarkerElement({
        map,
        position: origin,
        title: "Home",
        content: new PinElement({ glyph: glyphImg, scale: 1.7}).element
    });
    home.addListener("click", ({ domEvent, latLng }) => {
        const { target } = domEvent;

        infoWindow.close();
        infoWindow.setContent(home.title);
        infoWindow.open(home.map, home);
      });


    const placesService = new google.maps.places.PlacesService(map);


    let input = ["Walmart Supercentre", "Metro", "Food Basics", "NoFrills", "Costco", "FreshCo", "Superstore"];

    
    async function getLocations(stores) {
        
        let storetype;
        function addPlaces(results, store) {
            // for (const location of results) {
            //     const marker = new AdvancedMarkerElement({
            //         map,
            //         position: location.geometry.location,
            //         title: location.name,
            //         content: new PinElement({ glyph: String(store[0]) }).element

            //     });

            //     marker.addListener("click", ({ domEvent, latLng }) => {
            //         const { target } = domEvent;
              
            //         infoWindow.close();
            //         infoWindow.setContent(marker.title);
            //         infoWindow.open(marker.map, marker);
            //       });    
            // }
        }


        for (let store of stores) {
            console.log(store);
            storetype = "supermarket"
            if (store === "NoFrills" || store === "FreshCo" || store === "Superstore") storetype = "grocery_or_supermarket";
            if (store === "Costco") storetype = "department_store";

            const {results, status } = await new Promise((res, rej) => {
                placesService.nearbySearch(
                    { location: origin, radius: 10000, name: store, type: storetype},
                    (results, status) => {

                        if (store === "Costco") {
                            results = results.filter((v) => (v.name !== "Costco Business Centre"))
                        }

                        if (store === "Superstore") {
                            results = results.filter((v) => (v.name.includes("Real Canadian")))
                        }

                        console.log(results)

                        
                        res({ results, status});
                    })
            })
            if (status !== "OK" || !results) return;
            addPlaces(results, store);
            locations.push(results);

            
        }
        
        getMinDist(origin, locations, [], 0)
    }


    
    let locations = [];

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressInfoWindows: true,
      suppressMarkers: true,
      map: map
    });
    directionsRenderer.setMap(map);





    // Distance Function
    const distanceService = new google.maps.DistanceMatrixService();



    async function getMinDist(start, places, waypoints, time) {
        let minRoute = [9999999999999999999, ""];
        let request;
        let result;


        for (let i = 0; i < places.length; i++) {
            
            for (const store of places[i]) {

                request = {
                    origins: [start],
                    destinations: [store.geometry.location],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false,
                };
                
                result = await new Promise((res,rej) => {
                    distanceService.getDistanceMatrix(request).then((response) => {
                        
                        let data = response.rows[0].elements[0];
                        let time = Number(data.duration.text.split(" ")[0])

                        if (time < minRoute[0]) {
                            minRoute = [time, store.geometry.location, store.name, i];
                        }
                        res(minRoute);
                    });
                })
            }
        }
        // console.log(result[3], places, places[result[3]])




        const glyphImg = document.createElement("img");


        glyphImg.style.cssText = "border-radius:50% ; width:50px ; height:50px; ";
        
        console.log("result", )
        if (result[2].includes("FreshCo")) {
          glyphImg.src = "https://play-lh.googleusercontent.com/c99A-kM7LqPxF0w0JlZEhpeM-r8Z2Bfwx81DLhlEeZfgdIb1Gttr98xpqcuiiMEaOQ"
        }
        else if (result[2].includes("Superstore")) {
          glyphImg.src = "https://mma.prnewswire.com/media/2079950/Loblaw_Companies_Limited_Real_Canadian_Superstore_expands_one_st.jpg?p=twitter"
        }
        else if (result[2].includes("Walmart")) {
          glyphImg.src = "https://latn.com/wp-content/uploads/2014/12/walmart-logo-vector.png"
        }
        else if (result[2].includes("Metro")) {
          glyphImg.src = "https://www.metro.ca/userfiles/image/facebook/share/metro-1.jpg"
        }
        else if (result[2].includes("Food Basics")) {
          glyphImg.src = "https://play-lh.googleusercontent.com/hFrI33FcTD-K7U80jxMA2PkiEBUPJkM1B6AL87g3mit8Cj_mFH0TSFGdqfmYeJiBce4"
        }
        else if (result[2].includes("NOFRILLS")) {
          glyphImg.src = "https://scontent-yyz1-1.xx.fbcdn.net/v/t39.30808-6/386163090_711078084400040_820691302660380194_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=H4iA0BnkAfoAX-KiA_-&_nc_ht=scontent-yyz1-1.xx&oh=00_AfAlMDuJ3e914CbIjPog9Q9iGMbOFIcOwuK8gZT6p7NhNA&oe=652F5BE8"
        }
        else if (result[2].includes("Costco")) {
          glyphImg.src = "https://www.procurant.com/hs-fs/hubfs/costco-wholesale-logo-logo.png?width=1435&name=costco-wholesale-logo-logo.png"
        }

        const marker = new AdvancedMarkerElement({
            map,
            position: result[1],
            title: result[2],

            content: new PinElement({ glyph: glyphImg, scale: 2.1}).element

        });

        marker.addListener("click", ({ domEvent, latLng }) => {
          const { target } = domEvent;
    
          infoWindow.close();
          infoWindow.setContent(marker.title);
          infoWindow.open(marker.map, marker);
        });    

        waypoints.push(result[1]);
        places.splice(result[3], 1);

        time = time += result[0]

        if (places.length === 0) {
            calculateAndDisplayRoute(directionsService, directionsRenderer, waypoints, time);
        } 
        else {
            // console.log(places)
            getMinDist(result[1], places, waypoints, time);
        }
    }




    function calculateAndDisplayRoute(directionsService, directionsRenderer, pts, time) {

      const waypts = [];
      for (const pt of pts) {
    

          waypts.push({location: pt, stopover: true})

        }
        



        directionsService
        .route({
            origin: new google.maps.LatLng(origin.lat, origin.lng) ,
            destination: new google.maps.LatLng(origin.lat, origin.lng),
            waypoints: waypts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.DRIVING,
        })
        .then((response) => {
            directionsRenderer.setDirections(response);
            console.log(time);
            // time = total trip time
        })

    }

    
    getLocations(input);

    
      
}
  initMap().then(initSuggestions);  
}


function UpdateMapRoute(storesSelected, postalCode) {
    // console.log("!!!!!!!update")
    const storesSorted = [...storesSelected];
    storesSorted.sort();
    const id = storesSorted.join(";") + ";" + postalCode;
    // console.log(id);
    


  async function updateMap() {
    var origin = { lat: 43.7867303, lng: -79.1920265 };

    // Initializing the map
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement, PinElement} = await google.maps.importLibrary("marker")


    const map = new Map(document.getElementById("map"), {
    center: origin,
    zoom: 12,
    mapId: 'd5dc8cb3b04938bd',
    });

    const infoWindow = new InfoWindow();
    


    const geocoder = new google.maps.Geocoder();
    console.log("jllkjlk", postalCode);

    if (postalCode != "") {
      origin = await new Promise((res, rej) => {
            geocoder.geocode({ 'address': 'zipcode ' + postalCode }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                res({lat: latitude, lng: longitude})

            } else {
                alert("Request failed.")
            }
          }); 
        });
      }

    console.log(origin);


      
    let glyphImg = document.createElement("img");


    glyphImg.style.cssText = "border-radius:50% ; width:30px ; height:30px; ";
    

    glyphImg.src = "https://cdn-icons-png.flaticon.com/512/25/25694.png"


    const home = new AdvancedMarkerElement({
      map,
      position: origin,
      title: "Home",
      content: new PinElement({ glyph: glyphImg, scale: 1.7}).element
  });
    home.addListener("click", ({ domEvent, latLng }) => {
        const { target } = domEvent;
  
        infoWindow.close();
        infoWindow.setContent(home.title);
        infoWindow.open(home.map, home);
      });


    

    const placesService = new google.maps.places.PlacesService(map);


    

    const convertedStoresSelected = [];

    for (let store of storesSelected) {
      
      if (store === "No Frills") {
        convertedStoresSelected.push("NoFrills");
      }
      else if (store === "Walmart") {
        convertedStoresSelected.push("Walmart Supercentre");
      }
      else if (store === "Real Canadian Superstore") {
        convertedStoresSelected.push("Superstore");
      }
      else {
        convertedStoresSelected.push(store);
      }

    }


    let input = convertedStoresSelected;

    async function getLocations(stores) {
        
        let storetype;

        for (let store of stores) {
            storetype = "supermarket"
            if (store === "NoFrills" || store === "FreshCo" || store === "Superstore") storetype = "grocery_or_supermarket";
            if (store === "Costco") storetype = "department_store";

            const {results, status } = await new Promise((res, rej) => {
                placesService.nearbySearch(
                    { location: origin, radius: 10000, name: store, type: storetype},
                    (results, status) => {

                        if (store === "Costco") {
                            results = results.filter((v) => (v.name !== "Costco Business Centre"))
                        }

                        if (store === "Superstore") {
                            results = results.filter((v) => (v.name.includes("Real Canadian")))
                        }



                        
                        res({ results, status});
                    })
            })
            if (status !== "OK" || !results) return;
            locations.push(results);            
        }
        
        getMinDist(origin, locations, [], 0)
    }


    
    let locations = [];

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      suppressInfoWindows: true,
      suppressMarkers: true,
      map: map
    });
    directionsRenderer.setMap(map);





    // Distance Function
    const distanceService = new google.maps.DistanceMatrixService();



    async function getMinDist(start, places, waypoints, time) {
        let minRoute = [9999999999999999999, ""];
        let request;
        let result;


        for (let i = 0; i < places.length; i++) {
            
            for (const store of places[i]) {

                request = {
                    origins: [start],
                    destinations: [store.geometry.location],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false,
                };
                
                result = await new Promise((res,rej) => {
                    distanceService.getDistanceMatrix(request).then((response) => {
                        
                        let data = response.rows[0].elements[0];
                        let time = Number(data.duration.text.split(" ")[0])

                        if (time < minRoute[0]) {
                            minRoute = [time, store.geometry.location, store.name, i];
                        }
                        res(minRoute);
                    });
                })
            }
        }



        waypoints.push(result[1]);
        places.splice(result[3], 1);

        time = time += result[0];



        const glyphImg = document.createElement("img");


        glyphImg.style.cssText = "border-radius:50% ; width:50px ; height:50px; ";
        
        console.log("result", )
        if (result[2].includes("FreshCo")) {
          glyphImg.src = "https://play-lh.googleusercontent.com/c99A-kM7LqPxF0w0JlZEhpeM-r8Z2Bfwx81DLhlEeZfgdIb1Gttr98xpqcuiiMEaOQ"
        }
        else if (result[2].includes("Superstore")) {
          glyphImg.src = "https://mma.prnewswire.com/media/2079950/Loblaw_Companies_Limited_Real_Canadian_Superstore_expands_one_st.jpg?p=twitter"
        }
        else if (result[2].includes("Walmart")) {
          glyphImg.src = "https://latn.com/wp-content/uploads/2014/12/walmart-logo-vector.png"
        }
        else if (result[2].includes("Metro")) {
          glyphImg.src = "https://www.metro.ca/userfiles/image/facebook/share/metro-1.jpg"
        }
        else if (result[2].includes("Food Basics")) {
          glyphImg.src = "https://play-lh.googleusercontent.com/hFrI33FcTD-K7U80jxMA2PkiEBUPJkM1B6AL87g3mit8Cj_mFH0TSFGdqfmYeJiBce4"
        }
        else if (result[2].includes("NOFRILLS")) {
          glyphImg.src = "https://scontent-yyz1-1.xx.fbcdn.net/v/t39.30808-6/386163090_711078084400040_820691302660380194_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=H4iA0BnkAfoAX-KiA_-&_nc_ht=scontent-yyz1-1.xx&oh=00_AfAlMDuJ3e914CbIjPog9Q9iGMbOFIcOwuK8gZT6p7NhNA&oe=652F5BE8"
        }
        else if (result[2].includes("Costco")) {
          glyphImg.src = "https://www.procurant.com/hs-fs/hubfs/costco-wholesale-logo-logo.png?width=1435&name=costco-wholesale-logo-logo.png"
        }

        const marker = new AdvancedMarkerElement({
            map,
            position: result[1],
            title: result[2],

            content: new PinElement({ glyph: glyphImg, scale: 2.1}).element

        });

        marker.addListener("click", ({ domEvent, latLng }) => {
            const { target } = domEvent;
      
            infoWindow.close();
            infoWindow.setContent(marker.title);
            infoWindow.open(marker.map, marker);
          });    



        if (places.length === 0) {
            calculateAndDisplayRoute(directionsService, directionsRenderer, waypoints, time);
        } 
        else {
            // console.log(places)
            getMinDist(result[1], places, waypoints, time);
        }

    }




    function calculateAndDisplayRoute(directionsService, directionsRenderer, pts, time) {

      let waypts = [];
      for (const pt of pts) {
        waypts.push({location: pt, stopover: true})
      }
        
      console.log(origin, origin.lat, origin.lng);

      directionsService
      .route({
          origin: new google.maps.LatLng(origin.lat, origin.lng) ,
          destination: new google.maps.LatLng(origin.lat, origin.lng),
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
          directionsRenderer.setDirections(response);
          console.log(response);
          console.log(time);
          // time = total trip time
      })

    }

    
    getLocations(input);

      
        
  }
  console.log(storesSelected)
  updateMap();
}



async function getMinDistNoDisplay(start, places, waypoints, time) {
    // Distance Function
    const distanceService = new google.maps.DistanceMatrixService();

    let minRoute = [9999999999999999999, ""];
    let request;
    let result;


    for (let i = 0; i < places.length; i++) {
        
        for (const store of places[i]) {

            request = {
                origins: [start],
                destinations: [store.geometry.location],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false,
            };
            
            result = await new Promise((res,rej) => {
                distanceService.getDistanceMatrix(request).then((response) => {
                    
                    let data = response.rows[0].elements[0];
                    let time = Number(data.duration.text.split(" ")[0])

                    if (time < minRoute[0]) {
                        minRoute = [time, store.geometry.location, store.name, i];
                    }
                    res(minRoute);
                });
            })
        }
    }

    waypoints.push(result[1]);
    places.splice(result[3], 1);

    time += result[0];


    if (places.length === 0) {
        return time
    } 
    else {
        // console.log(places)
        return getMinDistNoDisplay(result[1], places, waypoints, time);
    }

}



function StoreSuggestions({ selectedStores, setSelectedStores, suggestions }) {
  // For now, let's assume it's a simple array of suggestions
//   const suggestions = [
//     "Remove FreshCo from your run for $3.54 more to save 15 minutes on your run",
//     "Add FoodBasics to your run to save $15.20 for 10 minutes on your run",
//     "Don't eat to save 100% of the costs on this run",
//     "Eat 50% to to save 50% of the costs on this run",
//   ];

  return (
    <div>
    <h2 className="text-2xl font-bold">Store Suggestions:</h2>
    <div
      className={`suggestions ${
        selectedStores.length > 0 ? "block" : "hidden "
      }`}
      style={{
      overflowX: "scroll",
      overflowY: "hidden", // Hide vertical overflow
      width: "100%",
      maxHeight: "200px", // Set a fixed height as an example
      }} 
    >
      <div className="flex space-x-2 overflow-y-hidden overflow-x-scroll w-screen h-auto">
        {suggestions.map((suggestion, index) => (
          <button className="bg-yellow-100 p-2 rounded-lg" key={index} style={{height:"5vw",width:"100vw"}} onClick={() => {
            setSelectedStores(selectedStores.toSpliced(selectedStores.indexOf(suggestion.store), 1));
          }}>
            <p>{suggestion.text}</p>
          </button>
        ))}
      </div>
    </div>
    </div>
  );
}

function App() {
  const [ingredient, setIngredient] = useState(""); // State to capture the entered ingredient
  const [ingredientsList, setIngredientsList] = useState([]); // State to store the list of ingredients
  const [quantities, setQuantity] = useState([]);
  const [storesSelected, setStoresSelected] = useState([
    "No Frills",
    "Walmart",
    "FreshCo",
    "Real Canadian Superstore",
    "Metro",
    "Food Basics",
    "Costco",
  ]);
  const [currentCost, setCurrentCost] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [recipe, setRecipe] = useState("");
  const [currentList, setCurrentList] = useState([]);
  const stores = [
    "Walmart",
    "Metro",
    "Food Basics",
    "No Frills",
    "Real Canadian Superstore",
    "Costco",
    "FreshCo",
  ]; //possible stores

  const [screenId, setScreenId] = useState(0);

  const translate = [
    "",
    "translate-x-[-100vw]",
    "translate-x-[-200vw]",
    "translate-x-[-300vw]",
  ][screenId];

  const [suggestions, setSuggestions] = useState([]);

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
          storesSelected={storesSelected}
          quantities={quantities}
          setQuantity={setQuantity}
          setRecipe={setRecipe}
          currentList={currentList}
          setCurrentList={setCurrentList}
          setSuggestions={setSuggestions}
        />
        <Another
          stores={stores}
          storesSelected={storesSelected}
          setStoresSelected={setStoresSelected}
          setScreenId={setScreenId}
          ingredientsList={ingredientsList}
          quantities={quantities}
          currentList={currentList}
          setCurrentList={setCurrentList}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
        <GetYourStuff setScreenId={setScreenId} />
        <SuggestRecipes setScreenId={setScreenId} recipe={recipe} />
        
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
  storesSelected,
  quantities,
  setQuantity,
  setRecipe,
  currentList,
  setCurrentList,
  setSuggestions,
}) {
  //change of state when user types into the ingredients bar
  const handleIngredientChange = (e) => {
    setIngredient(e.target.value); // Update the ingredient state when the input changes
  };  

  const firstPageNext = async () => {
    // console.log("fetching...")
    axios
      .post("http://127.0.0.1:8080/filter", {
        storesList: storesSelected,
        shoppingList: ingredientsList,
        quantities: quantities,
      })
      .then(function (response) {
        setCurrentList(response.data[0]);
        console.log(response.data[0]);
        MapRoute(() => findSuggestions({ postalCode: "", storesSelected, ingredientsList, quantities }).then((s) => setSuggestions(s)));
      })
      .catch(function (error) {
        console.log(error);
      });
    // console.log("bump screen")
    setScreenId(1);
    fetch("http://127.0.0.1:8080/recipe/suggest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients: ingredientsList }),
    }).then(async (response) => {
      const { content } = await response.json();
      console.log(content);
      setRecipe(content);
    });
  };

  //append ingredient to list
  const handleAddIngredient = () => {
    const defaultQuantity = 1; //add 1 of each quantity by default
    if (ingredient.trim() !== "") {
      setIngredientsList([...ingredientsList, ingredient]); // Append the ingredient to the list
      setQuantity([...quantities, defaultQuantity]); //add the quantity 
      setIngredient(""); // Clear the input field
    }
  };

  //called when user wants to increase quantity
  const handleQuantityUp = (index) => {
    const updatedList = [...quantities];
    updatedList[index]++; // Decrease one 
    setQuantity(updatedList);
  }

  //called when user wants to decrease quantity
  const handleQuantityDown = (index) => {
    const updatedList = [...quantities];
    updatedList[index]--; // Decrease one 
    if(updatedList[index] == 0){
      handleRemoveIngredient(index); 
      updatedList.splice(index, 1); //have to remove the quantity from the parallel array too 
    }
    setQuantity(updatedList);
  }
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
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8 bg-khaki">
      <div className="flex justify-end">
        <button
          onClick={firstPageNext}
          className="bg-raisin-black rounded-full py-2 px-4 text-white font-bold text-raisin-black font-fake-receipt"
        >
          Next
          </button>
      </div>
      <div className="grid grid-cols-2 gap-8 space-y-8 md:grid-cols-2 flex-grow h-5/6 mt-14">
        <div className="flex flex-col gap-8 justify-center h-[20rem] ">
          <div className="bg-whitesmoke rounded-lg">
          <h1 id="header" className="via-#21a179 animate-text bg-gradient-to-r from-cambridge-blue via-jungle-green to-black bg-clip-text text-5xl font-black text-transparent text-7xl text-raisin-black font-bold text-center font-sans">
            Grocery Run
          </h1>
          </div>
          <p className="text-center text-2xl">
            Start by adding the ingredients you want to buy
          </p>
          <div className="flex justify-center items-center">
            <div className=" font-custom block w-fit p-6 bg-whitesmoke rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 justify-center items-center hover:animate-bounce">
              <h1 className="text-3xl font-bold text-jungle-green">Here{"'"}s how it works:</h1>
              <ol className="list-decimal list-inside">
                <li>You enter your grocery list</li>
                <li className="my-2">
                  We find the best deals from local stores and give you travel paths, the projected time you'll spend shopping, and the cost.
                </li>
                <li className="my-2">
                  If you don't want to drive, checkout with Paybilt Instant Interact E-transfer.
                </li>
                <li className="my-2">
                  As a bonus, find recipes you can make with your ingredients.
                </li >
                <li className="my-2">You save time and money for that next meal!</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center">Grocery Items</h2>
          <div className="mb-4">
            <div className="flex items-center">
              <input
                className="shadow appearance-none border rounded w-fit py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
                id="ingredient"
                type="text"
                placeholder="Enter your ingredient!"
                value={ingredient}
                onChange={handleIngredientChange}
                onKeyUp={handleEnter}
              ></input>
              <button
                className="bg-jungle-green text-white font-bold py-2 px-4 rounded-full hover:bg-dgreen"
                onClick={handleAddIngredient}
              >
                Enter
              </button>
            </div>
            <div className="ingredients mt-4 h-[20rem] overflow-y-scroll">
              <ul className="flex flex-col">
                {ingredientsList.map((item, index) => (
                  <li key={index} className="mr-4 mb-4">
                    <div
                      className="flex p-4 bg-jungle-green w-full rounded-md cursor-pointer"
                      key={index}
                    >
                      <div className="flex-grow space-x-3">
                        <span>{item}</span>
                        <span className="font-bold">Quantity: {quantities[index]}</span>
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                      <div className="caret" onClick={()=>{handleQuantityUp(index)}}>
                        <svg class="w-6 h-6 text-black dark:text-white hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
                        </svg>
                      </div>
                      <div className="caret" onClick={()=>{handleQuantityDown(index)}}>
                        <svg class="w-6 h-6 text-black dark:text-white hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8" >
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
                        </svg>
                      </div>
                      </div>
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

async function findSuggestions({ postalCode, storesSelected, ingredientsList, quantities }) {
    const geocoder = new google.maps.Geocoder();
    console.log(`req ${postalCode}`)
    const origin = postalCode !== "" ? await new Promise((res, rej) => {
        geocoder.geocode({ 'address': 'zipcode ' + postalCode }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                res({lat: latitude, lng: longitude})

            } else {
                alert("Request failed.")
            }
        }); 
    }) : { lat: 43.7867303, lng: -79.1920265 };
    if (storesSelected.length <= 1) {
        return [];
    }
    const { data } = await axios
      .post("http://127.0.0.1:8080/filter", {
        storesList: storesSelected,
        shoppingList: ingredientsList,
        quantities: quantities,
      });

    const { Map } = await google.maps.importLibrary("maps");
    const map = new Map(document.getElementById("map"), {
        center: origin,
        zoom: 12,
        mapId: 'd5dc8cb3b04938bd',
    });

    const placesService = new google.maps.places.PlacesService(map);

        const symb = Symbol("initialStoreName")

      let locations = [];
      let collapseStores = [];
      for (let store of storesSelected) {
            let storetype = "supermarket"
            if (store === "NoFrills" || store === "FreshCo" || store === "Superstore") storetype = "grocery_or_supermarket";
            if (store === "Costco") storetype = "department_store";

            const {results, status } = await new Promise((res, rej) => {
                placesService.nearbySearch(
                    { location: origin, radius: 10000, name: store, type: storetype},
                    (results, status) => {

                        if (store === "Costco") {
                            results = results.filter((v) => (v.name !== "Costco Business Centre"))
                        }

                        if (store === "Superstore") {
                            results = results.filter((v) => (v.name.includes("Real Canadian")))
                        }
                        
                        res({ results, status});
                    })
            })
            if (status !== "OK" || !results) {
                // locations.push([]);
                continue;
            }
            locations.push(results);     
            collapseStores.push(store);       
        }
        console.log("loc", locations);

    console.log(`data`, data);
    const initPrice = parseFloat(data[1]["cost"]);
    const initDist = await getMinDistNoDisplay(origin, [...locations], [], 0);
    console.log(`!!!!!!!!!!!! ${initPrice} ${initDist} ${locations.length}`)
    let ret = [];
    for (let i = 0; i < locations.length; i++) {
        const stores = [...locations.slice(0, i), ...locations.slice(i + 1)];
        const dist = await getMinDistNoDisplay(origin, stores, [], 0);
        const storesList = [...collapseStores.slice(0, i), ...collapseStores.slice(i + 1)];
        console.log("stores list", storesList)
        const { data } = await axios
            .post("http://127.0.0.1:8080/filter", {
                storesList,
                shoppingList: ingredientsList,
                quantities: quantities,
            });
        console.log("dat", data);
        const price = parseFloat(data[1]["cost"]);
        const priceDiff = price - initPrice;
        const distDiff = dist - initDist;
        console.log(`price ${price} ${dist}`)
        ret.push({ store: collapseStores[i], priceDiff, distDiff });
    }
    let ans = [];
    for (const { store, priceDiff, distDiff } of ret) {
        if (priceDiff > 0 && distDiff > 0) {
            continue;
        }
        const s = `Save ${-distDiff} minutes for $${priceDiff.toFixed(2)} more by skipping ${store}`;
        ans.push({ text: s, store });
    }
    console.log("ans");
    console.log(ans);
    return ans;
}

function Another({ 
  stores, 
  storesSelected, 
  setStoresSelected, 
  setScreenId, 
  ingredientsList, 
  quantities, 
  currentList, 
  setCurrentList,
  suggestions,
  setSuggestions,
}) {

  const [postalCode, setPostalCode] = useState(""); // State to store the postal code

  // Function to handle changes in the postal code input field
  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value);
  };

  // Function to add the entered postal code to the state
  const handleAddPostalCode = () => {
    if (postalCode.trim() !== "") {
      setPostalCode(""); // Clear the input field after use
    }
    
    setPostalCode(postalCode);

    UpdateMapRoute(storesSelected, postalCode);
    // console.log(e.target.value);
  };

  useEffect(() => {
    setSuggestions([]);
    findSuggestions({ postalCode, storesSelected, ingredientsList, quantities }).then((s) => setSuggestions(s));
  }, [postalCode, storesSelected, ingredientsList, quantities]);

  const handleStoreSelect = async(store) => {
    let newStoresSelected;
    if (storesSelected.includes(store)) {
      // Store is already selected, remove it and change the background to white
      newStoresSelected=storesSelected.filter((selectedStore) => selectedStore !== store);
    }
    else {
      // Store is not selected, add it and change the background to green
      newStoresSelected = [...storesSelected, store];
    }
    setStoresSelected(newStoresSelected);
    
      await axios.post('http://127.0.0.1:8080/filter', {
        storesList: newStoresSelected,
        shoppingList: ingredientsList,
        quantities: quantities,
        })
        .then(function (response) {
          setCurrentList(response.data[0]);
          console.log(response.data[0])
          UpdateMapRoute(newStoresSelected, postalCode);
        })
        .catch(function (error) {
          console.log(error);
        });
    //call filter endpoint whenever StoresSelected changes
  }
  return (
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8 bg-khaki">
      <div className="flex justify-between">
        <button
          onClick={() => setScreenId(0)}
          className="bg-raisin-black rounded-full py-2 px-4 text-white font-bold"
        >
          Back
        </button>
        <button
          onClick={() => setScreenId(2)}
          className="bg-emerald-500 rounded-full py-2 px-4 text-white"
        >
          Get it delivered instead! (Paybilt)
        </button>
        <button
          onClick={() => setScreenId(3)}
          className="bg-raisin-black rounded-full py-2 px-4 text-white font-bold"
        >
          Get recipes
        </button>
      </div>
      <div className="space-y-8 flex-grow">
        <h1 className="text-4xl font-bold text-raisin-black">
          Let{"'"}s figure out your grocery run!
        </h1>
        {/* Postal Code input field */}
        <div className="flex items-center">
          <input
            className="shadow appearance-none border rounded w-fit py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-4"
            id="postalCode"
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            onChange= {(e)=>setPostalCode(e.target.value)}
          ></input>
          <button
            className="bg-jungle-green text-white font-bold py-2 px-4 rounded-full hover:bg-dgreen"
            onClick={handleAddPostalCode}
          >
            Add Postal Code
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-3">
            <div className="grid grid-cols-4 gap-4">
              {stores.map((store, index) => (
                <div
                  key={index}
                  onClick={() => handleStoreSelect(store)}
                  className={`cursor-pointer p-2 rounded ${
                    storesSelected.includes(store) ? "bg-jungle-green" : "bg-cambridge-blue line-through"
                  }`}
                >
                  {store}
                </div>
              ))}
            </div>
            <StoreSuggestions selectedStores={storesSelected} setSelectedStores={setStoresSelected} suggestions={suggestions} />
            <InitMapRoute />
            <div>
              <div className="grid grid-cols-3" id="resultsList">
              {
                  currentList.map((result, id)=>{
                      return <SearchResultItem item={result} key={id}/>
                  })
              }
              </div> 
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SuggestRecipes({ setScreenId, recipe }) {
  return (
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8 bg-khaki">
      <div className="flex justify-between">
        <button
          onClick={() => setScreenId(1)}
          className="bg-raisin-black rounded-full py-2 px-4 text-white"
        >
          Back
        </button>
        {/* <button
          onClick={() => setScreenId(2)}
          className="bg-blue-500 rounded-full py-2 px-4 text-white"
        >
          Next
        </button> */}
      </div>
      <div className="space-y-8 flex-grow">
        <h1 className="text-4xl font-bold">Need help with meal prep?</h1>
        <h2 className="text-xl">Here&apos;s a recipe suggestion:</h2>
        <p className="whitespace-pre-line">
          {recipe.length !== 0 ? recipe : "Loading a recipe..."}
        </p>
      </div>
    </section>
  );
}

export function GetYourStuff({ setScreenId }) {
  const [nonce] = useState(() => Math.random().toString());
  const [paybiltData, setPaybiltData] = useState(null);
  const [approved, setApproved] = useState(false);
  return (
    <section className="w-screen min-h-screen p-8 flex flex-col gap-8 bg-khaki">
      <div className="flex justify-between">
        <button
          onClick={() => setScreenId(1)}
          className="bg-raisin-black rounded-full py-2 px-4 text-white"
        >
          Back
        </button>
      </div>
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
          const { txid } = body;
          setPaybiltData(body.message);
          // poll for updates from Paybilt
          const timeout = setTimeout(async () => {
            const res = await fetch(
              `http://127.0.0.1:8080/paybilt/status/${txid}`
            );
            const body = await res.json();
            console.log(body);
            if (body.status === "approved") {
              setApproved(true);
              clearTimeout(timeout);
            }
          }, 5000);
        }}
      >
      <div className="relative w-1/2 max-h-screen flex flex-col space-y-4 p-4 left-1/4 rounded-lg items-start bg-white">
        <h1 className="text-4xl font-bold">Complete Your Payment</h1>
        {approved ?(<img src={checkMark} />):(
        <div>  
        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
          Email
          <input type="email" name="email" className="border rounded-lg p-2 ml-2" />
        </label>

       <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="phone">
          Phone{" "}
          <input
            type="phone"
            name="phone"
            defaultValue="0000000000"
            className="border rounded-lg p-2 ml-2"
          />
        </label>

        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="first name">
          First Name{" "}
          <input
            type="text"
            name="first_name"
            defaultValue="King"
            className="border rounded-lg p-2 ml-2"
          />
        </label>

        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
          Last Name
          <input
            type="text"
            name="last_name"
            defaultValue="Warrior"
            className="border rounded-lg p-2 ml-2"
          />
        </label>

        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
          Address
          <input
            type="text"
            name="address"
            defaultValue="200 University Ave W"
            className="border rounded-lg p-2 ml-2"
          />
        </label>

        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
          City
          <input
            type="text"
            name="city"
            defaultValue="Waterloo"
            className="border rounded-lg p-2 ml-2"
          />
        </label>
        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
          Province (State)
          <input
            type="text"
            name="state"
            defaultValue="Ontario"
            className="border rounded-lg p-2 ml-2"
          />
        </label>
        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
          Country{" "}
          <select name="country" className="border">
            <option defaultValue="CA">Canada</option>
          </select>
        </label>

        <label class="block text-raisin-black font-bold md:text-right mb-1 md:mb-0 pr-4" for="email">
          Postal Code (Zip Code){" "}
          <input
            type="text"
            name="zip_code"
            defaultValue="N2L 3G1"
            className="border rounded-lg p-2 ml-2"
          />
        </label>

        <button
          type="submit"
          className="relative group bg-hover-dgreen rounded-full py-2 px-4 text-white overflow-hidden"
        >
          <div class="absolute inset-0 w-0 bg-cambridge-blue transition-all duration-[250ms] ease-out group-hover:w-full"></div>
          <span class="relative text-white group-hover:text-black">Pay with Paybilt</span>
        </button>
        </div>
        )}
        </div>
      </form>
      {paybiltData !== null &&
        (approved ? (
          <>
            <h2 className="text-2xl font-bold">
              Payment complete! Thanks for shopping.
            </h2>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">
              Please complete your transaction with Paybilt.
            </h2>
            <div dangerouslySetInnerHTML={{ __html: paybiltData }}></div>
          </>
        ))}
    </section>
  );
}

export default App;
