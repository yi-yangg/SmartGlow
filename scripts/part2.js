/**
 * Author: Chong Yi Yang
 * Target:
 * Purpose:
 * Created:
 * Last updated:
 * Credits: 
 */

"use strict"

function showErrorMessage(errorSpan, errorMsg, errorInput) {
    errorSpan.textContent = errorMsg;
    errorSpan.hidden = false;
    if (errorInput)
        errorInput.style.borderColor = "red";
}

function hideErrorMessage(errorSpan, errorInput) {
    errorSpan.textContent = "";
    errorSpan.hidden = true;
    if (errorInput)
        errorInput.style.borderColor = "";
}

function checkErrorSpan() {
    // Get all error spans and check if they are shown
    const getAllErrorSpan = document.getElementsByClassName("error-msg");

    for (var i = 0; i < getAllErrorSpan.length; i++) {
        const errorSpan = getAllErrorSpan[i];
        // if error span is shown means there is an error return false don't allow form to be submitted
        if (!errorSpan.hidden) {
            // Get parent div of error span and scroll to the div
            document.getElementById(errorSpan.parentElement.id).scrollIntoView({ behavior: "smooth" });
            showToast("Please ensure the input meets the required format.");
            return false;
        }
    } 
    return true;
}


// Global toast timeout variable
var toastTimeout;
function showToast(content) {
    // Get toast container
    const toast = document.getElementById("toast-container");
    // If toast already shown the dont show again
    if (toast.classList.contains("show"))
        closeToast();
    
    const toastSpan = document.getElementById("toast-span");
    toastSpan.textContent = content;
    toast.classList.add("show");
    toast.classList.remove("hide")

    // Set timeout to hide after 2 seconds
    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
    }, 2000);
    
}

function closeToast() {
    // If timeout variable exists then clear timeout
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    // Hide the toast
    const toast = document.getElementById("toast-container");
    toast.classList.remove("show");
    toast.classList.add("hide");
}