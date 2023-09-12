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

  getDownloadURL(ref(storage, `users/pp/${u}.png`)).then((url) => {
    console.log(url);
    document.getElementById("profile-picture").setAttribute("src", url);
    document.getElementById("pp-edit-img").setAttribute("src", url);
  });
}

const edit_form = document.getElementById('edit-user-form');
document.getElementById("edit-user-btn").addEventListener("click", function(){
  console.log("aaa")
  fadeIn(edit_form)
})

document.getElementById("exit-form-btn").addEventListener("click", function(){
  fadeOut(edit_form)
})

// style="display: none;" edit-user-form

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