orderBtn.addEventListener("click", async () => {
  await fetch("http://localhost:5000/cart/place-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email })
  });

  const popup = document.getElementById("successPopup");
  popup.style.display = "flex"; // ✅ Only visible now

  setTimeout(() => {
    popup.style.display = "none";
    location.reload();
  }, 2500);
});
