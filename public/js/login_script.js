import validation from '/validation';

const loginForm = document.getElementById("loginForm")
const errorDiv = document.getElementById("errorDiv")
const errorMessage = document.getElementById("errorMessage")

loginForm.addEventListener('submit', async (evt) => {
  if (!errorDiv.hidden) {
    errorDiv.hidden = true;
  }

  try {
    await validation.checkEmail(loginForm.email.value)
    await validation.checkPassword(loginForm.password.value)
  } catch (e) {
    errorDiv.hidden = false;
    errorMessage.innerText = e;
    evt.preventDefault()
  }
})