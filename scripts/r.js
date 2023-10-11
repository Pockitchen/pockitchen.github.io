

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
      //console.log(link)
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


//comment
var userid=""
var userName = ""
var userPPLink = ""

async function getUserName(i){
  const docRef = doc(db, "users", i);
  const user = await getDoc(docRef);
  userName = (user.data().name)
  getDownloadURL(ref(storage, `users/pp/` + i + ".png"))
    .then((url) => {
      var link = String(url)
      //console.log(link)
      userPPLink = link
    })
}
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.email);
    console.log("Logado");
    userid = user.uid;
    showUserInfoComment(user.uid)
    getUserName(user.uid)
    showFavourites(r.data(),user.uid)
  } else {
    console.log("No User");
    showFavourites(r.data(),"")
    console.log(userid==="")
    var oasjdcnbaosdc = true
    document.getElementById("comment-area").addEventListener("mouseover", function(){
      if (oasjdcnbaosdc){
        oasjdcnbaosdc = false
        const ele = document.getElementById("comment-area")
        const tam = ele.offsetHeight - 20
        ele.classList.add("unlogged-comment")
        ele.innerHTML = `<a>Você precisa estar logado para avaliar esta receita.</a><a onclick="location.href='/login'" class="button h-pointer">Ir para a página de Login</a>`
        ele.style.height = tam + "px"
      }
    })
  }
});

var rating_stars = document.querySelectorAll(".rating-star")
var selected_rating = 0
rating_stars.forEach((e,i) =>{
  i = i+1
  e.addEventListener("mouseover", function(){
    //console.log(e.id)
    for(var j =0; j<i;j++){
      document.getElementById("rating-star-"+(j+1)).classList.remove("fa-regular")
      document.getElementById("rating-star-"+(j+1)).classList.add("fa-solid")
    }
  })
  e.addEventListener("click", function(){
    selected_rating = parseInt(e.id.replace("rating-star-",""))
    for(var j =0; j<5;j++){
      document.getElementById("rating-star-"+(j+1)).classList.remove("fa-solid")
      document.getElementById("rating-star-"+(j+1)).classList.add("fa-regular")
    }
    if (selected_rating != 0) {
      for(var j =0; j<selected_rating;j++){
        document.getElementById("rating-star-"+(j+1)).classList.remove("fa-regular")
        document.getElementById("rating-star-"+(j+1)).classList.add("fa-solid")
      }
    }
    //console.log(selected_rating)
  })
  document.getElementById("change-comment-rating").addEventListener("mouseout", function(){
    //console.log(e.id)
    for(var j =0; j<5;j++){
      document.getElementById("rating-star-"+(j+1)).classList.remove("fa-solid")
      document.getElementById("rating-star-"+(j+1)).classList.add("fa-regular")
    }
    if (selected_rating != 0) {
      for(var j =0; j<selected_rating;j++){
        document.getElementById("rating-star-"+(j+1)).classList.remove("fa-regular")
        document.getElementById("rating-star-"+(j+1)).classList.add("fa-solid")
      }
    }
  })
})

document.getElementById("send-comment-button").addEventListener("click",()=>{
  var cmnt = document.getElementById("comment-input").value
  const data = {
    userName: userName,
    userPPLink: userPPLink,
    rating: selected_rating,
    comment: (cmnt.trim().length !== 0)?cmnt:null
  }
  const commentRef = doc(db, "recipes/"+recipe+"/comments", userid);
  setDoc(commentRef, data)
        .then(() => {
          //console.log(data)
          updateRating(recipe)
          const ele = document.getElementById("comment-area")
          const tam = ele.offsetHeight - 20
          ele.classList.add("unlogged-comment")
          ele.innerHTML = `<a>Sua avaliação foi registrada!</a>`
          ele.style.height = tam + "px"
        })
        .catch((error) => {
          console.log(error);
        });
})

const cmntRef = collection(db, "recipes/"+recipe+"/comments");
  const cmntSnap = await getDocs(cmntRef);
  var total = 0
  var cRating = 0
  cmntSnap.forEach(doc => {
    var c = doc.data()
    document.getElementById("comments-section").innerHTML +=`
    <hr>
    <div class="comment">
        <div>
            <img src="${(c.userPPLink!=="")?c.userPPLink:'/images/profile-picture-padrao.png'}">
        </div>
        <div>
            <a>${c.userName} - </a>
            <a class="comment-stars">${getStars(c.rating)}</a>
            <p>${c.comment}</p>
        </div>
    </div>`
  })

async function updateRating(recipe){
  const collectionRef = collection(db, "recipes/"+recipe+"/comments");
  const docsSnap = await getDocs(collectionRef);
  var total = 0
  var cRating = 0
  docsSnap.forEach(doc => {
    //console.log(doc.data());
    cRating +=doc.data().rating
    total++
  })
  const data = {
    rating: cRating/total
  };
  //console.log(data)
  const recipeRef = doc(db, "recipes", recipe);
  updateDoc(recipeRef, data)
    .then(() => {
    })
    .catch((error) => {
      console.log(error);
    });
}
async function showUserInfoComment(i){
  const docRef = doc(db, "users", i);
  const user = await getDoc(docRef);
  //console.log(user.data().name)
  document.getElementById("comment-user-name").innerHTML= user.data().name
  getDownloadURL(ref(storage, `users/pp/` + i + ".png"))
  .then((url) => {
    var link = String(url)
    //console.log(link)
      document.getElementById("comment-user-img").src = link
  })
}

//curtida

function showFavourites(recipe,u){
  console.log(recipe.favourites)
  console.log(u)
  var re = recipe.favourites
  console.log(u)
  if (re!==undefined){
      document.getElementById("favourite-count").innerHTML = re.length
      if (re.includes(u)){
        console.log("rem")
        document.getElementById("favourite-button-heart").classList.remove("fa-regular")
        document.getElementById("favourite-button-heart").classList.add("fa-solid")
      }
  } else {document.getElementById("favourite-count").innerHTML = 0}
}

document.getElementById("favourite-button").addEventListener("click",updateFavourite)

async function updateFavourite(){
  if (userid!==""){
  const recipeRef = doc(db, "recipes", recipe);
  const recipeSnap = await getDoc(recipeRef);
  var re = recipeSnap.data().favourites
  if (re==undefined){
    console.log("unde")
        var re = []
      }
      if (re.includes(userid)){
        console.log("tem")
        re=re.filter((e)=>{return e!==userid})
        console.log(re.filter((e)=>{return e!==userid}))
    } else {
      console.log("nao tem")
      re.push(userid)
    }
    var data = {
        favourites: re
      }
      console.log(data)
      updateDoc(recipeRef, data)
    .then(recipeRef => {
      updateUserFavourites()
    })
    .catch(error => {
    })
  } else {
    alert("Você precisa estar logado para curtir.")
  }
}

async function updateUserFavourites(){
  const userRef = doc(db, "users", userid);
    const userSnap = await getDoc(userRef);
    var re = userSnap.data().favourites
    console.log(userSnap.data())
    if (re==undefined){
        var re = []
    }
    if (re.includes(recipe)){
      console.log("tem")
      re=re.filter((e)=>{return e!==recipe})
      console.log(re.filter((e)=>{return e!==recipe}))
    } else {
      console.log("nao tem")
      re.push(recipe)
    }
    var data = {
        favourites: re
    }
    console.log(data)
    updateDoc(userRef, data)
    .then(ss => {
      location.reload()
    })
    .catch(error => {
    })
}