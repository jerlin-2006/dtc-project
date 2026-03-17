import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet.heat";

function HeatmapLayer({ cityCoordinates, city }) {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    const coords = cityCoordinates[city];
    if (!coords) return;

    const { lat, lon } = coords;

    // ✅ Remove old layer before adding new
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=100b04a0aa230505e2b0d361086fb899`)
      .then(res => res.json())
      .then(data => {

        if (!data || !data.list || data.list.length === 0) return;

        const aqi = data.list[0].main.aqi;

        const heatData = [
          [lat, lon, aqi],
          [lat + 0.01, lon + 0.01, aqi - 1],
          [lat - 0.01, lon - 0.01, aqi - 2],
          [lat + 0.02, lon - 0.01, aqi],
          [lat - 0.02, lon + 0.01, aqi - 1],
          [lat + 0.015, lon + 0.02, aqi]
        ];

        const newLayer = L.heatLayer(heatData, {
          radius: 35,
          blur: 25,
          maxZoom: 12
        });

        newLayer.addTo(map);
        heatLayerRef.current = newLayer; // ✅ store layer
      });

  }, [city, map, cityCoordinates]);

  return null;
}

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position);
    }
  }, [position, map]);

  return null;
}

function MapView({ city }) {

  const cityCoordinates = {
    Coimbatore: { lat: 11.0168, lon: 76.9558 },
    Chennai: { lat: 13.0827, lon: 80.2707 },
    Delhi: { lat: 28.6139, lon: 77.2090 },
    Mumbai: { lat: 19.0760, lon: 72.8777 },
    Kasukabe: { lat: 35.9756, lon: 139.7528 },
    Colva: { lat: 15.2797, lon: 73.9220 }
  };

  const coords = cityCoordinates[city] || cityCoordinates["Coimbatore"];
  const position = [coords.lat, coords.lon];

  return (
    <MapContainer
      center={position}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap position={position} />

      <HeatmapLayer city={city} cityCoordinates={cityCoordinates} />

    </MapContainer>
  );
}

export default MapView;