//import { userE } from "./firebaseAPI.js"
import {onAuthStateChanged,
        signOut,
        signInWithEmailAndPassword,
        GoogleAuthProvider,
        signInWithPopup,
        sendPasswordResetEmail,
        AuthErrorCodes
      } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { auth } from "./firebaseAPI.js";

// Seleciona os elementos do DOM
const forgotPasswordBtn = document.getElementById('forgot-password-btn');
const forgotPasswordDialog = document.getElementById('forgot-password-dialog');
const enviarRedefinicao = document.getElementById('enviarEmailRedefinicaoSenha');
const closeDialogBtn = document.getElementById('close-dialog-btn');//google
const emailInput = document.getElementById("emailLoginInput");
const senhaInput = document.getElementById("passwordLoginInput");
const googleLogin = document.getElementById("google");
const senhaErrorWarn = document.getElementById("inputError");
const entrarButton = document.getElementById('entrar');
// Exibe o diálogo quando o botão de esqueci minha senha é clicado
forgotPasswordBtn.addEventListener('click', function() {
  event.preventDefault();
  forgotPasswordDialog.style.display = 'block';
});

enviarRedefinicao.addEventListener('click', function() {
  event.preventDefault();
  var email = document.getElementById('EmailRedefinicaoSenha').value
  sendPasswordResetEmail(auth, email).then(() => {
    alert(`Foi enviada um email para o endereço ${email} para redefinir sua senha. Confira na caixa de entrada principal, social e span.`)
      forgotPasswordDialog.style.display = 'none';
  }).catch(error => {
    const errorOut = document.getElementById('senhaRedefinicaoErro')
    console.log(error)
    console.log('Mensagem: ' + error.message)
    if (error.message == `Firebase: Error (auth/user-not-found).`) {
      errorOut.innerHTML = `Email não reconhecido. <a href="cadastro.html">Cadastre-se</a>`
    } else if (error.message == `Firebase: Error (auth/missing-email).`) {
      errorOut.innerHTML = `Insira o email no campo acima.`
    } else if (error.message == `Firebase: Error (auth/invalid-email).`) {
      errorOut.innerHTML = `O email inserido parece ser inválido. Tente novamente`
    }
  })
});

// Esconde o diálogo quando o botão de fechar é clicado
closeDialogBtn.addEventListener('click', function() {
  event.preventDefault();
  forgotPasswordDialog.style.display = 'none';
});

entrarButton.addEventListener('click', async function(evento) {
  event.preventDefault();
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

//cadastrando com google
const provider = new GoogleAuthProvider();
googleLogin.addEventListener('click', function() {
  console.log("aa")
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

function errei(email){
  sendPasswordResetEmail(email).then(oi => {
    console.log(oi)
  })
  console.log(sendEmail.user)
}


onAuthStateChanged(auth, user=> {
  if (user != null){
      console.log(user.email);
      console.log("Logado");
      window.location = "entrada"
  } else {
      console.log("No User");
  }
})