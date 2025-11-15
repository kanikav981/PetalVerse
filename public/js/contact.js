document.getElementById("contactForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("number").value;
  const message = document.getElementById("message").value;

  // Send to backend
  const res = await fetch("http://localhost:5000/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, message })
  });

  const data = await res.json();

  // Show popup
  const popup = document.getElementById("successPopup");
  popup.querySelector("p").textContent = data.message || "Message sent successfully!";
  popup.style.display = "flex";
  document.getElementById("contactForm").reset();

  setTimeout(() => popup.style.display = "none", 3000);
});