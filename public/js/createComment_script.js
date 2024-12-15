import validation from '/validation';

const commentForm = document.getElementById("commentForm")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

commentForm.addEventListener('submit', async (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
    await validation.checkComment(commentForm.comment.value)
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})