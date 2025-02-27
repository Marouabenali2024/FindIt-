import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const Map = ({ location, setLocation }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      zoom={10}
      center={location}
      onClick={(e) => setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() })}
    >
      <Marker position={location} />
    </GoogleMap>
  );
};
