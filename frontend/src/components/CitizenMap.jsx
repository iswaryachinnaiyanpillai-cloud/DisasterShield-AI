import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapCenter({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(
        [location.latitude, location.longitude],
        14,
        { duration: 1 }
      );
    }
  }, [location, map]);

  return null;
}

export default function CitizenMap({
  userLocation,
  destination,
}) {
  const fallback = {
    latitude: 8.0883,
    longitude: 77.5385,
  };

  const center = userLocation || fallback;

  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (!userLocation || !destination) {
      setRoute([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const url =
          `https://router.project-osrm.org/route/v1/driving/` +
          `${userLocation.longitude},${userLocation.latitude};` +
          `${destination.longitude},${destination.latitude}` +
          `?overview=full&geometries=geojson`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Route unavailable");
        }

        const data = await response.json();

        const coordinates =
          data?.routes?.[0]?.geometry?.coordinates || [];

        setRoute(
          coordinates.map(([lng, lat]) => [lat, lng])
        );
      } catch {
        setRoute([]);
      }
    };

    fetchRoute();
  }, [userLocation, destination]);

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={13}
      scrollWheelZoom
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapCenter location={userLocation} />

      <Marker
        position={[
          center.latitude,
          center.longitude,
        ]}
        icon={userIcon}
      >
        <Popup>
          {userLocation
            ? "Your current location"
            : "Map starting location"}
        </Popup>
      </Marker>

      {destination && (
        <Marker
          position={[
            destination.latitude,
            destination.longitude,
          ]}
          icon={userIcon}
        >
          <Popup>
            Recommended safe shelter
          </Popup>
        </Marker>
      )}

      {route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{
            weight: 6,
          }}
        />
      )}
    </MapContainer>
  );
}