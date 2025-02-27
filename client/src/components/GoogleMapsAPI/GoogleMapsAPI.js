useEffect(() => {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
  script.async = true;
  window.initMap = initMap;
  document.body.appendChild(script);
}, []);

const initMap = () => {
  const map = new window.google.maps.Map(document.getElementById('map'), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
  const marker = new window.google.maps.Marker({
    position: { lat: -34.397, lng: 150.644 },
    map: map,
  });
};
