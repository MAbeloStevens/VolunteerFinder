// Add tags

const addTagButton = document.getElementById("addTagButton")
const addTagInput = document.getElementById("addTagInput")
const tagSelection = document.getElementById("tagSelection")

addTagButton.addEventListener('click', (evt) => {
  try {
    const tagTitle = addTagInput.value.trim()
    if (tagTitle === "") {
      throw `No tag input`
    }
    const existing = document.querySelector(`[name="${tagTitle}"]`)
    if (existing) {
      throw `Option already exists`
    }
    
    const newTagElement = `<label>
      <input checked type="checkbox" name="${tagTitle}">
      ${tagTitle}
    </label>`
    tagSelection.innerHTML += newTagElement
  } catch (e) {
    alert(e)
  }


})

// Confirm Password Validation

const registrationForm = document.getElementById("registrationForm")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirmPassword")

registrationForm.addEventListener('submit', (evt) => {
 if (password.value !== confirmPassword.value) {
  alert("Passwords must match")
  evt.preventDefault()
 }
})