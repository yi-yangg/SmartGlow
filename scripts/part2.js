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
    errorInput.style.borderColor = "red";
}

function hideErrorMessage(errorSpan, errorInput) {
    errorSpan.hidden = true;
    errorInput.style.borderColor = "";
}