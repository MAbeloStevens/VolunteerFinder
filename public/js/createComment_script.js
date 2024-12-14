const commentForm = document.getElementById("commentForm")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

commentForm.addEventListener('submit', (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
  
    if (commentForm.comment.value.trim() === "") {
      throw `Comment is required`
    }
    
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})