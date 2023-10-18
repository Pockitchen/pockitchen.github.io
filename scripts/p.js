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

  function separateComma(txt){
    if (txt.includes(",")){
        var text = txt.split(",").filter(word => word.trim().length > 0);
    } else {
        var text = [txt]
    }
    text.forEach((e,i)=>{
      if (e==0){
        text[i] = false
      } else text[i]=true
    })
    return text
}
  
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
  const urlParams = new URLSearchParams(window.location.search);
  const pesquisa = urlParams.get('search')
  const marcadores = separateComma(urlParams.get('tags'))
  console.log(pesquisa)
  console.log(marcadores)
  if(!urlParams.has('search')){
    window.location = "/"
  }

  
  const tags = ["fitness","comemorativas","festas","acucar","glutem","lactose","vegano"]

  function select_tag(){
    var _tag = []
    console.log(marcadores.includes(true))
    marcadores.forEach((e,i) =>{
        if (e){
            _tag.push(tags[i])
            console.log(tags[i])
        }
    })
    return (marcadores.includes(true))?_tag:tags;
  }




  const collectionRef = collection(db, "recipes");
  //
  const q = query(collectionRef,where("name", ">=", pesquisa), where('name', '<=', pesquisa+ '\uf8ff'), where("tags","array-contains-any",select_tag()));
  // 
  
  const docSnap = await getDocs(q);
  
  docSnap.forEach((doc) => {
    console.log(doc.data());
    var r = doc.data()
    var imageURL = "/images/error-capivara.png"
    getDownloadURL(ref(storage, `recipes/images/${doc.id}/image_0.png`))
    .then((url) => {
        imageURL = url
    })
    .catch((error) => {
        imageURL = "/images/error-capivara.png"
    }).then(()=>{
      console.log(doc.id)
        document.getElementById("corpo").innerHTML+=`
        <div class="recipe h-pointer" onclick="location.href='/r/?r=${doc.id}'">
            <div class="recipe-top">
                <h2>${r.name}</h2>
                <h2 class="rating-stars">${countStars(r.rating)}</h2>
            </div>
            <div class="recipe-body">
                <div>
                  <img class="recipe-image" src="${imageURL}"}>
                  <div class="recipes-selos">
                    ${getSelos(r.tags)}
                  </div>
                </div>
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
        var selos = document.querySelectorAll(".recipe-selo-hidden")
        var recipes = document.querySelectorAll(".recipe-image")
        selos.forEach((selo,index)=>{
          selo.addEventListener("mouseenter",()=>{
            selo.style.overflow = "visible"
          })
          selo.addEventListener("mouseleave",()=>{
            console.log("merda")
            selo.style.overflow = "hidden"
          })
        })
    })
                    
}
  );
  const selosText = {
    vegano: "Essa receita é <span>Vegana</span>!",
    glutem: "Essa receita é livre de <span>Glútem</span>!",
    lactose: "Essa receita é livre de <span>Lactose</span>!",
    acucar: "Essa receita é livre de <span>Açúcar</span>!",
    fitness: "Essa receita é <span>Fitness</span>!",
    festas: "Essa receita é própria para <span>Festas</span>!",
    comemorativas: "Essa receita é própria para <span>Datas Comemorativas</span>!",
  };

  function getSelos(s){
    var r =""
    s.forEach(e => {
      r+=`
      <div class="recipe-selo-hidden">
        <div class="recipe-selo-group">
          <a class="selo-hover ${e}">${selosText[e]}</a>
          <img class="selo-img" src="/images/selos/${e}.svg">
        </div>
      </div>`
    });
    return r
  }

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