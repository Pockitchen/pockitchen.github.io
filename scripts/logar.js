//import { userE } from "./firebaseAPI.js"
import {onAuthStateChanged,
        signOut,
        signInWithEmailAndPassword,
        AuthErrorCodes
      } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { auth } from "./firebaseAPI.js";

// Seleciona os elementos do DOM
const forgotPasswordBtn = document.querySelector('#forgot-password-btn');
const forgotPasswordDialog = document.querySelector('#forgot-password-dialog');
const closeDialogBtn = document.querySelector('#close-dialog-btn');
const emailInput = document.getElementById("emailLoginInput");
const senhaInput = document.getElementById("passwordLoginInput");
const senhaErrorWarn = document.getElementById("inputError");
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
    console.log(error.message)
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
      senhaErrorWarn.innerHTML = `Senha errada. Tente novamente.`
    } else if (error.code == AuthErrorCodes.INVALID_EMAIL) {
      senhaErrorWarn.innerHTML = `Email não reconhecido.`
    } else if (error.message == `Firebase: Error (auth/user-not-found).`) {
      senhaErrorWarn.innerHTML = `Usuário não reconhecido. <a href="cadastro.html">Cadastre-se</a>`
    } else if (error.message == `Firebase: Error (auth/missing-password).`) {
      senhaErrorWarn.innerHTML = `Insira a senha.`
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
      window.location = "entrada.html"
  } else {
      console.log("No User");
  }
})