/**
 * Author: Chong Yi Yang
 * Target: all HTML files
 * Purpose: Javascript enhancements
 * Created: 13/9/2024
 * Last updated: 19/9/2024
 * Credits: 
 */

/**
 * Enhancement 1
 * Dynamic addition, deletion, price calculation and error handling 
 * of products in enquire.html
 * 
 */

// Function that dynamically creates a product when user clicks add product
function createProductItem(productNo) {
    const productList = document.getElementById("product-list");
    // Create product container in product list
    const productContainer = document.createElement("div");
    productContainer.className = "product-item";
    productContainer.setAttribute("id", "prod-item-" + productNo);

    // Add elements into the product container
    productContainer.innerHTML = `
        <div class="prod-head-group">
            <label for="product-${productNo}">Select a Product</label>
            <button type="button" class="delete-prod" id="del-prod-${productNo}">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
                    <path d="M 15 4 C 14.476563 4 13.941406 4.183594 13.5625 4.5625 C 13.183594 4.941406 13 5.476563 13 6 L 13 7 L 7 7 L 7 9 L 8 9 L 8 25 C 8 26.644531 9.355469 28 11 28 L 23 28 C 24.644531 28 26 26.644531 26 25 L 26 9 L 27 9 L 27 7 L 21 7 L 21 6 C 21 5.476563 20.816406 4.941406 20.4375 4.5625 C 20.058594 4.183594 19.523438 4 19 4 Z M 15 6 L 19 6 L 19 7 L 15 7 Z M 10 9 L 24 9 L 24 25 C 24 25.554688 23.554688 26 23 26 L 11 26 C 10.445313 26 10 25.554688 10 25 Z M 12 12 L 12 23 L 14 23 L 14 12 Z M 16 12 L 16 23 L 18 23 L 18 12 Z M 20 12 L 20 23 L 22 23 L 22 12 Z"></path>
                </svg>
            </button>
        </div>
        
        <select id="product-${productNo}" name="product-${productNo}" class="has-error-span" required>
            <option value="" selected>--- Please Select ---</option>
            <option value="light-bulbs">Smart Light Bulbs</option>
            <option value="leds">Smart LEDs</option>
            <option value="light-strips">Smart Light Strips</option>
        </select>

        <div id="product-options-${productNo}"></div>  
    `

    productList.appendChild(productContainer);
    // Add onclick event for delete/trash button to remove item
    const deleteButton = document.getElementById("del-prod-" + productNo);
    deleteButton.onclick = () => removeProduct(productNo);
    // Add onchange event for product select to display options & delete button
    const productSelect = document.getElementById("product-" + productNo);
    productSelect.onchange = () => updateProductOptions(productNo);
}

// Function that removes product when user clicks the delete button
function removeProduct(productNo) {
    // Get the number of products in the list
    const amtOfProducts = getAllProducts();
    // Product amount cannot be less than 1, don't allow remove if amount is 1
    if (amtOfProducts.length > 1) {
        // Get product item and remove
        const productItemID = "prod-item-" + productNo;
        const productItem = document.getElementById(productItemID)

        // Check if product footer exists
        const productFoot = productItem.querySelector(".product-footer");
        if (productFoot) {
            // If exists then minus final price with prev price
            const priceSpan = productFoot.querySelector("#price-" + productNo);
            minusPrevPrice(priceSpan);
        }
        productItem.remove();
    }

    else {
        showToast("You must have at least 1 product.");
    }
}

