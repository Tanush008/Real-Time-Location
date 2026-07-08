const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", {
        latitude,
        longitude,
        timestamp: Date.now(),
      });
    },
    (error) => {
      alert("Unable to fetch location");
      console.error(error);
    },
    {
      enableHighAccuracy: false,
      maximumAge: 0,
      timeout: 10000,
    }
  );
}

const map = L.map("map").setView([20.5937, 78.9629], 10);

L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
).addTo(map);

const markers = {};

socket.on("recieve-location", (data) => {
  const { id, latitude, longitude } = data;

  map.flyTo([latitude, longitude], 18);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.circleMarker([latitude, longitude], {
      radius: 8,
      color: "red",
    }).addTo(map);
  }
});

socket.on("user-disconnect", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
