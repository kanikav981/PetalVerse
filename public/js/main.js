// main.js — for greeting + logout + user icon control
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userGreeting = document.getElementById("userGreeting");
  const logoutBtn = document.getElementById("logoutBtn");
  const userIcon = document.querySelector(".fa-user");

  if (user) {
    // If user is logged in
    if (userGreeting) {
      userGreeting.textContent = `Hi, ${user.name} 👋`;
      userGreeting.style.fontSize = "1.5rem";
      userGreeting.style.color = "#fb6f92";
    }
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userIcon) userIcon.style.display = "none";
  } else {
    // If user not logged in
    if (userGreeting) userGreeting.textContent = "";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userIcon) userIcon.style.display = "inline-block";
  }

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      alert("You’ve been logged out successfully!");
      window.location.href = "login.html";
    });
  }
});
