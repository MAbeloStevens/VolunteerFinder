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

const createOrgForm = document.getElementById("createOrgForm")

createOrgForm.addEventListener('submit', async (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {

    await validation.checkName(createOrgForm.name.value) // Changed the validation functionality to cater to specific names
    await validation.checkDescription(createOrgForm.description.value)
    await validation.checkContact(createOrgForm.contact.value) 
    
    if (createOrgForm.link.value) {
      await validation.checkLink(createOrgForm.link.value) // Marked as option on blueprint
    }
    
    const tagSelection = document.getElementById("tagSelection")
    const selectedTags = Array.from(tagSelection.selectedOptions).map(option => option.value)
    await validation.checkTags(selectedTags) // Blueprint: Tags not optional on creation

    
    if (typeof createOrgForm.bannerImg.value === File) {
      await validation.checkImg(createOrgForm.bannerImg.value) //Banner Upload/file upload is optional.
    }

  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }
})