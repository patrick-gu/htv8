


const SearchResultItem = ({item}) => {
    
      

    return (
        <div className="bg-coral-pink p-4 m-2 rounded-md w-96 h-81 cursor-pointer transition duration-500 hover:scale-105 border-solid border-2 border-dcoral-pink text-center" id="resultsList">
            <h1 className="text-lg font-bold">{item.name}</h1>
            <h1 className=" italic text-lg">{item.store}</h1>
            <div className="flex justify-center my-5">
            <img className="w-auto h-40 object-cover rounded-lg" src={item.img} alt="pic" />
            </div>
            <h1 className="text-lg font-bold">${parseFloat(item.price).toFixed(2)}</h1>
        </div>  
      
    );
  }
  
  export default SearchResultItem;
  