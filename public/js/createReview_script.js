import validation from '/validation';

const reviewForm = document.getElementById("reviewForm")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

reviewForm.addEventListener('submit', async (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
    await validation.checkReview(reviewForm.review.value)
    await validation.validRating(+reviewForm.rating.value)
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})
