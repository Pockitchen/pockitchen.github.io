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
  
  var userid = "";
  
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      console.log(user.email);
      console.log("Logado");
      userid = user.uid;
  
    } else {
      console.log("No User");
      //window.location = "/login"
    }
  });
  const collectionRef = collection(db, "recipes");
  const q = query(collectionRef, where("recipe-performance", ">=", "1"));
  
  const docSnap = await getDocs(collectionRef);
  
  docSnap.forEach((doc) => {
    // console.log(doc.data());
    var r = doc.data()
    var imageURL = "/images/error-capivara.png"
    getDownloadURL(ref(storage, `recipes/images/${doc.id}/image_0.png`))
    .then((url) => {
        imageURL = url
    })
    .catch((error) => {
        imageURL = "/images/error-capivara.png"
    }).then(()=>{
        document.getElementById("corpo").innerHTML+=`
        <div class="recipe h-pointer" onclick="location.href='/r/?r=${doc.id}'">
            <div class="recipe-top">
                <h2>${r.name}</h2>
                <h2 class="rating-stars">${countStars(r.rating)}</h2>
            </div>
            <div class="recipe-body">
                <img class="recipe-image" src="${imageURL}"}>
                <div class="recipe-text">
                    <div class="recipe-text-mask"></div>
                    <p>${r.description}
                    <br><br>${r.method}</p>
                </div>
            </div>
            <div class="recipe-ingredients">
                ${ingredients(r.ingredients)}
            </div>
        </div>`
    })
                    
}
  );

  function countStars(stars){
    var valor ="";
    for(var i=0; i<stars;i++){
        valor +=`<i class="fa-solid fa-star"></i>`
    }
    for(stars;stars<5;stars++){
        valor +=`<i class="fa-regular fa-star"></i>`
    }

    return valor;
  }

  function ingredients(ing){
    var valor="";
    ing.forEach((e)=>{
        valor += `<a class="ingredient">${e}</a>`
    })
    return valor
  }

  const tags = ["fitness","comemorativas","festas","acucar","glutem","lactose","vegano"
]

  function pesquisar(){
    var search=document.getElementById("search-bar-input").value
    console.log(search)
    var tags = [0,0,0,0,0,0,0]
    document.querySelectorAll(".limitation").forEach((e,i)=>{
      if (e.checked){
        tags[i] = 1
        console.log(tags)
      }
    })
    window.location = `/p/?search=${search}&tags=${tags}`
  }

  function isThereATagSelected(){
    var r = false
    document.querySelectorAll(".limitation").forEach((e,i)=>{
      if (e.checked){
        r=true
      }
    })
    return r
  }
  
  document.getElementById("search-bar-input").addEventListener("keyup", (e)=>{
    var bar = document.getElementById("search-bar-input")
    if (e.key == "Enter"){
      if(bar.value.trim().length !== 0||isThereATagSelected()){
        pesquisar()
      } else console.log("vazio")
    }
  })

  document.getElementById("search-btn").addEventListener("click", (e)=>{
    var bar = document.getElementById("search-bar-input")
      if(bar.value.trim().length !== 0 ||isThereATagSelected()){
        pesquisar()
      } else console.log("vazio")
  })
  console.log(document.getElementById("filter-button").offsetLeft)
  document.getElementById("filter-page").style.top = document.getElementById("filter-button").offsetTop+document.getElementById("filter-button").offsetHeight +"px"
var show =false
  document.getElementById("filter-button").addEventListener("click",function(){
    if (!show){
      document.getElementById("filter-page").style.display= "block"
      show = true
    } else {
      document.getElementById("filter-page").style.display= "none"
      show = false
    }
  })