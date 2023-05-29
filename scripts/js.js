//import { userE } from "./firebaseAPI.js"
import {onAuthStateChanged,
        signOut,
        signInWithEmailAndPassword,
        AuthErrorCodes,
        sendPasswordResetEmail
      } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { auth } from "./firebaseAPI.js";

// Seleciona os elementos do DOM
const forgotPasswordBtn = document.querySelector('#forgot-password-btn');
const forgotPasswordDialog = document.querySelector('#forgot-password-dialog');
const closeDialogBtn = document.querySelector('#close-dialog-btn');
const emailInput = document.getElementById("emailLoginInput");
const senhaInput = document.getElementById("passwordLoginInput");
const senhaErrorWarn = document.getElementById("senha-error");
const entrarButton = document.getElementById('entrar');
// Exibe o diálogo quando o botão de esqueci minha senha é clicado
forgotPasswordBtn.addEventListener('click', function() {
  forgotPasswordDialog.style.display = 'block';
});

// Esconde o diálogo quando o botão de fechar é clicado
closeDialogBtn.addEventListener('click', function() {
  forgotPasswordDialog.style.display = 'none';
});

entrarButton.addEventListener('click', async function(evento) {
  //função de verificar login

  const email = emailInput.value
  const senha = senhaInput.value

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha)
    console.log(userCredential.user)
  } catch(error){
    console.log(error);
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
      senhaErrorWarn.innerHTML = `Senha errada. Tente novamente.`
    }
    else {
      senhaErrorWarn.innerHTML = `Error: ${error.message}`      
    }
  }
});


onAuthStateChanged(auth, user=> {
  if (user != null){
      console.log(user.email);
      console.log("Logado");
      window.location = "entrada"
  } else {
      console.log("No User");
  }
})