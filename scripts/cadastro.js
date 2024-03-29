import {onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  AuthErrorCodes
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  updateDoc,
  getDoc,
  setDoc,
  addDoc,
  doc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { auth,db } from "./firebaseAPI.js";

const emailInput = document.getElementById('email');
const nomeInput = document.getElementById('nome');
const senha1Input = document.getElementById('senha1');
const senha2Input = document.getElementById('senha2');
const cadastrarBtn = document.getElementById('cadastrar');
const cadastrarGoogle = document.getElementById('cadastrar-google');
const ErrorMSG = document.getElementById('errorMSG');

//cadastrando com email
cadastrarBtn.addEventListener('click', function() {
  event.preventDefault();

  var vali = true

  if (emailInput.value.trim() === ''||!validarEmail(emailInput.value)){
    ErrorMSG.innerHTML = 'Por favor, insira um email válido.'
    vali = false
  } else if (nomeInput.value.trim() === ''){
    ErrorMSG.innerHTML = 'Por favor, coloque seu nome.'
    vali = false
  } else if (senha1Input.value.trim() === ''||!validarSenha(senha1Input.value)){
    ErrorMSG.innerHTML = 'Por favor, insira uma senha de, pelo menos, 8 caracteres.'
    vali = false
  } else if (senha1Input.value!=senha2Input.value){
    ErrorMSG.innerHTML = 'A senha repetida não condiz com a primeira.'
    vali = false
  } else (ErrorMSG.innerHTML = ``)
  
  if (vali) {
    var email = emailInput.value
    var senha = senha2Input.value
    try {
      createUserWithEmailAndPassword(auth, email, senha).then((userCredential) => {
        const user = userCredential.user;
        userName = document.getElementById("nome").value;
        
      const docRef = doc(db, "users", user.uid);
      if (document.getElementById("nome").value != ""){
        userName = document.getElementById("nome").value;
      } else userName = user.displayName
      const data = {
        name: userName ,
        bio: 'Clique no botão de "Editar Perfil" para mudar sua bio.',
        gender: "",
        birth: "0000-00-00",
        state: "",
        city: "",
        favourite: [],
        restrictions: [],
      };
  
      setDoc(docRef, data)
        .then(() => {
          console.log("Document has been added successfully");
          console.log(data)
          window.location = "/user"
        })
        .catch((error) => {
          console.log(error);
        });
      })
      console.log(user)
    } catch(error){
      if (error.message == `user is not defined`) {
        ErrorMSG.innerHTML = `E-mail já em uso.`
      }
      console.log(error.code)
      console.log("----------------")
      console.log(error.message)
      console.log("----------------")
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
cadastrarGoogle.addEventListener('click', function() {
  console.log("aa")
  event.preventDefault();
  signInWithPopup(auth, provider).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    userName = user.displayName;
    const docRef = doc(db, "users", user.uid);
    console.log(user)
    console.log("token")
    console.log(token)
    const data = {
      name: userName ,
      bio: 'Clique no botão de "Editar Perfil" para mudar sua bio.',
      gender: "",
      birth: "0000-00-00",
      state: "",
      city: "",
      favourite: [],
      restrictions: [],
    };

    setDoc(docRef, data)
      .then(() => {
        console.log("Document has been added successfully");
        console.log(data)
        window.location = "/user"
      })
      .catch((error) => {
        console.log(error);
      });
  }).catch((error) => {
    // Handle Errors here.
    // The AuthCredential type that was used.
    //const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
    console.log(error)
  });
});

var userName;
onAuthStateChanged(auth, user=> {
  if (user != null){
      console.log(user.email);
      console.log("Logado");
      //window.location = "/user"
  } else {
      console.log("No User");
  }
})