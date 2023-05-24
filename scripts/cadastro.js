import {onAuthStateChanged,
  createUserWithEmailAndPassword,
  AuthErrorCodes
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { auth } from "./firebaseAPI.js";

const emailInput = document.getElementById('email');
const nomeInput = document.getElementById('nome');
const senha1Input = document.getElementById('senha1');
const senha2Input = document.getElementById('senha2');
const cadastrarBtn = document.getElementById('entrar');
const emailError = document.getElementById('email-error');
const nomeError = document.getElementById('nome-error');
const senha1Error = document.getElementById('senha1-error');
const senha2Error = document.getElementById('senha2-error');

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

onAuthStateChanged(auth, user=> {
  if (user != null){
      console.log(user.email);
      console.log("Logado");
      window.location = "entrada.html"
  } else {
      console.log("No User");
  }
})