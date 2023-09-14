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
  document.getElementById("receita-method").innerHTML = user.data().method