// Function that populates the product options when user chooses a product
function updateProductOptions(productNo) {
    const product = document.getElementById("product-" + productNo).value;
    const productOptionsContainer= document.getElementById("product-options-" + productNo);

    // Clear previous options from container
    productOptionsContainer.innerHTML = "";
    // Remove product footer
    // Get product item
    const productItem = document.getElementById("prod-item-" + productNo);
    // Get product footer with class
    const productFooter = productItem.querySelector(".product-footer");

    if (productFooter) {
        // Update final price
        const priceSpan = productFooter.querySelector("#price-" + productNo);
        minusPrevPrice(priceSpan);
        // If product footer exists remove
        productFooter.remove();
    }
    // Set new options
    if (product === "light-bulbs") {
        // For light bulbs different sizes
        productOptionsContainer.innerHTML = `
            <label class="prod-option-header">Size:</label>
            <input type="hidden" id="option-${productNo}" name="option-${productNo}">
            <button type="button" class="option-btn" data-value="a19" data-price="17.99">A19<br>A$17.99</button>
            <button type="button" class="option-btn" data-value="br30" data-price="22.99">BR30<br>A$22.99</button>
            <button type="button" class="option-btn" data-value="gu10" data-price="19.99">GU10<br>A$19.99</button>
            <span class="error-msg" hidden></span>    
        `
    }
    else if(product === "leds") {
        // Different lengths for LED
        productOptionsContainer.innerHTML = `
            <label class="prod-option-header">Length:</label>
            <input type="hidden" id="option-${productNo}" name="option-${productNo}">
            <button type="button" class="option-btn" data-value="2m" data-price="19.99">2m<br>A$19.99</button>
            <button type="button" class="option-btn" data-value="5m" data-price="27.99">5m<br>A$27.99</button>
            <button type="button" class="option-btn" data-value="10m" data-price="42.99">10m<br>A$42.99</button>
            <span class="error-msg" hidden></span> 
        `
    }
    else if(product === "light-strips") {
        // Different length options for light strips
        productOptionsContainer.innerHTML = `
            <label class="prod-option-header">Length:</label>
            <input type="hidden" id="option-${productNo}" name="option-${productNo}">
            <button type="button" class="option-btn" data-value="1m" data-price="12.99">1m<br>A$12.99</button>
            <button type="button" class="option-btn" data-value="2m" data-price="21.99">2m<br>A$21.99</button>
            <button type="button" class="option-btn" data-value="5m" data-price="33.99">5m<br>A$33.99</button>
            <span class="error-msg" hidden></span> 
        `
    }
    else {
        return;
    }

    setOptionButtonEvents(productNo, productOptionsContainer);
}

// Function that sets button events for all product options buttons
function setOptionButtonEvents(productNo, optionsContainer) {
    // Loop all options button and add events
    const allButtons = optionsContainer.getElementsByTagName("button");
    for (var i = 0; i < allButtons.length; i++) {
        const currButton = allButtons[i];
        currButton.onclick = () => {
            // Once clicked show product footer and hide error message
            showProductFooter(productNo, currButton, allButtons);

            const errorSpan = optionsContainer.querySelector(".error-msg");
            hideErrorMessage(errorSpan, null);
        }
    }
}

// Function that shows the product footer when the user selects a product option
function showProductFooter(productNo, btn, btnList) {
    // Get or create product footer
    const productFooter = getOrCreateFooter(productNo);
    
    const errorSpan = productFooter.querySelector(".error-msg");
    // Set add and minus quantity buttons to change quantity
    const minusBtn = document.getElementById("minus-qty-" + productNo);
    const addBtn = document.getElementById("add-qty-" + productNo);
    const quantityInput = document.getElementById("quantity-" + productNo);

    // Use spread operator to convert HTMLCollection to Array
    [...btnList].forEach(button => {
        // Each button in button list remove the active class
        button.classList.remove("active");
    });
    // Add active to current button to only ensure 1 button active at a time
    btn.classList.add("active");

    // Set event listeners for buttons and input
    minusBtn.onclick = () => {
        // If successfully minus then update price
        if (minusQty(quantityInput, errorSpan)) {
            calculateProductPrice(productNo, btn, quantityInput);
        }
    }
    addBtn.onclick = () => {
        if (addQty(quantityInput, errorSpan)) {
            calculateProductPrice(productNo, btn, quantityInput);
        }
        
    }
    quantityInput.oninput = () => {
        if(checkQty(quantityInput, errorSpan)) {
            calculateProductPrice(productNo, btn, quantityInput);
        }
    }

    // Recalculate product prices when user selects a product option
    if (checkQty(quantityInput, errorSpan)) 
        calculateProductPrice(productNo, btn, quantityInput);
    
    // Add to hidden input when option button clicked
    const optionHiddenInput = document.getElementById("option-" + productNo);

    optionHiddenInput.value = btn.getAttribute("data-value");
}

// Function that will get existing or create product footer
function getOrCreateFooter(productNo) {
    const productContainer = document.getElementById("prod-item-" + productNo);

    // Find footer in product container
    var productFooter = productContainer.querySelector(".product-footer");

    // If footer doesn't exist then create footer
    if (!productFooter) {
        productFooter = createProductFooter(productNo);
        productContainer.appendChild(productFooter);
    }

    return productFooter;
}


