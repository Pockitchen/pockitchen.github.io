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
  const r = (await getDoc(docRef));
  

  console.log(r.data())
  for(var i = 0; i<10;i++){
    getDownloadURL(ref(storage, `recipes/images/${r.id}/image_${i}.png`))
    .then((url) => {
      var link = String(url)
      console.log(link)
        document.getElementById("recipe-images").innerHTML += `<img onclick="showIMG('${link}')" src="${url}">`
    })
  }

  document.title = "Pockitchen - " + r.data().name
  document.getElementById("receita-name").innerHTML = r.data().name
  document.getElementById("receita-rating").innerHTML = getStars(r.data().rating) + ` -  ` + (r.data().rating) + "/5"
  document.getElementById("receita-performance").innerHTML = r.data()["recipe-performance"] + (parseInt(r.data()["recipe-performance"])>1)?" pessoas":"pessoa"
  document.getElementById("receita-time").innerHTML = getTime(r.data()["recipe-time-hours"],r.data()["recipe-time-minutes"])
  document.getElementById("receita-ingredients").innerHTML = r.data().ingredients
  document.getElementById("receita-method").innerHTML = r.data().method

  function getTime(h,m){
    h = parseInt(h)
    m = parseInt(m)
    var horas = ""
    var minutos = ""
    if(m>1){
      minutos = m + " minutos"
    } else if(m==1){
      minutos = m + " minuto"
    }

    if(h>1){
      horas = h + " horas "
    } else if(h==1){
      horas = h + " hora "
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