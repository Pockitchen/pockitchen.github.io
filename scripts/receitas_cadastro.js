import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { app, auth, db, storage } from "./firebaseAPI.js";



document.addEventListener('DOMContentLoaded', function() {
    var hamburger = document.querySelector('.hamburger-menu');
    var sideMenu = document.querySelector('.side-menu');
    
    hamburger.addEventListener('click', function() {
      sideMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function(event) {
      var target = event.target;
      
      if (!target.closest('.navbar-menu') && !target.closest('.side-menu')) {
        sideMenu.classList.remove('active');
      }
    });
  });

function separateComma(txt){
  if (txt.includes(",")){
    var text = txt.split(",").filter(word => word.trim().length > 0);
  } else {
    var text = [txt]
  }
  return text
}

function valor(id){
  //console.log(document.getElementById(id).value)
  return document.getElementById(id).value;
}

let enviar = document.getElementById("cadastrar")
enviar.addEventListener("click",() => {

  //console.log("click")
  
  const data = {
    "name": valor("nome-receita"),
    "description": valor("descricao"),
    "recipePhoto": 0,
    "ingredients": separateComma(valor("ingredientes")),
    "methodPreparation": valor("modo-preparo"),
    "preparationTime": valor("tempo-preparo"),
    "stamp": ["Fitness"],
    "culinaryTools": separateComma(valor("itens-utilizados")),
    "performance": valor("quantidade"),
    "unitMeasurement": valor("rendimento"),
    "rating": 0
  };
  console.log(data)
  console.log(valor("tempo-preparo").trim().length)

  const alerta = document.getElementById("alerta")
  if (valor("nome-receita").trim().length <= 0){
    alerta.innerHTML = "Por favor, insira um <span class='bold'>nome válido</span> para a receita."
  } else if (valor("ingredientes").length <= 0){
    alerta.innerHTML = "Por favor, insira os <span class='bold'>ingredientes</span> da receita."
  } else if (valor("modo-preparo").trim().length <= 0){
    alerta.innerHTML = "Por favor, insira o <span class='bold'>modo de preparo</span> da receita."
  } else if (valor("file-input").trim().length <= 0) {
    alerta.innerHTML ="Por favor, envie uma <span class='bold'>foto</span> para usar de perfil.";
  } else if (valor("tempo-preparo").trim().length <= 0){
    alerta.innerHTML = "Por favor, insira o <span class='bold'>tempo de preparo</span> da receita."
  } else if (valor("quantidade") <= 0||valor("rendimento").trim().length <= 0){
    alerta.innerHTML = "Por favor, insira o <span class='bold'>rendimento</span> da receita."
  } else {

    const docRef = collection(db, "recipes");
    addDoc(docRef, data)
    .then((doc) => {
      console.log(doc.id)
      const file = document.getElementById("file-input").files[0];
      const storageRef = ref(storage, `recipes/images/`+ doc.id +"."+ "png");
      console.log(file)
      
      const task = uploadBytesResumable(storageRef,file)
      .then(snapshot => getDownloadURL(snapshot.ref))
      .then(url => {
        console.log(url);
        alert("A receita foi adicionada com sucesso!")
            window.location = "../";
       })
       .catch(console.error);

    })
    .catch(error => {
        console.log(error);
    })
    
  } 
})

onAuthStateChanged(auth, user=> {
  if (user != null){
      console.log(user.email);
      console.log("Logado");
  } else {
      console.log("No User");
      const container = document.getElementById("container")
      container.innerHTML = `
      <a>Você precisa estar <span class="bold">logado</span> para poder enviar uma receita em nosso site.</a>
      <br><br><br>
      <a class="botao" href="../login">Clique aqui para fazer login</a>
      `
  }
})
