const searchForm = document.getElementById("searchForm")

searchForm.addEventListener('submit', (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
    if (typeof searchForm.searchTxt.value !== 'string') {
      throw `Search Text must be a string`
    }
    

  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})