const form = document.getElementById("registerForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));
  console.log("Before the fetch call");
  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => {
      console.log("After the fetch call");
      if (result.status === 201) {
        console.log("Redirect to /login");
        window.location.replace("/login");
      } else {
        console.log("Server error:", result.status);
      }
    })
    .catch((error) => {
      console.error("Fetch call error:", error);
    });
});
