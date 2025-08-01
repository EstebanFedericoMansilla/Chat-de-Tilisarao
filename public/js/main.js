$(function () {
  // socket.io client side connection
  const socket = io.connect();

  // obtaining DOM elements from the Chat Interface
  const $messageForm = $("#message-form");
  const $messageBox = $("#message");
  const $chat = $("#chat");


  // obteniendo elementos del formulario de autenticación
  const $authForm = $("#authForm");
  const $nickError = $("#nickError");
  const $nickname = $("#nickname");
  const $password = $("#password");
  const $loginBtn = $("#loginBtn");
  const $registerBtn = $("#registerBtn");

  // obtaining the usernames container DOM
  const $users = $("#usernames");

  // --- INICIO: Persistencia de sesión ---

  // Función para verificar sesión existente al cargar la página
  function checkExistingSession() {
    const savedUser = localStorage.getItem('chatUser');
    const sessionToken = localStorage.getItem('sessionToken');
    if (savedUser && sessionToken) {
      $nickError.html('<div class="alert alert-info">Verificando sesión...</div>');
      $.post('/verify-session', { nick: savedUser, token: sessionToken }, function (data) {
        if (data.success) {
          connectUserToChat(savedUser);
        } else {
          clearSession();
          $nickError.html('<div class="alert alert-warning">Sesión expirada, por favor inicia sesión nuevamente.</div>');
        }
      }).fail(function() {
        clearSession();
        $nickError.html('<div class="alert alert-danger">Error verificando sesión, por favor inicia sesión.</div>');
      });
    }
  }

  // Función para limpiar datos de sesión
  function clearSession() {
    localStorage.removeItem('chatUser');
    localStorage.removeItem('sessionToken');
  }

  // Función para conectar usuario al chat
  function connectUserToChat(nick) {
    socket.emit("new user", nick, function (ok) {
      if (ok) {
        $("#nickWrap").hide();
        document.querySelector("#contentWrap").style.display = "flex";
        $("#message").focus();
        $("#logoutBtn").show();
        $nickError.html('');
      } else {
        $nickError.html('<div class="alert alert-danger">Ese apodo ya está en uso en el chat.</div>');
        clearSession();
      }
    });
  }

  // Función para cerrar sesión
  function logout() {
    const token = localStorage.getItem('sessionToken');
    if (token) {
      $.post('/logout', { token: token });
    }
    clearSession();
    socket.disconnect();
    location.reload();
  }

  // Verificar sesión al cargar la página
  checkExistingSession();

  // Evento para logout
  $(document).on('click', '#logoutBtn', function (e) {
    e.preventDefault();
    if (confirm('¿Estás seguro que quieres cerrar sesión?')) {
      logout();
    }
  });

  // Atajo de teclado para logout (Ctrl + L)
  $(document).on('keydown', function(e) {
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      if (confirm('¿Cerrar sesión?')) {
        logout();
      }
    }
  });

  // --- FIN: Persistencia de sesión ---

  // Evento para login
  $loginBtn.on('click', function (e) {
    e.preventDefault();
    const nick = $nickname.val().trim();
    const pass = $password.val();
    if (!nick || !pass) {
      $nickError.html('<div class="alert alert-danger">Completa apodo y contraseña.</div>');
      return;
    }
    $nickError.html('<div class="alert alert-info">Iniciando sesión...</div>');
    $.post('/login', { nick, password: pass }, function (data) {
      if (data.success && data.token) {
        localStorage.setItem('chatUser', nick);
        localStorage.setItem('sessionToken', data.token);
        connectUserToChat(nick);
      } else {
        $nickError.html('<div class="alert alert-danger">' + (data.message || 'Error de login') + '</div>');
      }
    }).fail(function() {
      $nickError.html('<div class="alert alert-danger">Error de conexión, intenta nuevamente.</div>');
    });
  });

  // Evento para registro
  $registerBtn.on('click', function (e) {
    e.preventDefault();
    const nick = $nickname.val().trim();
    const pass = $password.val();
    if (!nick || !pass) {
      $nickError.html('<div class="alert alert-danger">Completa apodo y contraseña.</div>');
      return;
    }
    $.post('/register', { nick, password: pass }, function (data) {
      if (data.success) {
        $nickError.html('<div class="alert alert-success">Usuario registrado, ahora puedes iniciar sesión.</div>');
      } else {
        $nickError.html('<div class="alert alert-danger">' + data.message + '</div>');
      }
    });
  });

  // events
  $messageForm.submit((e) => {
    e.preventDefault();
    socket.emit("send message", $messageBox.val(), (data) => {
      $chat.append(`<p class="error">${data}</p>`);
    });
    $messageBox.val("");
  });

  socket.on("new message", (data) => {
    displayMsg(data);
  });

  socket.on("usernames", (data) => {
    let html = "";
    for (let i = 0; i < data.length; i++) {
      html += `<p class="user-item" data-user="${data[i]}"><i class="fas fa-user"></i> ${data[i]}</p>`;
    }
    $users.html(html);
  });

  // Evento click en usuario para abrir modal de mensaje privado
  $(document).on('click', '.user-item', function() {
    const user = $(this).data('user');
    const myNick = localStorage.getItem('chatUser');
    if (user === myNick) return; // No enviar privado a uno mismo
    $('#privateMsgUser').text(user);
    $('#privateMsgInput').val("");
    const modal = new bootstrap.Modal(document.getElementById('privateMsgModal'));
    modal.show();
  });

  // Evento para enviar mensaje privado desde el modal
  $('#sendPrivateMsgBtn').on('click', function() {
    const user = $('#privateMsgUser').text();
    const msg = $('#privateMsgInput').val().trim();
    if (!msg) return;
    socket.emit("send message", `/w ${user} ${msg}`, (data) => {
      $chat.append(`<p class="error">${data}</p>`);
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('privateMsgModal'));
    modal.hide();
  });

  socket.on("whisper", (data) => {
    $chat.append(`<p class="whisper"><b>${data.nick}</b>: ${data.msg}</p>`);
  });

  socket.on("load old msgs", (msgs) => {
    for (let i = msgs.length - 1; i >= 0; i--) {
      displayMsg(msgs[i]);
    }
  });

  function displayMsg(data) {
    $chat.append(
      `<p class="p-2 bg-secondary w-75 animate__animated animate__backInUp"><b>${data.nick}</b>: ${data.msg}</p>`
    );
    const chat = document.querySelector("#chat");
    chat.scrollTop = chat.scrollHeight;
  }

  // Emoji picker
  const emojiBtn = document.querySelector('#emoji-btn');
  const messageInput = document.querySelector('#message');
  if (emojiBtn && messageInput && window.EmojiButton) {
    const picker = new EmojiButton();
    emojiBtn.addEventListener('click', () => {
      picker.togglePicker(emojiBtn);
    });
    picker.on('emoji', emoji => {
      messageInput.value += emoji;
      messageInput.focus();
    });
  }
});
