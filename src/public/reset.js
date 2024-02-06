const newpassForm = document.getElementById("newpasswordForm");

newpassForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = newpassForm.querySelector('input[name="email"]').value;
  const newPassword = newpassForm.querySelector('input[name="newpass"]').value;

  const reply = await fetch("/api/sessions/changePass", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      newPass: newPassword,
    }),
  });
  if (reply.ok) {
    location.href = "/login";
  }
});
