

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
  // console.log(recipe)
  if (recipe===null){
    //window.location = "/"
  }

  const docRef = doc(db, "recipes", recipe);
  const r = (await getDoc(docRef));
  var oasdcn = false
  if(r.data() === undefined && oasdcn){
    document.getElementById("container").style.display = "block"
    document.getElementById("container").innerHTML = `
    <div id="noRecipe">
        <img src="/images/error-capivara.png">
        <h1>Opa! Parece que esta receita <span>não existe mais</span> ou o link está <span>errado</span>.</h1>
        <h1>Volte para a <span>página inicial</span> enquanto resolvemos isso <span id="s">;)</span></h1>    
        <div onClick="location.href='/'" class="h-pointer"><h2>Voltar para a Página Inicial </h2></div>
    </div>`
  }
  // console.log(r.data())

  let noImage = false
  for(var i = 0; i<10;i++){
    getDownloadURL(ref(storage, `recipes/images/${r.id}/image_${i}.png`))
    .then((url) => {
      var link = String(url)
      //console.log(link)
        document.getElementById("recipe-images").innerHTML += `<img onclick="showIMG('${link}')" src="${url}">`
    })
    .catch((error) => {
      if (String(error).includes("image_0")){
        document.getElementById("container").style.gridTemplateColumns = "0fr 1fr"
        noImage=true
      }
    });
  }
