


const SearchResultItem = ({item}) => {
    
      

    return (
        <div id="resultsList">
            <h1>{item.name}</h1>
            <h2>{item.price}</h2>
            <img src={item.img} alt="pic" />
        </div>  
      
    );
  }
  
  export default SearchResultItem;
  