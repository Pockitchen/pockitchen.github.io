import {
  updateDoc,
  collection,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { auth, app, db, storage } from "./firebaseAPI.js";

document.addEventListener("DOMContentLoaded", function () {
  var hamburger = document.querySelector(".hamburger-menu");
  var sideMenu = document.querySelector(".side-menu");

  hamburger.addEventListener("click", function () {
    sideMenu.classList.toggle("active");
  });

  document.addEventListener("click", function (event) {
    var target = event.target;

    if (!target.closest(".navbar-menu") && !target.closest(".side-menu")) {
      sideMenu.classList.remove("active");
    }
  });
});

const per = collection(db, "recipes");
const colSnap = await getDocs(per);
var jog = [];
colSnap.forEach((doc) => {
  console.log(doc.data())

  getDownloadURL(ref(storage, `recipes/images/${doc.id}.png`)).then((url) => {
    var im = url;

  document.getElementById("receitas").innerHTML += `
    
  <div class="user-post" id="${doc.id}">
  <div class="recipe-header">
    <h1 style="margin-right: 10px;">${doc.data().name} • </h1>
    <h1>
      ${estrelas(doc.data().rating)}
    </h1>
  </div>
  <div class="recipe-body">
    <img src="${im}">
    <div>
      <div class="recipe-content">
      ${doc.data().description}
      <h3>Ingredientes</h3>
      ${doc.data().ingredients}
      <h3>Método de preparo</h3>
      ${doc.data().methodPreparation}
    </div>
      <div class="gradient"></div>
    </div>
  </div>
  <a class="clique">Clique aqui para ver mais</a>
</div>
  `
});
});

function estrelas(e){
  var i = 0
  var ex = ""
  for(i = 0; i<e;i++){
    ex += '<i class="fa-solid fa-star"></i>';
  }
  for(i; i<5;i++){
    ex += '<i class="fa-regular fa-star"></i>';
  }
  return ex
}