import validation from '/validation';

const loginForm = document.getElementById("loginForm")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

loginForm.addEventListener('submit', (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
  
    if (loginForm.password.value.trim() === "") {
      throw `Password is required`
    }
    if (loginForm.email.value.trim() === "") {
      throw `Email is required`
    }
    if ( !/^\w+@\w+\.\w+$/.test(loginForm.email.value.trim()) ) {
      throw `Email must be in valid format.`
    }
    
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }

})