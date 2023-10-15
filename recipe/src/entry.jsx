


const SearchResultItem = ({item}) => {
    
      

    return (
        <div className="bg-coral-pink p-4 m-2 rounded-md w-96 h-96 cursor-pointer transition duration-500 hover:scale-105 border-solid border-2 border-dcoral-pink" id="resultsList">
            <h1 className="text-lg font-bold">{item.name}</h1>
            <h2>{item.store}</h2>
            <h2>${item.price}</h2>
            <img className="w-auto h-40 object-cover" src={item.img} alt="pic" />
        </div>  
      
    );
  }
  
  export default SearchResultItem;
  