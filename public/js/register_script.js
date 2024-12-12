// Add tag button
const addTagButton = document.getElementById("addTagButton")
const addTagInput = document.getElementById("addTagInput")
const tagSelection = document.getElementById("tagSelection")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

addTagButton.addEventListener('click', (evt) => {
  if (!errorDiv.hidden) {
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
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
    if (password.value !== confirmPassword.value) {
      throw `Passwords must match`
    }
    if (registrationForm.firstName.value.trim() === "") {
      throw `First Name is required`
    }
    if (registrationForm.lastName.value.trim() === "") {
      throw `Last Name is required`
    }
    if (registrationForm.password.value.trim() === "") {
      throw `Password is required`
    }
    if (registrationForm.email.value.trim() === "") {
      throw `Email is required`
    }
    if ( !/^\w+@\w+\.\w+$/.test(registrationForm.email.value.trim()) ) {
      throw `Email must be in valid format.`
    }
    
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})