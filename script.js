let searchForm = document.querySelector('.search-form');
let loginForm = document.querySelector('.login-form');
let navbar = document.querySelector('.navbar');

document.querySelector('#search-icon').onclick = () => {
    searchForm.classList.toggle('active');
    loginForm.classList.remove('active');
};

document.querySelector('#user-icon').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
};

document.querySelector('.login-form').onsubmit = (e) => {
    e.preventDefault();

    let email = document.querySelector('.login-form input[type="email"]').value;
    let pass = document.querySelector('.login-form input[type="password"]').value;

    if ((email === "bob@mail.com" || email === "bob") && pass === "bobpass") {
        alert("Login successful!");
    } else {
        alert("Invalid credentials");
    }
};

const apiKey = "8f3fe5ecc73dc907fe0cdf1f9aae232c";

async function getWeather() {
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Trinidad&units=metric&appid=${apiKey}`);
        let data = await res.json();

        let temp = data.main.temp;
        let desc = data.weather[0].description;

        document.getElementById("weather-box").innerHTML = `
            <p><strong>Temperature:</strong> ${temp}°C</p>
            <p><strong>Condition:</strong> ${desc}</p>
        `;
    } catch (error) {
        document.getElementById("weather-box").innerHTML = "Failed to load weather.";
    }
}

getWeather();

window.onscroll = () => {
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
};

// ================= CART SYSTEM =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added!");
    displayCart();
}

function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let total = 0;

    if (!cartItems) return;

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price;

        cartItems.innerHTML += `
            <div>
                ${item.name} - TT$${item.price}
                <button onclick="removeItem(${index})">❌</button>
            </div>
        `;
    });

    document.getElementById("cart-total").innerText = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    alert("Checkout successful!");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

window.onload = displayCart;