// console.log(r.data()["recipe-performance"] )
  document.title = "Pockitchen - " + r.data().name.split(`"`).join("")
  document.getElementById("receita-name").innerHTML = r.data().name.split(`"`).join("")
  document.getElementById("receita-rating").innerHTML = getStars(r.data().rating) + ` -  ` + (r.data().rating.toFixed(1)) + "/5"
  document.getElementById("receita-performance").innerHTML = r.data()["recipe-performance"] + ((parseInt(r.data()["recipe-performance"])>1)?" pessoas":"pessoa")
  document.getElementById("receita-time").innerHTML = getTime(r.data()["recipe-time-hours"],r.data()["recipe-time-minutes"])
  document.getElementById("receita-ingredients").innerHTML = showList(r.data().ingredients)
  document.getElementById("receita-tools").innerHTML = showList(r.data().tools)
  document.getElementById("receita-method").innerHTML = r.data().method

  function showList(i){
    // console.log(i)
    var r =""
    i.forEach(e=>{
      r+=`
      <li>${e.charAt(0).toUpperCase() + e.slice(1)}</li>`
      r = r.split(`"`).join("");
    })
    return r
  }
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
    // console.log(user.email);
    console.log("Logado");
    userid = user.uid;
    showUserInfoComment(user.uid)
    getUserName(user.uid)
    showFavourites(r.data(),user.uid)
  } else {
    console.log("No User");
    showFavourites(r.data(),"")
    // console.log(userid==="")
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
            <p>${(c.comment!==null)?c.comment:""}</p>
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
    rating: (cRating/total>=4.7)?5:(cRating/total)
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
  // console.log(recipe.favourites)
  // console.log(u)
  var re = recipe.favourites
  if (re!==undefined){
      document.getElementById("favourite-count").innerHTML = re.length
      if (re.includes(u)){
        // console.log("rem")
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
    // console.log("unde")
        var re = []
      }
      if (re.includes(userid)){
        // console.log("tem")
        re=re.filter((e)=>{return e!==userid})
        // console.log(re.filter((e)=>{return e!==userid}))
    } else {
      // console.log("nao tem")
      re.push(userid)
    }
    var data = {
        favourites: re
      }
      // console.log(data)
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
    // console.log(userSnap.data())
    if (re==undefined){
        var re = []
    }
    if (re.includes(recipe)){
      // console.log("tem")
      re=re.filter((e)=>{return e!==recipe})
      // console.log(re.filter((e)=>{return e!==recipe}))
    } else {
      // console.log("nao tem")
      re.push(recipe)
    }
    var data = {
        favourites: re
    }
    // console.log(data)
    updateDoc(userRef, data)
    .then(ss => {
      location.reload()
    })
    .catch(error => {
    })
}


//envio de sugestões

//criar opções

document.getElementById("inserter").insertAdjacentHTML("beforebegin",`
<select class="sugested-ingredient-tochange">
  ${makeOptions(r.data().ingredients)}
</select>
<a class="seta"><i class="fa-solid fa-arrow-right"></i></a>
<input class="sugested-ingredient" type="text">
`)

function makeOptions(i){
  var r =""
  i.forEach(e=>{
    r+=`
    <option value="${e.split(`"`).join("").trim()}"><a>${e.split(`"`).join("").trim()}</a></option>`
  })
  return r
}

//adicionar opções
document.getElementById("add-sugestion").addEventListener("click", function(){
  document.getElementById("inserter").insertAdjacentHTML("beforebegin",`
  <select class="sugested-ingredient-tochange">
    ${makeOptions(r.data().ingredients)}
  </select>
  <a class="seta"><i class="fa-solid fa-arrow-right"></i></a>
  <input class="sugested-ingredient" type="text">
  `)
})

//enviar sugestões
document.getElementById("sugestion-send").addEventListener("click", function(){
  let afirmado = true;
  const selections_elements = document.querySelectorAll(".sugested-ingredient-tochange")
  let selections = []
  selections_elements.forEach(e=>{
    selections.push(e.value)
  })
  const sugested_ingredients = document.querySelectorAll(".sugested-ingredient")
  let sugested = []
  sugested_ingredients.forEach(e=>{
    if(e.value.trim().length <= 0){
      afirmado = false
    } else{
      sugested.push(e.value)
    }
  })
  if (!afirmado){
    alert("Você não pode deixar uma sugestão vazia")
  } else{    
    selections.forEach((e,i)=>{
      e = e.split(`/`).join("#")
      // console.log(e+" =>")
      // console.log("--- "+sugested[i])
      let data = {"sugestions": [sugested[i]]}
      addSugestion(e,i,data)
    })
  }
})

async function addSugestion(e,i,data){
  const ingRef = doc(db, "recipes/"+recipe+"/sugestions", e);
  const ing = (await getDoc(ingRef));
  if (ing.data() !== undefined){
    ing.data().sugestions.forEach(e=>{
      data.sugestions.push(e)
    })
    // console.log(ing.data().sugestions)
  } 
  // console.log(data)
  const docRef = doc(db, "recipes/"+recipe+"/sugestions", e);
  setDoc(docRef, data)
  .then((doc) => {
    alert("Suas sugestões foram enviadas!")
    location.reload()
  })
}

//abrir envio de sugestões
document.getElementById("send-sugestions").addEventListener("click", function(){
  document.getElementById("send-sugestions-form").style.display= "block"
})

//fechar envio de sugestões
document.getElementById("sugestion-cancel").addEventListener("click", function(){
  document.getElementById("send-sugestions-form").style.display= "none"
})

//abrir sugestões
document.getElementById("see-sugestions").addEventListener("click", function(){
  document.getElementById("sugestions").style.display= "block"
  document.getElementById("container").style.gridTemplateColumns = "3fr 4.3fr"
})

//fechar sugestões
document.getElementById("close-sugestions").addEventListener("click", function(){
  console.log("fechar")
  document.getElementById("sugestions").style.display= "none"
  if (noImage){
    document.getElementById("container").style.gridTemplateColumns = "0fr 1fr"
  }
})

//escrever sugestões
function getSugestions(l){
  let r =""
  l.forEach((e)=>{
    console.log(e)

    r+=`<ul><li><i class="fa-solid fa-arrow-turn-down"></i>${e}</li></ul>`
  })
  return r
}

async function writeSugestions(){
  const ingRef = collection(db, "recipes/"+recipe+"/sugestions");
  const docsSnap = await getDocs(ingRef);

  try {
    const docsSnap = await getDocs(ingRef);
    if(docsSnap.docs.length > 0) {
       docsSnap.forEach(doc => {
          document.getElementById("sugestions-area").innerHTML += `
          <ul>
              <li class="sugestion-ingredient">${String(doc.id).split(`#`).join("/")}</li>
          </ul>
          ${getSugestions(doc.data().sugestions)}
          `
       })
    }
  } catch (error) {
      console.log(error);
  }
  if (docsSnap.docs[0] !== undefined){
    document.getElementById("see-sugestions").style.display= "inline-block"
  }
}

writeSugestions()