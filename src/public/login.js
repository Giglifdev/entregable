const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      if (result.status === 200) {
        console.log("Login successful");
        window.location.replace("/");
      } else if (result.status === 401) {
        console.log("Invalid credentials");
      } else {
        console.log("Server error:", result.status);
      }
    })
    .catch((error) => {
      console.error("Fetch call error:", error);
    });
});
