function isLoggedIn() {
    return localStorage.getItem("currentUser");
}

function getCurrentUser() {
    return localStorage.getItem("currentUser");
}

function getCartKey() {
    let user = getCurrentUser();
    return "cart_" + user;
}

let searchForm = document.querySelector('.search-form');
let loginForm = document.querySelector('.login-form');
let navbar = document.querySelector('.navbar');
let cartIcon = document.querySelector('#cart-icon');

let searchBtn = document.querySelector('#search-icon');
if (searchBtn && searchForm && loginForm) {
    searchBtn.onclick = () => {
        searchForm.classList.toggle('active');
        loginForm.classList.remove('active');
    };
}

let userBtn = document.querySelector('#user-icon');
if (userBtn && loginForm && searchForm) {
    userBtn.onclick = () => {
        loginForm.classList.toggle('active');
        searchForm.classList.remove('active');
    };
}

if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();

        let email = loginForm.querySelector('input[type="email"]').value;
        let pass = loginForm.querySelector('input[type="password"]').value;

        if ((email === "bob@mail.com" || email === "bob") && pass === "bobpass") {

            localStorage.setItem("currentUser", "bob");

            alert("Login successful!");
            loginForm.classList.remove('active');

            loadCart();
            updateFavoriteButtons();
            displayCart();
            updateCartCount();

        } else {
            alert("Invalid credentials");
        }
    };
}

// Favorites
function toggleFavorite(name, image) {

    let user = getCurrentUser();

    if (!user) {
        loginForm.classList.add("active");
        return;
    }

    let key = "favorites_" + user;
    let favorites = JSON.parse(localStorage.getItem(key)) || [];

    let exists = favorites.find(item => item.name === name);

    if (exists) {
        favorites = favorites.filter(item => item.name !== name);
    } else {
        favorites.push({ name, image });
    }

    localStorage.setItem(key, JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {

    let user = getCurrentUser();
    if (!user) return;

    let favorites = JSON.parse(localStorage.getItem("favorites_" + user)) || [];

    document.querySelectorAll("[onclick^='toggleFavorite']").forEach(btn => {

        let args = btn.getAttribute("onclick");
        let name = args.match(/'(.*?)'/)[1];

        let found = favorites.find(item => item.name === name);

        btn.textContent = found ? "💖" : "🤍";
    });
}

// Weather API
const apiKey = "8f3fe5ecc73dc907fe0cdf1f9aae232c";

async function getWeather() {
    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Trinidad&units=metric&appid=${apiKey}`);
        let data = await res.json();

        let weatherBox = document.getElementById("weather-box");

        if (weatherBox) {
            weatherBox.innerHTML = `
                <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>
            `;
        }
    } catch {
        let weatherBox = document.getElementById("weather-box");
        if (weatherBox) weatherBox.innerHTML = "Failed to load weather.";
    }
}

getWeather();

let contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); 

        alert("Message sent!");

        contactForm.reset();
    });
}

// Cart 
let cart = [];

function loadCart() {
    if (!isLoggedIn()) {
        cart = [];
        return;
    }

    cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
}

function saveCart() {
    if (!isLoggedIn()) return;
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
}

function addToCart(name, price) {

    if (!isLoggedIn()) {
        loginForm.classList.add("active");
        return;
    }

    cart.push({ name, price });
    saveCart();

    alert(name + " added to cart!");

    displayCart();
    updateCartCount();

    let cartBox = document.querySelector('.cart');
    if (cartBox) cartBox.classList.add("active");
}

function updateCartCount() {
    let countEl = document.getElementById("cart-count");

    if (!countEl) return;

    if (!isLoggedIn()) {
        countEl.innerText = 0;
        return;
    }

    let savedCart = JSON.parse(localStorage.getItem(getCartKey())) || [];
    countEl.innerText = savedCart.length;
}

function displayCart() {

    let cartItems = document.getElementById("cart-items");
    let cartBox = document.querySelector(".cart");

    if (!cartItems || !cartBox) return;

    let total = 0;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        let totalEl = document.getElementById("cart-total");
        if (totalEl) totalEl.innerText = 0;
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
    saveCart();
    displayCart();
    updateCartCount();
}

function checkout() {

    if (!isLoggedIn()) {
        loginForm.classList.add("active");
        return;
    }

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    alert("Checkout successful!");

    cart = [];
    saveCart();

    displayCart();
    updateCartCount();
}

if (cartIcon) {
    cartIcon.onclick = () => {
        let cartBox = document.querySelector('.cart');
        if (cartBox) cartBox.classList.toggle('active');
    };
}

//Recipes
async function searchRecipes() {

    let query = document.getElementById("recipe-search").value;

    if (!query) {
        alert("Enter something to search!");
        return;
    }

    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    let data = await res.json();

    let container = document.getElementById("recipes-container");
    if (!container) return;

    container.innerHTML = "";

    if (!data.meals) {
        container.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    data.meals.forEach(meal => {
        container.innerHTML += `
            <div class="product-item">
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <button class="btn" onclick='showRecipe(${JSON.stringify(meal)})'>
                    View Recipe
                </button>
            </div>
        `;
    });
}

function showRecipe(meal) {

    let modal = document.getElementById("recipe-modal");
    let details = document.getElementById("recipe-details");

    details.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}">
        <p>${meal.strInstructions}</p>
    `;

    modal.style.display = "block";
}

function closeRecipe() {
    document.getElementById("recipe-modal").style.display = "none";
}

window.onscroll = () => {
    if (searchForm) searchForm.classList.remove('active');
    if (loginForm) loginForm.classList.remove('active');
    if (navbar) navbar.classList.remove('active');
};

window.addEventListener('load', () => { 
    loadCart();
    displayCart();
    updateCartCount();
    updateFavoriteButtons();
});
