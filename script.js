const API = "https://www.themealdb.com/api/json/v1/1/";

// Load categories & areas on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCategories();
    loadAreas();
    if (location.pathname.includes("meal.html")) {
        const params = new URLSearchParams(location.search);
        loadMealDetails(params.get("id"));
    }
});

// ----------------------- SEARCH BY NAME -----------------------
function searchMeal() {
    const name = document.getElementById("searchInput").value;

    fetch(`${API}search.php?s=${name}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals));
}

// ----------------------- RANDOM MEAL -----------------------
function getRandomMeal() {
    fetch(`${API}random.php`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals));
}

// ----------------------- CATEGORIES -----------------------
function loadCategories() {
    fetch(`${API}list.php?c=list`)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("categorySelect");
            data.meals.forEach(c => {
                select.innerHTML += `<option value="${c.strCategory}">${c.strCategory}</option>`;
            });
            select.onchange = () => filterByCategory(select.value);
        });
}

function filterByCategory(cat) {
    fetch(`${API}filter.php?c=${cat}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals));
}

// ----------------------- AREAS -----------------------
function loadAreas() {
    fetch(`${API}list.php?a=list`)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("areaSelect");
            data.meals.forEach(a => {
                select.innerHTML += `<option value="${a.strArea}">${a.strArea}</option>`;
            });
            select.onchange = () => filterByArea(select.value);
        });
}

function filterByArea(area) {
    fetch(`${API}filter.php?a=${area}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals));
}

// ----------------------- INGREDIENT SEARCH -----------------------
function searchByIngredient() {
    const ing = document.getElementById("ingredientInput").value;

    fetch(`${API}filter.php?i=${ing}`)
        .then(res => res.json())
        .then(data => displayMeals(data.meals));
}

// ----------------------- DISPLAY MEAL CARDS -----------------------
function displayMeals(meals) {
    const container = document.getElementById("mealContainer");
    container.innerHTML = "";

    if (!meals) {
        container.innerHTML = "<p>No results found</p>";
        return;
    }

    meals.forEach(m => {
        container.innerHTML += `
            <div class="meal-card" onclick="openMeal(${m.idMeal})">
                <img src="${m.strMealThumb}" alt="">
                <h3>${m.strMeal}</h3>
            </div>`;
    });
}

function openMeal(id) {
    location.href = `meal.html?id=${id}`;
}

// ----------------------- MEAL DETAILS -----------------------
function loadMealDetails(id) {
    fetch(`${API}lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => showMealDetails(data.meals[0]));
}

function showMealDetails(meal) {
    const container = document.getElementById("mealDetails");

    // Collect Ingredients
    let ingredientsHTML = "";
    for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing) ingredientsHTML += `<li>${ing} - ${measure}</li>`;
    }

    container.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" width="300">
        
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        
        <h3>Ingredients</h3>
        <ul>${ingredientsHTML}</ul>

        <h3>Instructions</h3>
        <p>${meal.strInstructions}</p>
    `;
}
