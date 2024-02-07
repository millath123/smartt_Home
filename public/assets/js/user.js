
// signup form validation
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


// login form validation
function validateLoginForm() {
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    var isValid = true;

    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email.match(emailRegex)) {
      document.getElementById('emailError').textContent = 'Invalid email format';
      isValid = false;
    }

    if (email.trim() === '') {
      document.getElementById('emailError').textContent = 'Email is required';
      isValid = false;
    }

    if (password.trim() === '') {
      document.getElementById('passwordError').textContent = 'Password is required';
      isValid = false;
    }
    return isValid;
  }



 const firebaseConfig = {
    apiKey: "AIzaSyB1XUK9gm4GGNLE6tZK6-dcBYc199K6FEQ",
    authDomain: "smarthome-84377.firebaseapp.com",
    projectId: "smarthome-84377",
    storageBucket: "smarthome-84377.appspot.com",
    messagingSenderId: "871087542048",
    appId: "1:871087542048:web:5f284129986567f4d1d145",
    measurementId: "G-364WB53VG1"
};
firebase.initializeApp(firebaseConfig);

render();
function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render();
}

// function for send OTP
function phoneAuth() {
    var number = document.getElementById('number').value;
    firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier).then(function (confirmationResult) {
        window.confirmationResult = confirmationResult;
        coderesult = confirmationResult;

        document.getElementsByClassName('sender')[0].style.display = 'block';
        document.getElementsByClassName('verifier')[0].style.display = 'none';

    }).catch(function (error) {
        // error in sending OTP
        alert(error.message);
    });
}


// function for OTP verify
function codeverify() {
    var code = document.getElementById('verificationcode').value;
    coderesult.confirm(code).then(function () {
        window.location.href = '/';
    }).catch(function () {
        console.error('Verification failed:', error);
    })
}