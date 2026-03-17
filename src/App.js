import { useEffect, useState } from "react";
import MapView from "./components/mapview";
import ClimateChart from "./components/ClimateChart";

// ✅ Move outside (fixes warning)
const cityCoordinates = {
  Coimbatore: { lat: 11.0168, lon: 76.9558 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Delhi: { lat: 28.6139, lon: 77.2090 },
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Kasukabe: { lat: 35.9756, lon: 139.7528 },
  Colva: { lat: 15.2797, lon: 73.9220 }
};

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;

  const [city, setCity] = useState("Coimbatore");
  const [weather, setWeather] = useState(null);
  const [aqi, setAqi] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {

  // 🌤 Weather API
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(res => res.json())
    .then(data => setWeather(data));

  const { lat, lon } = cityCoordinates[city];

  // 🌫 AQI API
  fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data?.list?.length > 0) {
        setAqi(data.list[0].main.aqi);
      }
    });

  // 📊 Forecast API (CLEAN)
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then(data => {

      if (!data?.list) return;

      const dailyData = {};

      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();

        if (!dailyData[date]) {
          dailyData[date] = item;
        }
      });

      const fixedDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const chartData = Object.values(dailyData)
  .slice(0, 5)
  .map((item, index) => ({
    day: fixedDays[index],   // 🔥 Force labels
    temp: item.main.temp,
    rain: item.weather[0].main === "Rain" ? 1 : 0
  }));

      setForecast(chartData);
    });

}, [city]);

  // 🎨 AQI Label + Color
 const getAQIInfo = (value) => {
  switch(value){
    case 1:
      return {text:"Good", color:"green", advice:"Safe to go outside"};
    case 2:
      return {text:"Fair", color:"yellow", advice:"Normal, but be cautious"};
    case 3:
      return {text:"Moderate", color:"orange", advice:"Limit outdoor activities"};
    case 4:
      return {text:"Poor", color:"red", advice:"Avoid outdoor activities"};
    case 5:
      return {text:"Very Poor", color:"purple", advice:"Stay indoors, wear a mask"};
    default:
      return {text:"Loading", color:"gray", advice:"Fetching data..."};
  }
};

  const aqiInfo = getAQIInfo(aqi);

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>

      {/* Sidebar */}
      <div style={{
        width: "250px",
        background: "#f5f5f5",
        padding: "20px",
        borderRadius: "10px"
      }}>
        <h2>Climate Dashboard</h2>
        <h3>Select City</h3>

        {/* Buttons */}
        <button style={btn("#4CAF50")} onClick={() => setCity("Coimbatore")}>Coimbatore</button>
        <button style={btn("#2196F3")} onClick={() => setCity("Chennai")}>Chennai</button>
        <button style={btn("#FF9800")} onClick={() => setCity("Delhi")}>Delhi</button>
        <button style={btn("#E91E63")} onClick={() => setCity("Mumbai")}>Mumbai</button>
        <button 
  style={{background:"#9C27B0", color:"white", border:"none", padding:"8px", margin:"5px", borderRadius:"5px"}}
  onClick={() => setCity("Kasukabe")}
>
  Kasukabe 🇯🇵
</button>
<button 
  style={{background:"#00BCD4", color:"white", border:"none", padding:"8px", margin:"5px", borderRadius:"5px"}}
  onClick={() => setCity("Colva")}
>
  Colva 🌊
</button>

        {/* Weather Data */}
        {weather && weather.main ? (
          <div>
            <p>🌡 Temperature: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>💨 Wind Speed: {weather.wind.speed} m/s</p>
            <p>☁ Weather: {weather.weather[0].description}</p>

            <p>
              🌧 Rain Prediction:
              {forecast && forecast.some(day => day.rain) ? " Yes" : " No"}
            </p>

            <p>
  🌫 Air Quality:
  <span style={{
    background: aqiInfo.color,
    color:"white",
    padding:"5px 10px",
    borderRadius:"5px",
    marginLeft:"10px"
  }}>
    {aqi ? `${aqi} - ${aqiInfo.text}` : "Loading..."}
  </span>
</p>

<p style={{ marginTop: "10px", fontWeight: "bold" }}>
  🏥 Health Advice: {aqiInfo.advice}
</p>
          </div>
        ) : (
          <p>Loading weather...</p>
        )}

        {/* Chart */}
        <ClimateChart data={forecast} />

      </div>

      {/* Map */}
      <div style={{ flex: 1 }}>
        <h1>Digital Twin Climate Map</h1>
        <MapView city={city} aqi={aqi} />
      </div>

    </div>
  );
}

// 🎨 Button Style Helper
const btn = (color) => ({
  background: color,
  color: "white",
  border: "none",
  padding: "8px",
  margin: "5px",
  borderRadius: "5px",
  cursor: "pointer"
});

export default App;