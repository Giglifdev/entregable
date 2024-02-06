const socket = io();

// chat
let user;
const inputChat = document.getElementById("inputChat");
const messagesLogs = document.getElementById("messageLogs");

Swal.fire({
  title: "Welcome!",
  input: "text",
  text: "Enter your username",
  inputValidator: (value) => {
    return !value && "This field can not be blank";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  user = result.value;
  socket.emit("authenticated", user);
});

inputChat.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (inputChat.value.trim().length > 0) {
      socket.emit("message", { user, text: inputChat.value });
      inputChat.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  console.log(data);
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} dice: ${message.text}<br/>`;
  });
  messagesLogs.innerHTML = messages;
});
