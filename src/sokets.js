const Chat = require("./models/chat");

//!conexion de socket del servidor
module.exports = function (io) {
    let users = []
    io.on("connection", async socket => {
        let messages = await Chat.find({});
        socket.emit("load old msgs", messages);
        socket.on("new user", (data, cb) => {

            if (data in users) {
                cb(false);

            } else {
                cb(true)
                //console.log(data);
                socket.nickname = data;//* gurada el nombre del usuario en una variable llamada nikname
                users[socket.nickname] = socket
                updateUsers();
                console.log("new user conected");

            }
        });

        socket.on("send message", async (data, cb) => {  //*una vez que el servidor escuche el evento send message eviado por el cliente 
            var msg = data.trim();
            if (msg.substr(0, 3) === "/w ") {
                msg = msg.substr(3);//*va a tomar como mensaje a partir del indice 3 tomando en cuenta que empiza en 0
                const index = msg.indexOf(" ");//*en el mensaje pasamos el espacion en blanco  al la variable incex
                if (index !== -1) {//*si no hay espacion en blanco significa que no hay mensaje
                    var name = msg.substring(0, index);//*desde el inicion del mensaje hasta antes del espacio, ese es nuestro  usuario lo estraemo y lo pasamos a name
                    var msg = msg.substring(index + 1);//* estraemos el mensaje una posiscion despues del espacio y lo pasamos a msg
                    if (name in users) {//*si el mobre esta en el arreglo users
                        users[name].emit("whisper", {//!entonces emite un evento  llamado whisper
                            msg,
                            nick: socket.nickname//-le  pasamos el mensaje y el usuario como parametros
                        });
                    } else {
                        cb("error, please enter a valid user ");//! si el nombre del usuario no esta en los usuarios regresamos un mensaje de error en la funcion callback
                    }
                } else {//! si no hay espacio en blanco por lo tanto no  hay mensaje
                    cb("enter your message")//! madamos una alerta para que ingrese el mensaje 
                }
            } else {
                var newMessage = Chat({
                    msg,
                    nick: socket.nickname
                });
                await newMessage.save();
                //! data  es el valor del input enviado por el cliente
                io.sockets.emit("new message", {//-le pasmos el objeto con el mensaje y el nick name
                    msg: data,
                    nick: socket.nickname
                });//- io.sockets retrasmite el mensaje a todos los sockests
            }

        })
        socket.on("disconnect", data => {
            if (!socket.nickname) return;
            delete users[socket.nickname];
            updateUsers();
        })
        function updateUsers() {
            io.sockets.emit("usernames", Object.keys(users));
        }
    });
}