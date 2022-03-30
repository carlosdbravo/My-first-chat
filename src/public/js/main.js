//!conexion de socket del cliente

$(function () {
    const socket = io();


    //: obtaining dom elements from the interface
    const $messageForm = $("#message-form");
    const $messageBox = $("#message")
    const $chat = $("#chat")
    //:obtaning doom elements from the login
    const $nickForm = $("#nickForm");
    const $nickError = $("#nickError");
    const $nickName = $("#nickName");
    //:esta constane la vamos a utilizar para listar los usuarios
    const $users = $("#usersnames");
    $nickForm.submit(e => {
        e.preventDefault();
        console.log("enviando...");
        if ($nickName.val().length <= 0 || $nickName.val().trim() == "") {//*campo validado
            $nickError.html(`<div class="alert alert-danger"> write your user name </div>`)
        } else {
            socket.emit("new user", $nickName.val(), data => {
                if (data) {//* aqui le enviamos al servidor datos de nuestro usuario utlizando la conexion de socket y emitiendo un nuevo envento
                    $("#nick-wrap").hide()
                    $("#content-wrap").show()
                } else {
                    $nickError.html(`<div class="alert alert-danger"> that user name alredy exist </div>`)
                }
                $nickName.val(null);
            });
        }

    })

    //:events

    $messageForm.submit(e => {//* una vez se ejecute el evento enviar de mi formulario ejecuta lo siguiente:
        e.preventDefault()//* previene que la pagina se actualice 
        //-tendremos que utilizar la conexion de sockets para enviar el mensaje
        //: creamos un evento para escuchar cuando se nvien los  datos
        socket.emit("send message", $messageBox.val(), data => {
            $chat.append(`<p class='error'>${data}</p>`)
        });//* por medio de este evento enviamos el valor  del box message  al servidor
        $messageBox.val("");//*limpiamos la caja despues de enviar el mensaje
    });

    socket.on("new message", function (data) {
        $chat.append("<b>" + data.nick + ": " + "</b>" + data.msg + "<br/>")
    })

    socket.on("usernames", data => {
        let html = "";
        for (let i = 0; i < data.length; i++) {
            html += `<p> <i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html);
    })
    socket.on("whisper", data => {
        displayMsg(data[i]);
    });
    socket.on("load old msgs", data => {
        for (let i = 0; i < data.length; i++) {
            displayMsg(data[i]);
        }
    })
    function displayMsg(data) {
        $chat.append(`<p class="whisper"><b>${data.nick}</b> ${data.msg}</p>`)
    }
});



