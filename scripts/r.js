import {
    onAuthStateChanged,
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
  import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
  import { auth, app, db, storage } from "./firebaseAPI.js";
  import { fadeIn, fadeOut } from "../js/animations.js";
  
  const urlParams = new URLSearchParams(window.location.search);
  const recipe = urlParams.get('r')
  console.log(recipe)

  const docRef = doc(db, "recipes", recipe);
  const user = (await getDoc(docRef));
  
  console.log(user.data())
  document.getElementById("receita-name").innerHTML = user.data().name
  document.getElementById("receita-performance").innerHTML = user.data()["recipe-performance"]
  document.getElementById("receita-time-hours").innerHTML = user.data()["recipe-time-hours"]
  document.getElementById("receita-time-minutes").innerHTML = user.data()["recipe-time-minutes"]
  document.getElementById("receita-ingredients").innerHTML = user.data().ingredients
  document.getElementById("receita-method").innerHTML = user.data().method