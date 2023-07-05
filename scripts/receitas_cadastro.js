import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { app, auth, db } from "./firebaseAPI.js";



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
  var text = txt.split(",").filter(word => word.trim().length > 0);
  return text
}

/*
const data = {
  name: "Ovo Frito",
  description: "Um ovo fritado",
  recipePhoto: "foto",
  ingredients: ["ovo","óleo"],
  methodPreparation: "Coloque uma frigideira no fogo médio. Coloque óleo na frigideira. Coloque seu ovinho no óleo. Espere até ficar tudo branco.",
  preparationTime: "3m",
  stamp: ["Fitness"],
  culinaryTools: ["Frigideira"],
  performance: 1,
  unitMeasurement: "Fatia"
};

const docRef = collection(db, "recipes");
addDoc(docRef, data)
.then(() => {
    console.log("Document has been added successfull");
})
.catch(error => {
    console.log(error);
})*/

function valor(id){
  //console.log(document.getElementById(id).value)
  return document.getElementById(id).value;
}

let enviar = document.getElementById("cadastrar")
enviar.addEventListener("click",() => {

  console.log("click")
  
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
    "unitMeasurement": valor("rendimento")
  };
  console.log(data)
  
  const docRef = collection(db, "recipes");
  addDoc(docRef, data)
  .then(() => {
      console.log("Document has been added successfull");
  })
  .catch(error => {
      console.log(error);
  })

})