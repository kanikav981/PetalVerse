document.addEventListener("DOMContentLoaded", async () => {
  const productContainer = document.querySelector(".card_container");

  const res = await fetch("http://localhost:5000/products");
  const products = await res.json();

  productContainer.innerHTML = products.map(p => `
    <div class="card">
      <div class="card_img">
        <img src="images/${p.image}" alt="${p.name}">
        <div class="icons">
          <a href="#" class="fa-solid fa-heart" onclick="addToWishlist(${p.id})"></a>
          <button class="card_btn" onclick="addToCart(${p.id})">Add to Cart</button>
          <a href="#" class="fa-solid fa-share"></a>
        </div>
      </div>
      <div class="content">
        <h3>${p.name}</h3>
        <div class="price">INR ${p.price}</div>
      </div>
    </div>
  `).join('');
});

async function addToCart(productId) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return alert("Please log in to add to cart.");

  const res = await fetch("http://localhost:5000/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, product_id: productId })
  });

  if (res.ok) {
    // ✅ Show success popup instead of default alert
    const popup = document.getElementById("successPopup");
    popup.querySelector("p").textContent = "🎉 Item added to cart!";
    popup.style.display = "flex";
    setTimeout(() => popup.style.display = "none", 2500);
  } else {
    alert("Failed to add to cart.");
  }
}

// Wishlist placeholder function
function addToWishlist(id) {
  alert("Added to wishlist!");
}

async function addToWishlist(productId) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return alert("Please log in to add items to your wishlist.");

  await fetch("http://localhost:5000/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, product_id: productId })
  });

  alert("💖 Product added to your wishlist!");
  window.location.href = "wishlist.html";
}
