mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10', // style URL
    center: gym.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

const mapBoxPopup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(
        `<h3>${gym.title}</h3><p>${gym.location}</p>`
    )

new mapboxgl.Marker()
    .setLngLat(gym.geometry.coordinates)
    .setPopup(mapBoxPopup)
    .addTo(map);