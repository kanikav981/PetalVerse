document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  message.textContent = data.message;

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
    message.style.color = "green";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  } else {
    message.style.color = "red";
  }
});



