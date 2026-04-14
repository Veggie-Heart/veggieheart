let searchForm = document.querySelector('.search-form');
let loginForm = document.querySelector('.login-form');
let navbar = document.querySelector('.navbar');

/* Searchbar */
let searchBtn = document.querySelector('#search-icon');
if (searchBtn && searchForm && loginForm) {
    searchBtn.onclick = () => {
        searchForm.classList.toggle('active');
        loginForm.classList.remove('active');
    };
}

/* login */
let userBtn = document.querySelector('#user-icon');
if (userBtn && loginForm && searchForm) {
    userBtn.onclick = () => {
        loginForm.classList.toggle('active');
        searchForm.classList.remove('active');
    };
}

/* BOB and others */
if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();

        let email = loginForm.querySelector('input[type="email"]').value;
        let pass = loginForm.querySelector('input[type="password"]').value;

        if ((email === "bob@mail.com" || email === "bob") && pass === "bobpass") {
            localStorage.setItem("currentUser", "bob");
            alert("Login successful!");
            loginForm.classList.remove('active');
        } else {
            alert("Invalid credentials");
        }
    };
}

/* Saving favorite info*/
function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function toggleFavorite(itemName) {
    let user = getCurrentUser();

    if (!user) {
        loginForm.classList.add("active");
        return;
    }

    let key = "favorites_" + user;
    let favorites = JSON.parse(localStorage.getItem(key)) || [];

    if (favorites.includes(itemName)) {
        favorites = favorites.filter(item => item !== itemName);
    } else {
        favorites.push(itemName);
    }

    localStorage.setItem(key, JSON.stringify(favorites));

    updateFavoriteButtons();
}


function updateFavoriteButtons() {
    let user = getCurrentUser();
    if (!user) return;

    let key = "favorites_" + user;
    let favorites = JSON.parse(localStorage.getItem(key)) || [];

    document.querySelectorAll('button[onclick*="toggleFavorite"]').forEach(btn => {
        let itemName = btn.getAttribute('onclick').match(/toggleFavorite\('(.*)'\)/)[1];
        if (favorites.includes(itemName)) {
            btn.innerHTML = '❤️';
        } else {
            btn.innerHTML = '🤍';
        }
    });
}

window.onscroll = () => {
    if (searchForm) searchForm.classList.remove('active');
    if (loginForm) loginForm.classList.remove('active');
    if (navbar) navbar.classList.remove('active');
};

/* OpenWeatherMap API */
const apiKey = "8f3fe5ecc73dc907fe0cdf1f9aae232c";

async function getWeather() {
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Trinidad&units=metric&appid=${apiKey}`);
        let data = await res.json();

        let temp = data.main.temp;
        let desc = data.weather[0].description;

        let weatherBox = document.getElementById("weather-box");
        if (weatherBox) {
            weatherBox.innerHTML = `
                <p><strong>Temperature:</strong> ${temp}°C</p>
                <p><strong>Condition:</strong> ${desc}</p>
            `;
        }
    } catch (error) {
        let weatherBox = document.getElementById("weather-box");
        if (weatherBox) {
            weatherBox.innerHTML = "Failed to load weather.";
        }
    }
}

getWeather();

/* Cart */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " added to cart!");
    displayCart();
    updateCartCount();
}
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let cartBox = document.querySelector(".cart");
    let total = 0;

    if (!cartItems || !cartBox) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartBox.classList.remove("active");
        return;
    }

    cart.forEach((item, index) => {
        total += item.price;

        cartItems.innerHTML += `
            <div>
                ${item.name} - TT$${item.price}
                <button onclick="removeItem(${index})">❌</button>
            </div>
        `;
    });

    let totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.innerText = total;
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
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
    updateCartCount();
}

let cartIcon = document.querySelector('#cart-icon');

if (cartIcon) {
    cartIcon.onclick = () => {
        let cartBox = document.querySelector('.cart');
        if (cartBox) cartBox.classList.toggle('active');
    };
}

function updateCartCount() {
    let count = document.getElementById("cart-count");
    if (count) count.innerText = cart.length;
}

/* run on page load */
window.onload = () => {
    displayCart();
    updateCartCount();
    updateFavoriteButtons();
};
