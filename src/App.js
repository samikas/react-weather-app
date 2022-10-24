import React, { useState, useEffect } from "react";

const api = {
  key: "6b326b0c1ccf6ac8d77d30669f97b036",
  base: "https://api.openweathermap.org/data/2.5/"
}

let today = new Date();
let date = `${(today.getMonth()+1)}.${today.getDate()}.${today.getFullYear()}`;

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [errorMessage, setErrorMessage] = useState("An error occurred");
  const localStorageData = JSON.parse(localStorage.getItem("locStorWeather"));
  // const localStorageData = [];
  
  // useEffect(() => {
  //   // Runs after the first render() lifecycle
  //   setFavorites(localStorageData);
  // }, []);


  const search = evt => {
    if(evt.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setQuery("");
        setWeather(result);
        console.log(result);
      })
      .catch((error) => {
        setErrorMessage(error);
        showToast();
        console.error('Error:', error);
      });      
    }
  }
  useEffect(() => { 
      setFavorites(localStorageData);
    if(weather.cod === "404"){
      setErrorMessage("City not found");
      showToast();
    }
  }, [weather, localStorageData]);

  const onFavoritePress = () => {
    let duplicate = false;
    if(favorites !== null){
      favorites.forEach((item) => {
      if(item.name === weather.name){
        console.log(item.name);
        console.log(weather.name);
        setErrorMessage("No duplicate cities");
        showToast ();
        return duplicate = true;
      }
    })
  }
    if(!duplicate){
      let newFavorites = [];
      if(favorites !== null) {
        if(favorites.length > 0 ) {
          favorites.map(item => newFavorites.push(item));
        }
      }
      newFavorites.push(weather);
      console.log(newFavorites);
      setFavorites(newFavorites);
      localStorage.setItem("locStorWeather", JSON.stringify(newFavorites));
    } else {
      console.log("duplicate found");
    }
  }

  const showToast = () => {
    const x = document.getElementById("snackbar");
    x.classList.toggle("show");
    //hide toast after timeout
    setTimeout(
      () => { x.classList.toggle("show"); }, 3000
      );
  }

  return (
    <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? "app warm" : "app") : "app"}>
      <main>
          <div className="search-box">
            <input 
              type="text" 
              className="search-bar" 
              placeholder="Search..." 
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyUp={search}
              />
          </div>
          {(typeof weather.main !== "undefined") ? (

            <div>
              <div className="location-box">
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="date">{date}</div>
              </div>
              <div className="weather-box">
                <div className="temp">
                  {Math.round(weather.main.temp)}°C
                </div>
                <div className="weather">
                  {weather.weather[0].main}
                </div>
              </div>
              <button onClick={onFavoritePress} className="favorite-btn">Add to favorites</button>
          </div>
            ) : (
              <div className="intial-txt">
                <div className="location-box">
                  <div className="location">Start with searching a city for its weather</div>
                </div>
              </div>

            )}
        <div className="favorites-wrapper">
              {(favorites !== null) ? (favorites.map((item, index) => {
                return (
                  <div key={index} onClick={() => setWeather(favorites[index])} className="favorite">
                  {item.name}, {item.sys.country}
                </div>
              )
              })) :
                
                ( <div></div>
                
  )
            
            }
        </div>
        <div id="snackbar">{errorMessage}</div>
      </main>
    </div>
  );
}

export default App;
