//: clases importadas
const path = require("path");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const socketio = require("socket.io"); //- esta es la clase que nos permite ejecutar en tiempo real
const mongoose = require("mongoose");
//: objetos creados



const app = express();
const server = http.createServer(app); //- esto lo ejecutamos para poder crear  a continuacion  un servidor en tiempo real
const io = socketio(server); //- conectamos nuestro protocolo TCP  a nuestro server
require("./sokets")(io);//- traemos la  conexion
mongoose.connect("mongodb://localhost/myFirstChat")
  .then(db => console.log("db is connected"))
  .catch(err => console.log(err));
app.use(express.static(path.join(__dirname, "public"))); //*va  a enviar la carpeta public al navegador cafa vez que un usuario entre
//:conexion con el servidor
server.listen(3000, () => {
  console.log("listen on port: 3000");
});
//:middlware
app.use(morgan("dev"));
