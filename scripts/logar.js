//import { userE } from "./firebaseAPI.js"
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  AuthErrorCodes
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { auth, app, db } from "./firebaseAPI.js";
import { fadeIn, fadeOut } from "../js/animations.js";

// Seleciona os elementos do DOM
const forgotPasswordBtn = document.getElementById('forgot-password');
const forgotPasswordDialog = document.getElementById('send-email');
const enviarRedefinicao = document.getElementById('enviarEmailRedefinicaoSenha');
const closeDialogBtn = document.getElementById('close-dialog-btn');//google
const emailInput = document.getElementById("emailLoginInput");
const senhaInput = document.getElementById("passwordLoginInput");
const googleLogin = document.getElementById("logar-google");
const senhaErrorWarn = document.getElementById("inputError");
const entrarButton = document.getElementById('logar');
// Exibe o diálogo quando o botão de esqueci minha senha é clicado
forgotPasswordBtn.addEventListener('click', function() {
  event.preventDefault();
  fadeIn(forgotPasswordDialog, 5)
});

enviarRedefinicao.addEventListener('click', function() {
  event.preventDefault();
  var email = document.getElementById('EmailRedefinicaoSenha').value
  sendPasswordResetEmail(auth, email).then(() => {
    alert(`Foi enviado um email para o endereço ${email} para redefinir sua senha. Confira na caixa de entrada principal, social e span.`)
      fadeOut(forgotPasswordDialog, 5)
  }).catch(error => {
    const errorOut = document.getElementById('senhaRedefinicaoErro')
    console.log(error)
    console.log('Mensagem: ' + error.message)
    if (error.message == `Firebase: Error (auth/user-not-found).`) {
      errorOut.innerHTML = `Email não reconhecido. <a href="cadastro">Cadastre-se</a>`
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
  fadeOut(forgotPasswordDialog, 5)
});

entrarButton.addEventListener('click', async function(evento) {
  console.log("cc")
  event.preventDefault();
  //função de verificar login

  const email = emailInput.value
  const senha = senhaInput.value

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha).then(()=>{

    })
    var user = userCredential.user

    console.log(userCredential.user)
  } catch(error){
    console.log(error);
    console.log(error.message)
    if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
      senhaErrorWarn.innerHTML = `Senha errada. Tente novamente.`
    } else if (error.code == AuthErrorCodes.INVALID_EMAIL) {
      senhaErrorWarn.innerHTML = `Email não reconhecido.`
    } else if (error.message == `Firebase: Error (auth/user-not-found).`) {
      senhaErrorWarn.innerHTML = `Usuário não reconhecido. <a href="cadastro">Cadastre-se</a>`
    } else if (error.message == `Firebase: Error (auth/missing-password).`) {
      senhaErrorWarn.innerHTML = `Insira a senha.`
    }
    else {
      senhaErrorWarn.innerHTML = `Error: ${error.message}`      
    }
  }
});

const colRef = collection(db, "users");
const colSnap = await getDocs(colRef);
var jog = [];
colSnap.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id)
  jog.push(doc.id);
});

//cadastrando com google
const provider = new GoogleAuthProvider();
googleLogin.addEventListener('click', function() {
  console.log("aa")
  event.preventDefault();
  signInWithPopup(auth, provider).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);

    console.log(user.uid)
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
      window.location = "/user"
  } else {
      console.log("No User");
  }
})
