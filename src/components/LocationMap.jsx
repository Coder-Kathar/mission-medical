import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    useMapEvents
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapController({ position }) {
    const map = useMap();

    if (position) {
        map.setView(position, 16);
    }

    return null;
}

function MapClickHandler({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            onLocationSelect({
                lat: e.latlng.lat,
                lng: e.latlng.lng
            });
        }
    });

    return null;
}

function LocationMap({ onLocationSelect }) {
    const [markerPosition, setMarkerPosition] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLocationSelect = async (location) => {
        setMarkerPosition([location.lat, location.lng]);
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`
            );

            if (!response.ok) {
                throw new Error("Address lookup failed.");
            }

            const data = await response.json();

            if (!data.display_name) {
                throw new Error("No readable address was found.");
            }

            onLocationSelect({
                ...location,
                address: data.display_name
            });
        } catch (err) {
            setError(
                "Could not retrieve the address. You can enter it manually."
            );

            onLocationSelect({
                ...location,
                address: ""
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCurrentLocation = () => {
        setError("");

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                handleLocationSelect({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (err) => {
                if (err.code === 1) {
                    setError("Please allow location access in your browser.");
                } else if (err.code === 2) {
                    setError("Your location is currently unavailable.");
                } else {
                    setError("Unable to retrieve your location. Please try again.");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="location-map">
            <p>Choose your delivery location</p>

            <button
                type="button"
                className="current-location-button"
                onClick={handleCurrentLocation}
                disabled={loading}
            >
                Use Current Location
            </button>

            {loading && <p>Finding your address...</p>}
            {error && <p className="location-error">{error}</p>}

            <MapContainer
                center={[11.1271, 78.6569]}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: "350px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onLocationSelect={handleLocationSelect} />
                <MapController position={markerPosition} />

                {markerPosition && (
                    <Marker position={markerPosition} />
                )}
            </MapContainer>

            <small>
                Select a location on the map or use your current location.
            </small>
        </div>
    );
}

export default LocationMap;