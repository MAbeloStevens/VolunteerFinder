import validation from '/validation';

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

registrationForm.addEventListener('submit', async (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {

    await validation.checkName(registrationForm.firstName.value, 'first name')
    await validation.checkName(registrationForm.lastName.value, 'first name')

    const pass = await validation.checkPassword(password.value)
    const confirmPass = await validation.checkPassword(confirmPassword.value)
    if (pass !== confirmPass) {
      throw `Passwords do not match`
    }

    await validation.checkEmail(registrationForm.email.value)
    if (registrationForm.phoneNumber.value) {
      await validation.checkPhone(registrationForm.phoneNumber.value) // Not marked as optional, however in a previous talk i think we mentioned this being optional on sign up
    } 
    
    const tagSelection = document.getElementById("tagSelection")
    const selectedTags = Array.from(tagSelection.selectedOptions).map(option => option.value)

    if (selectedTags.length) {
      await validation.checkTags(selectedTags) // Marked as optional on Blueprint
    }

  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }
})