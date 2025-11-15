  document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please log in to view your wishlist.");

    const res = await fetch(`http://localhost:5000/wishlist/${user.email}`);
    const wishlist = await res.json();

    const container = document.getElementById("wishlistContainer");

    if (wishlist.length === 0) {
      container.innerHTML = "<p class='empty'>Your wishlist is empty 💔</p>";
      return;
    }

    container.innerHTML = wishlist.map(item => `
      <div class="card">
        <div class="card_img">
          <img src="images/${item.image}" alt="${item.name}">
        </div>
        <div class="content">
          <h3>${item.name}</h3>
          <div class="price">INR ${item.price}</div>
          <button class="btn" onclick="removeWishlist(${item.id})">Remove</button>
        </div>
      </div>
    `).join('');
  });

  async function removeWishlist(id) {
    await fetch(`http://localhost:5000/wishlist/${id}`, { method: "DELETE" });
    const popup = document.getElementById("successPopup");
    popup.style.display = "flex";
    setTimeout(() => location.reload(), 1500);
  }