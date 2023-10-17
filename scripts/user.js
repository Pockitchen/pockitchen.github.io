import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
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
import { fadeIn, fadeOut } from "../js/animations.js";

var userid = "";

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.email);
    console.log("Logado");
    userid = user.uid;
    puxar(user.uid);

  } else {
    console.log("No User");
    window.location = "/login"
  }
});

function v(id) {
  //console.log(document.getElementById(id).value)
  return document.getElementById(id).value;
}

async function puxar(u) {
  const docRef = doc(db, "users", u);
  const user = await getDoc(docRef);
  document.getElementById("user-name").innerHTML = user.data().name;
  document.getElementById("user-bio").innerHTML = user.data().bio;
  document.getElementById("name-edit").value = user.data().name;
  document.getElementById("bio-edit").value = user.data().bio;
  if (user.data().recipes!==undefined){
    user.data().recipes.forEach(e => {
      puxarReceitasMinhas(e)
    });
  }
  if (user.data().favourites!==undefined){
  user.data().favourites.forEach(e => {
    puxarReceitasFavoritas(e)
  });
}

  getDownloadURL(ref(storage, `users/pp/${u}.png`)).then((url) => {
    // console.log(url);
    document.getElementById("profile-picture").setAttribute("src", url);
    document.getElementById("pp-edit-img").setAttribute("src", url);
  });
}

async function puxarReceitasMinhas(e){
  const recipesRef = doc(db, "recipes", e);
  const recipe = await getDoc(recipesRef);
  var r = recipe.data()
  // console.log(r)
  var link = "/images/error-capivara.png"
  getDownloadURL(ref(storage, `recipes/images/${recipe.id}/image_0.png`))
    .then((url) => {
      link = String(url)
      // console.log(link)
    })
    .catch((error) => {
    }).then(() => {
        document.getElementById("your-recipes-ordener").innerHTML +=
          `<div class="recipe-sample" onclick="location.href='/r/?r=${recipe.id}'">
            <img src="${link}">
            <div class="recipe-infos">
                <a class="recipe-time"><i class="fa-solid fa-clock"></i> ${getTime(r["recipe-time-hours"],r["recipe-time-minutes"])}</a>
                <a class="recipe-performance"><i class="fa-solid fa-user"></i> ${r["recipe-performance"]}</a>
                <a class="recipe-ratting">
                    ${getStars(r.rating)}
                </a>
            </div>
            <a class="recipe-sample-name">${r.name}</a>
          </div>`
    })
}

async function puxarReceitasFavoritas(e){
  const recipesRef = doc(db, "recipes", e);
  const recipe = await getDoc(recipesRef);
  var r = recipe.data()
  // console.log(r)
  var link = "/images/error-capivara.png"
  getDownloadURL(ref(storage, `recipes/images/${recipe.id}/image_0.png`))
    .then((url) => {
      link = String(url)
      // console.log(link)
    })
    .catch((error) => {
    }).then(() => {
      // console.log(link)
        document.getElementById("favourite-recipes-ordener").innerHTML +=
          `<div class="recipe-sample" onclick="location.href='/r/?r=${recipe.id}'">
            <img src="${link}">
            <div class="recipe-infos">
                <a class="recipe-time"><i class="fa-solid fa-clock"></i> ${getTime(r["recipe-time-hours"],r["recipe-time-minutes"])}</a>
                <a class="recipe-performance"><i class="fa-solid fa-pizza-user"></i> ${r["recipe-performance"]}</a>
                <a class="recipe-ratting">
                    ${getStars(r.rating)}
                </a>
            </div>
            <a class="recipe-sample-name">${r.name}</a>
          </div>`
    })
}

function getTime(h,m){
  h = parseInt(h)
  m = parseInt(m)
  var horas = ""
  var minutos = ""
  if(m>0){
    minutos = m + "m"
  }

  if(h>0){
    horas = h + "h "
  }
  return horas + minutos
}

function getStars(n){
  n = parseInt(n)
  var i= 0
  var r = ""
  for(i;i<n;i++){
    r += `<i class="fa-solid fa-star"></i>`
  }
  for (i;i<5;i++){
    r += `<i class="fa-regular lid fa-star"></i>`
  }
  return r
}

const edit_form = document.getElementById('edit-user-form');
document.getElementById("edit-user-btn").addEventListener("click", function(){
  fadeIn(edit_form)
})

document.getElementById("exit-form-btn").addEventListener("click", function(){
  fadeOut(edit_form)
})

document.getElementById("send-info-btn").addEventListener("click", function(){
  fadeOut(edit_form)
})

// style="display: none;" edit-user-form


const pp_change = document.getElementById("pp-change-upload")
pp_change.addEventListener("change", function(){
  console.log(pp_change.files)
  console.log("mama")
  document.getElementById("pp-edit-img").src = URL.createObjectURL(pp_change.files[0])
})

let enviar = document.getElementById("send-info-btn");
enviar.addEventListener("click", () => {

  const data = {
    name: v("name-edit"),
    bio: v("bio-edit"),
  };
  console.log(data);

  const docRef = doc(db, "users", userid);

  updateDoc(docRef, data)
    .then(() => {
      console.log("Document has been changed successfully");
    })
    .catch((error) => {
      console.log(error);
    });

  const file = document.getElementById("pp-change-upload").files[0];
  const metadata = {
    contentType: "picture",
  };
  const storageRef = ref(storage, `users/pp/` + userid + "." + "png");
  
  if (file!==undefined){
    const task = uploadBytesResumable(storageRef, file, metadata)
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .then((url) => {
      console.log(url);
      document.getElementById("edit-user-success").style.display = "block"
      //window.location = "../user";
    })
    .catch(console.error);
  } else {document.getElementById("edit-user-success").style.display = "block"}
});