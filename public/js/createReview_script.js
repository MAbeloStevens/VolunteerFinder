const reviewForm = document.getElementById("reviewForm")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

reviewForm.addEventListener('submit', (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
  
    if (reviewForm.review.value.trim() === "") {
      throw `Review is required`
    }
    if (reviewForm.rating.value.trim() === "") {
      throw `Rating is required`
    }
    
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})
