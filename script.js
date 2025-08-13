let cart = [];
let products = [
    { name: "دواء مسكن", price: 20, quantity: 10, img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" },
    { name: "فيتامين C", price: 15, quantity: 5, img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400" },
    { name: "ميزان حرارة", price: 25, quantity: 7, img: "https://images.unsplash.com/photo-1588774069270-3a9a6aefc7e5?w=400" },
    { name: "جهاز ضغط", price: 120, quantity: 3, img: "https://images.unsplash.com/photo-1588776814546-2f9f4b4b2ff6?w=400" },
    { name: "مرهم مضاد حيوي", price: 18, quantity: 8, img: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400" }
];

function renderProducts(list = products) {
    let productList = document.getElementById("product-list");
    productList.innerHTML = "";

    list.forEach((product, index) => {
        let div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>السعر: ${product.price} جنيه</p>
            <p>المتوفر: ${product.quantity}</p>
            <button onclick="addToCart(${products.indexOf(product)})" ${product.quantity === 0 ? "disabled" : ""}>
                ${product.quantity > 0 ? "أضف للسلة" : "غير متوفر"}
            </button>
        `;
        productList.appendChild(div);
    });
}

function addToCart(index) {
    if (products[index].quantity > 0) {
        cart.push({ name: products[index].name, price: products[index].price });
        products[index].quantity--;
        renderProducts();
        renderCart();
    }
}

function renderCart() {
    let cartItems = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let cartCount = document.getElementById("cart-count");

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = ${item.name} - ${item.price} جنيه;
        cartItems.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = total;
    cartCount.textContent = cart.length;
}

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let templateParams = {
        buyer_name: document.getElementById("buyer_name").value,
        buyer_phone: document.getElementById("buyer_phone").value,
        buyer_email: document.getElementById("buyer_email").value,
        buyer_address: document.getElementById("buyer_address").value,
        order_list: cart.map(item => `${item.name} - ${item.price} جنيه`).join("\n"),
        order_total: document.getElementById("cart-total").textContent
    };

    emailjs.send("service_bduy4fu", "template_xi2co54", templateParams)
    .then(function() {
        alert("تم إرسال الطلب بنجاح!");
        cart = [];
        renderCart();
        document.getElementById("orderForm").reset();
    }, function(error) {
        alert("خطأ: " + JSON.stringify(error));
    });
});

document.getElementById("searchInput").addEventListener("input", function() {
    let searchValue = this.value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(searchValue));
    renderProducts(filtered);
});

renderProducts();
renderCart();