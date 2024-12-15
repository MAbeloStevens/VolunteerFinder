import validation from '/validation';

const addTagButton = document.getElementById("addTagButton");
const addTagInput = document.getElementById("addTagInput");
const tagSelection = document.getElementById("tagSelection");
const errorDiv = document.getElementById("errorDiv");
const errorMessage = document.getElementById("errorMessage");

addTagButton.addEventListener('click', (evt) => {
  if(!errorDiv.hidden) {
    errorDiv.hidden = true;
  }
  try {
    const tagTitle = addTagInput.value.trim();
    if (tagTitle === "") {
      throw `No tag input`;
    }
    const existing = document.querySelector(`[value="${tagTitle}"]`);
    if (existing) {
      throw `Tag option already exists`;
    }
    
    let newTagElement = document.createElement('option');
    newTagElement.value = `${tagTitle}`;
    newTagElement.innerText = tagTitle;
    tagSelection.appendChild(newTagElement);

  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = `Input Error: ${e}`;
  }
});


// Validation

const registrationForm = document.getElementById("registrationForm")

registrationForm.addEventListener('submit', async (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
    await validation.checkName(registrationForm.firstName.value, 'first name')
    await validation.checkName(registrationForm.lastName.value, 'last name')
    await validation.checkPhone(registrationForm.phone.value) // Required

    const tagSelection = document.getElementById("tagSelection")
    const selectedTags = Array.from(tagSelection.selectedOptions).map(option => option.value)
    await validation.checkTags(selectedTags) // Required
    
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})