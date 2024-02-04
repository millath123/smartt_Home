
function validateEmail() {

  document.getElementById('emailError').textContent = '';
  var email = document.getElementById('email').value;
  var isValid = true;

  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!email.match(emailRegex)) {
    document.getElementById('emailError').textContent = 'Invalid email format';
    isValid = false;
  }
  return isValid;
}

