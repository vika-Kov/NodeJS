$(function () {
  const FADE_TIME = 150; // ms
  const COLORS = [
    "#e21400",
    "#91580f",
    "#f8a700",
    "#f78b00",
    "#58dc00",
    "#287b00",
    "#a8f07a",
    "#4ae8c4",
    "#3b88eb",
    "#3824aa",
    "#a700ff",
    "#d300e7",
  ];

  // Инициализация
  const $window = $(window);
  const $usernameInput = $(".usernameInput");
  const $messages = $(".messages");
  const $inputMessage = $(".inputMessage");

  const $loginPage = $(".login.page");
  const $chatPage = $(".chat.page");

  const socket = io();

  let username;
  let connected = false;
  let $currentInput = $usernameInput.focus();

  const addParticipantsMessage = (data) => {
    let message = "";
    if (data.numUsers === 1) {
      message += `Один участник в чате`;
    } else {
      message += `В чате ${data.numUsers} участников`;
    }
    log(message);
  };

  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());

    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off("click");
      $currentInput = $inputMessage.focus();

      socket.emit("add user", username);
    }
  };

  const sendMessage = () => {
    let message = $inputMessage.val();
    message = cleanInput(message);
    if (message && connected) {
      $inputMessage.val("");
      addChatMessage({ username, message });
      socket.emit("new message", message);
    }
  };

  const log = (message, options) => {
    const $el = $("<li>").addClass("log").text(message);
    addMessageElement($el, options);
  };

  const addChatMessage = (data, options = {}) => {
    const $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css("color", getUsernameColor(data.username));
    const $messageBodyDiv = $('<span class="messageBody">').text(data.message);

    const $messageDiv = $('<li class="message"/>')
      .data("username", data.username)
      .append($usernameDiv, $messageBodyDiv);
    addMessageElement($messageDiv, options);
  };

  const addMessageElement = (el, options) => {
    const $el = $(el);
    if (!options) {
      options = {};
    }
    if (typeof options.fade === "undefined") {
      options.fade = true;
    }
    if (typeof options.prepend === "undefined") {
      options.prepend = false;
    }

    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }

    $messages[0].scrollTop = $messages[0].scrollHeight;
  };

  const cleanInput = (input) => {
    return $("<div/>").text(input).html();
  };

  const getUsernameColor = (username) => {
    let hash = 7;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }

    const index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  };

  // Клавиавтура

  $window.keydown((event) => {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    if (event.which === 13) {
      if (username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });

  // Обработка кликов

  $loginPage.click(() => {
    $currentInput.focus();
  });

  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  // Обработка ивентов

  socket.on("login", (data) => {
    connected = true;
    const message = "Добро пожаловать в чат!";
    log(message, {
      prepend: true,
    });
    addParticipantsMessage(data);
  });

  socket.on("new message", (data) => {
    addChatMessage(data);
  });

  socket.on("user joined", (data) => {
    log(`${data.username} подключился`);
    addParticipantsMessage(data);
  });

  socket.on("user left", (data) => {
    log(`${data.username} вышел из чата`);
    addParticipantsMessage(data);
  });

  socket.on("disconnect", () => {
    log("вы вышли из чата");
  });

  socket.on("reconnect", () => {
    log("вы переподключились");
    if (username) {
      socket.emit("add user", username);
    }
  });

  socket.on("reconnect_error", () => {
    log("переподключение не удалось");
  });
});
