// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!

// Get DOM elements
const stateInput = document.getElementById("state-input");
const getAlertsBtn = document.getElementById("fetch-alerts");
const alertsContainer = document.getElementById("alerts-display");
const errorMessageDiv = document.getElementById("error-message");

// Function to fetch weather alerts for a state
async function fetchWeatherAlerts(state) {
    try {
        const response = await fetch(`${weatherApi}${state.toUpperCase()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error.message);
        throw error;
    }
}

// Function to display alerts on the page
function displayAlerts(data) {
    // Clear previous alerts
    alertsContainer.innerHTML = "";
    
    // Get the features array (contains all alerts)
    const features = data.features || [];
    const alertCount = features.length;
    
    // Create summary message
    const summary = document.createElement("p");
    summary.textContent = `Weather Alerts: ${alertCount}`;
    alertsContainer.appendChild(summary);
    
    // Create list of alert headlines
    if (alertCount > 0) {
        const list = document.createElement("ul");
        
        features.forEach(alert => {
            const headline = alert.properties?.headline;
            if (headline) {
                const listItem = document.createElement("li");
                listItem.textContent = headline;
                list.appendChild(listItem);
            }
        });
        
        alertsContainer.appendChild(list);
    }
}

// Function to display error message
function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.classList.remove("hidden");
}

// Function to clear error message
function clearError() {
    errorMessageDiv.textContent = "";
    errorMessageDiv.classList.add("hidden");
}

// Function to clear input
function clearInput() {
    stateInput.value = "";
}

// Function to validate state input (2 letters)
function isValidState(state) {
    const stateRegex = /^[A-Za-z]{2}$/;
    return stateRegex.test(state);
}

// Main function to handle button click
async function handleGetAlerts() {
    // Clear previous error
    clearError();
    
    // Get input value
    const stateAbbr = stateInput.value.trim();
    
    // Validate input
    if (!stateAbbr) {
        displayError("Please enter a state abbreviation.");
        return;
    }
    
    if (!isValidState(stateAbbr)) {
        displayError("Please enter a valid 2-letter state abbreviation (e.g., CA, NY, TX).");
        return;
    }
    
    // Clear input field
    clearInput();
    
    // Show loading indicator
    alertsContainer.innerHTML = "<p>Loading weather alerts...</p>";
    
    try {
        // Fetch data from API
        const data = await fetchWeatherAlerts(stateAbbr);
        
        // Display alerts
        displayAlerts(data);
        
        // Clear error on success
        clearError();
    } catch (error) {
        // Display the actual error message
        displayError(error.message);
        alertsContainer.innerHTML = "";
    }
}

// Add event listener to button
if (getAlertsBtn) {
    getAlertsBtn.addEventListener("click", handleGetAlerts);
}

// Allow Enter key to submit
if (stateInput) {
    stateInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleGetAlerts();
        }
    });
}

// Export functions for testing
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        fetchWeatherAlerts,
        displayAlerts,
        displayError,
        clearError,
        clearInput,
        isValidState,
        handleGetAlerts
    };
}