const express = require("express");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server listening at port %d", port);
});

app.use(express.static(path.join(__dirname, "public")));

let numUsers = 0;

io.on("connection", (client) => {
  let addedUser = false;

  client.on("new message", (data) => {
    client.broadcast.emit("new message", {
      username: client.username,
      message: data,
    });
  });

  client.on("add user", (username) => {
    if (addedUser) return;

    client.username = username;
    ++numUsers;
    addedUser = true;
    client.emit("login", {
      numUsers: numUsers,
    });

    client.broadcast.emit("user joined", {
      username: client.username,
      numUsers: numUsers,
    });
  });

  client.on("disconnect", () => {
    if (addedUser) {
      --numUsers;

      client.broadcast.emit("user left", {
        username: client.username,
        numUsers: numUsers,
      });
    }
  });
});
