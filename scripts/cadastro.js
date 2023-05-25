import {onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthErrorCodes
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { auth } from "./firebaseAPI.js";

const emailInput = document.getElementById('email');
const nomeInput = document.getElementById('nome');
const senha1Input = document.getElementById('senha1');
const senha2Input = document.getElementById('senha2');
const cadastrarBtn = document.getElementById('entrar');
const cadastrarGoogle = document.getElementById('google');
const emailError = document.getElementById('email-error');
const nomeError = document.getElementById('nome-error');
const senha1Error = document.getElementById('senha1-error');
const senha2Error = document.getElementById('senha2-error');

//cadastrando com email
cadastrarBtn.addEventListener('click', function() {
  event.preventDefault();

  var vali = true

  if (emailInput.value.trim() === ''||!validarEmail(emailInput.value)){
    emailError.innerHTML = 'Por favor, insira um email válido.'
    vali = false
  } else (emailError.innerHTML = ``)

  if (nomeInput.value.trim() === ''){
    nomeError.innerHTML = 'Por favor, coloque seu nome.'
    vali = false
  } else (nomeError.innerHTML = ``)

  if (senha1Input.value.trim() === ''||!validarSenha(senha1Input.value)){
    senha1Error.innerHTML = 'Por favor, insira uma senha de, pelo menos, 8 caracteres.'
    vali = false
  } else (senha1Error.innerHTML = ``)

  if (senha1Input.value!=senha2Input.value){
    senha2Error.innerHTML = 'A senha repetida não condiz com a primeira.'
    vali = false
  } else (senha2Error.innerHTML = ``)
  
  if (vali) {
    var email = emailInput.value
    var senha = senha2Input.value
    try {
      createUserWithEmailAndPassword(auth, email, senha).then((userCredential) => {
        const user = userCredential.user;
      })
      console.log(user)
    } catch(error){
      console.log(error);
      console.log(error.message)
    }
  }

});

function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validarSenha(senha) {
  return senha.length >= 8;
}

//cadastrando com google
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
cadastrarGoogle.addEventListener('click', function() {
  event.preventDefault();
  signInWithPopup(auth, provider).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log(user)
    console.log("token")
    console.log(token)
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    // The AuthCredential type that was used.
    //const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.log(error)
  });


});

onAuthStateChanged(auth, user=> {
  if (user != null){
      console.log(user.email);
      console.log("Logado");
      window.location = "entrada.html"
  } else {
      console.log("No User");
  }
})