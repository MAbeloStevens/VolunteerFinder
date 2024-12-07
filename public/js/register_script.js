import { validation } from '/helpers/validation.js';

// Add tag button
const addTagButton = document.getElementById("addTagButton")
const addTagInput = document.getElementById("addTagInput")
const tagSelection = document.getElementById("tagSelection")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

addTagButton.addEventListener('click', (evt) => {
  if(!errorDiv.hidden) {
    errorDiv.hidden = true;
  }
  try {
    const tagTitle = addTagInput.value.trim();
    if (tagTitle === "") {
      throw `No tag input`
    }
    const existing = document.querySelector(`[value="${tagTitle}"]`)
    if (existing) {
      throw `Tag option already exists`
    }
    
    let newTagElement = document.createElement('option')
    newTagElement.value = `${tagTitle}`
    newTagElement.innerText = tagTitle
    tagSelection.appendChild(newTagElement)

  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = `Input Error: ${e}`;
  }
})

// Confirm Password Validation

const registrationForm = document.getElementById("registrationForm")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirmPassword")

registrationForm.addEventListener('submit', (evt) => {
  if(!errorDiv.hidden) {
    errorDiv.hidden = true;
  }
  if (password.value !== confirmPassword.value) {
    errorDiv.hidden = false;
    errorMessage.innerText = "Input Error Passwords must match";
    evt.preventDefault()
  }
})