// Function that creates the product footer
function createProductFooter(productNo) {
    // Create new div element and assign class of product-footer
    const productFooter = document.createElement("div");
    productFooter.classList.add("product-footer");

    // Add HTML elements into the product footer
    productFooter.innerHTML = `
        <div id="qty-container-${productNo}">
            <label for="quantity-${productNo}" class="prod-option-header">Quantity:</label>
            <div>
                <button type="button" class="qty-btn" id="minus-qty-${productNo}">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                        <path d="M 6.5 22.5 A 1.50015 1.50015 0 1 0 6.5 25.5 L 41.5 25.5 A 1.50015 1.50015 0 1 0 41.5 22.5 L 6.5 22.5 z"></path>
                    </svg>
                </button>
                <input type="text" id="quantity-${productNo}" name="quantity-${productNo}" value="1" class="qty-input">

                <button type="button" class="qty-btn" id="add-qty-${productNo}">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                        <path d="M 23.976562 4.9785156 A 1.50015 1.50015 0 0 0 22.5 6.5 L 22.5 22.5 L 6.5 22.5 A 1.50015 1.50015 0 1 0 6.5 25.5 L 22.5 25.5 L 22.5 41.5 A 1.50015 1.50015 0 1 0 25.5 41.5 L 25.5 25.5 L 41.5 25.5 A 1.50015 1.50015 0 1 0 41.5 22.5 L 25.5 22.5 L 25.5 6.5 A 1.50015 1.50015 0 0 0 23.976562 4.9785156 z"></path>
                    </svg>
                </button>
            </div>
            
            <span class="error-msg"></span>
        </div>
        
        <div class="price-container">
            <h4>Total:</h4>
            <p>A$<span id=price-${productNo}></span></p>
        </div>
    `
    return productFooter;
}

// Error checking for product selection/option and footer, shows error under the specified input
function checkProductSelection() {
    const productItems = getAllProducts();
    for(var i = 0; i < productItems.length; i++) {
        const item = productItems[i];
        const itemNumber = item.id.split("-")[2];
        // Check if product option is selected
        const productOptions = document.getElementById("product-options-" + itemNumber);
        const hiddenInputOptions = productOptions.querySelector("#option-" + itemNumber);
        // If no options is shown then product is not selected return false
        if (!hiddenInputOptions) {
            return false;
        }

        const errorSpan = productOptions.querySelector(".error-msg");
        // If no options is selected then show the error message
        if (!hiddenInputOptions.value) {
            showErrorMessage(errorSpan, "Please select an option.", null);
            return false;
        }

        // If options shown but no product footer (product price and quantity) then return false
        const productFooter = item.querySelector(".product-footer");
        if (!productFooter) {
            return false;
        }

        const qtyError = productFooter.querySelector(".error-msg");
        // If quantity error span is shown (error exists) return false
        if (!qtyError.hidden) {
            return false;
        }

    }

    return true;
}

/**
 * Enhancement 2
 * Timer for payment (10 mins), banner is shown for 10 mins in every page,
 * user will be able to click pay now to go to payment page, after 10 mins,
 * cancel payment
 */

// addEventListener for window load, since window.load won't work with multiple js files
window.addEventListener("load", () => {
    // Get payment start time from local storage
    const paymentTime = localStorage.paymentStartTime;
    // 10 mins duration for user to pay
    const paymentDuration = 600;

    // If payment exists then check if there is remaining time
    if (paymentTime) {
        const now = new Date().getTime();
        const timePassed = Math.floor((now - paymentTime) / 1000);
        const remainingTime = paymentDuration - timePassed;
        // If there is remaining time
        if (remainingTime > 0) {
            startCountdown(remainingTime); // Start countdown with remaining time
        }
        else {
            // Finish timer if there is no remaining time left
            timerFinished();
        }
    }
    else {
        document.getElementById("timer-banner").hidden = true;
    }
});

// Function to start the countdown
function startCountdown(duration) {
    var timer = duration, minutes, seconds;
    const timerBanner = document.getElementById("timer-banner");
    const timerText = document.getElementById("timer");
    const payBtn = document.getElementById("pay-btn");
    
    // Start an interval every second to mimick clock
    const countdownInterval = setInterval(() => {
        minutes = Math.floor(timer / 60);
        seconds = timer % 60;

        // Format minutes and seconds
        const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
        const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
        // Set timer text content
        timerText.textContent = `Time left: ${formattedMinutes}:${formattedSeconds}`;
        payBtn.hidden = false;
        timerBanner.hidden = false; 
        timerBanner.style.backgroundColor = "#007bff"
        // Decrement the timer
        if (--timer < 0) {
            // Clears itself when reaches 0
            clearInterval(countdownInterval);
            timerFinished();
        }
    }, 1000);
}

// Function called when timer is finished
function timerFinished() {
    // Initialize variables
    const timerBanner = document.getElementById("timer-banner");
    const timerText = document.getElementById("timer");
    const payBtn = document.getElementById("pay-btn");
    // Set times up content
    timerText.textContent = "Time's up! Payment failed!";
    payBtn.hidden = true;
    // Change to red when expires
    timerBanner.style.backgroundColor = "#dc3545";
    // Cancel the payment
    cancelPayment();
}

// Function that clears local storage and brings user to home page
function cancelPayment() {
    localStorage.clear();
    window.location = "index.html";
}


