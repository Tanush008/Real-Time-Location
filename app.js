const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
  socket.on("send-location", function(data) {
    io.emit("recieve-location", { id: socket.id, ...data });
  });

  socket.on("user-disconnect", function() {
    io.emit("user-disconnect", socket.id);
  });
});

app.get("/", (req, res) => {
  res.render("index");
});
server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
