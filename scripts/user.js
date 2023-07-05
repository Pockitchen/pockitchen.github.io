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

var userid = "";

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.email);
    console.log("Logado");
    userid = user.uid;
    puxar(user.uid);

  } else {
    console.log("No User");
  }
});

function v(id) {
  //console.log(document.getElementById(id).value)
  return document.getElementById(id).value;
}

async function puxar(u) {
  const docRef = doc(db, "users", u);
  const user = await getDoc(docRef);
  document.getElementById("user").innerHTML = user.data().name;
  document.getElementById("bio").innerHTML = user.data().bio;
  document.getElementById("name-edit").value = user.data().name;
  document.getElementById("bio-edit").value = user.data().bio;

  getDownloadURL(ref(storage, `users/pp/${u}.png`)).then((url) => {
    console.log(url);
    document.getElementById("pp-image").setAttribute("src", url);
    document.getElementById("user-photo").setAttribute("src", url);
  });
}

let enviar = document.getElementById("send-edit");
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



  const file = document.getElementById("photo").files[0];
  const metadata = {
    contentType: "picture",
  };
  const storageRef = ref(storage, `users/pp/` + userid + "." + "png");
  console.log(file);

  const task = uploadBytesResumable(storageRef, file, metadata)
    .then((snapshot) => getDownloadURL(snapshot.ref))
    .then((url) => {
      console.log(url);
      alert("Usuário modificado com sucesso");
      location.reload()
      //window.location = "../user";
    })
    .catch(console.error);
});

