/* Nota do programador

- se você entender alguma merda desse código, parabéns.
*/

const father = document.getElementById("recipe-tag")
const bar = document.getElementById("recipe-tags")
const search = document.getElementById("tag-search")
export const tags = [
    {
        "tag": "fitness",
        "name": "Fitness",
        "desc": "Receitas com este selo são perfeitas para comer antes de exercícios físicos pesados."
    },{
        "tag": "comemorativas",
        "name": "Para Datas Comemorativas",
        "desc": "Receitas de pratos feitos para datas especiais, como Natal, Páscoa e festa junina."
    },{
        "tag": "festas",
        "name": "Para Festas",
        "desc": "Receitas tradicionalmente feitas para festas e que atendem uma grande quantidade de pessoas."
    },{
        "tag": "acucar",
        "name": "Sem Açúcar",
        "desc": "Receitas com este selo são versões sem açúcar de receitas que normalmente possuem."
    },{
        "tag": "glutem",
        "name": "Sem Glutem",
        "desc": "Receitas com este selo não possuem nenhum ingrediente com glúten."
    },{
        "tag": "lactose",
        "name": "Sem Lactose",
        "desc": "Receitas com este selo não possuem leite e derivados."
    },{
        "tag": "vegano",
        "name": "Vegano",
        "desc": "Receitas com este selo não possuem nenhum ingrediente de origem animal."
    }
]
search.style.width = father.clientWidth - 20 + "px"

bar.addEventListener('keyup', (e) => {
    // console.log(e)
    if (bar.value == null || bar.value.trim() === ''){
        search.style.display = "none";
    } else {
        if (e.key == "ArrowUp"){
            // console.log("up")
            if (s==0){
                s = disponivel-1
            } else s--
        } else if (e.key == "ArrowDown"){
            // console.log("up")
            if (s==disponivel-1){
                s = 0
            } else s++
        } else if (e.key == "Enter"){
            selected_tag[document.querySelectorAll(".stag-selected")[0].id] = true
            bar.value = ""
        } else {
            s = 0;
        }
        //console.log(s)
        search.style.display = "block";
        renderTags()
    }
})
bar.addEventListener('change', (e) => {
    if (bar.value == null || bar.value.trim() === ''){
        //console.log("vazio")
        search.style.display = "none";
    } else {
        search.style.display = "block";
        renderTags()
    }
})
var selected_tag = [false,false,false,false,false,false,false];
var s_index;
var s = 0;
var disponivel = 0;
var images = [];

function renderTags(){
    search.innerHTML = ""
    disponivel = 0;
    var d = false
    var i = 0;
    tags.forEach((e,index) => {
        if (bar.value == null || bar.value.trim() === ''){
        } else {
            if (e.name.toUpperCase().includes(bar.value.toUpperCase())&&!selected_tag[index]){
                disponivel++
                d = true
                var se = ""
                if (s == i){
                    //console.log(e.name+" selected")
                    s_index= index
                    se = " stag-selected"
                    //console.log(selected_tag)
                }
                // console.log(e.name.toUpperCase())
                // console.log("valor: " +bar.value)
                search.innerHTML += `
                <div id="${index}" class="stag-space${se}" name="${e.tag}">
                <a class="stag-name ${e.tag}">${e.name}</a>
                <a class="stag-desc">${e.desc}</a>
                </div>
                `
                i++
            }
        }
        var item = document.querySelectorAll(".stag-space")
        item.forEach(b=>{
            b.addEventListener("click", function(){
                // console.log(b)
                event.preventDefault()
                selected_tag[b.id] = true
                bar.value = ""
                renderTags()
            })
            b.addEventListener("mouseover", function(){
                s_index = (document.querySelectorAll(".stag-selected")[0].id)
                document.querySelectorAll(".stag-selected")[0].classList.remove("stag-selected")
                b.classList.add("stag-selected")
                // console.log("select "+s)
                // console.log("index "+s_index)
                // console.log(selected_tag)
            })
        })
    });
    
    //console.log(item)

    document.getElementById("tag-list").innerHTML = ""
    selected_tag.forEach((e,index)=>{
        if (e){
            document.getElementById("tag-list").innerHTML += `<a class="tag ${tags[index].tag}" id="tag${index}">${tags[index].name}<i id="remove${index}" class="fa-solid fa-xmark h-pointer"></i></a>` 
            var x = document.querySelectorAll(".fa-xmark")
            x.forEach(b=>{
                b.addEventListener("click", function(){
                    // console.log(b)
                    var id = parseInt(b.id.replace("remove",""))
                    // console.log(id)
                    selected_tag[id] = false
                    renderTags()
                })
            })
        }
    })

    // console.log("d"+disponivel)
    // console.log("index "+s_index)
    // console.log("select "+s)

    if(!d){
        search.innerHTML += `
        <a class="stag-desc">Não foi encontrado nenhum marcador</a>
        `
    }
}


function select_tag(){
    var _tag = []
    //if (select_tag)
    selected_tag.forEach((e,i) =>{
        if (e){
            _tag.push(tags[i].tag)
            console.log(tags[i].tag)
        }
    })
    return _tag;
}

import {
    collection,
    addDoc,
    getDoc,
    updateDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { app, auth, db, storage } from "./firebaseAPI.js";

var userid;

onAuthStateChanged(auth, (user) => {
    if (user != null) {
        console.log(user.uid);
        console.log("Logado");
        userid = user.uid;
    } else {
        console.log("No User");
        document.getElementById("login-alert").style.display = "block";
        //window.location = "/login"
    }
});
  
function valor(id){
    //console.log(document.getElementById(id).value)
    return document.getElementById(id).value;
}

function separateComma(txt){
    if (txt.includes(",")){
        var text = txt.split(",").filter(word => word.trim().length > 0);
    } else {
        var text = [txt]
    }
    return text
}  

const inputElement = document.getElementById("imagens-upload");
inputElement.addEventListener("change", ()=>{
    console.log(inputElement.files)
    images.push(inputElement.files[0])
    inputElement.value = ""
    console.log(inputElement.files)
    console.log(images)
    renderImages()
});

function renderImages() {
    document.getElementById("images-conteiner").innerHTML = ""
  images.forEach((e,i)=>{
    console.log("a")
    document.getElementById("images-conteiner").innerHTML += `<img src="${URL.createObjectURL(e)}">`
  })
}

async function addRecipe(recipeID){
    const userRef = doc(db, "users", userid);
    const userSnap = await getDoc(userRef);
    var re = userSnap.data().recipes
    if (re==undefined){
        var re = []
    }
    re.push(recipeID)
    var data = {
        recipes: re
    }
    console.log(data)
    updateDoc(userRef, data)
    .then(userRef => {
        console.log("A New Document Field has been added to an existing document");
    })
    .catch(error => {
        console.log(error);
    })
}

var receitaID = ""
let enviar = document.getElementById("send-btn")
enviar.addEventListener("click",() => {

    console.log(images.length)
    
    const data = {
        "name": valor("recipe-name"),
        "description": valor("recipe-description"),
        "tools": separateComma(valor("recipe-tools")),
        "ingredients": separateComma(valor("recipe-ingredients")),
        "method": separateComma(valor("recipe-method")),
        "recipe-time-hours": valor("recipe-time-hours"),
        "recipe-time-minutes": valor("recipe-time-minutes"),
        "recipe-performance": valor("recipe-performance"),
        "tags": select_tag(),
        "favourites": [],
        "rating": 0,
        "verified": false,
        "user": userid
    };
    console.log(data)

    const alerta = document.getElementById("inputError")
    if (valor("recipe-name").trim().length <= 0){
        alerta.innerHTML = "Por favor, insira um <span class='bold'>nome válido</span> para a receita."
    } else if (valor("recipe-tools").length <= 0){
        alerta.innerHTML = "Por favor, insira as <span class='bold'>ferramentas</span> necessárias para fazer a sua receita."
    } else if (valor("recipe-ingredients").length <= 0){
        alerta.innerHTML = "Por favor, insira os <span class='bold'>ingredientes</span> necessários para fazer a sua receita."
    } else if (parseInt(valor("recipe-time-hours")) <= 0&&parseInt(valor("recipe-time-minutes")) <= 0){
        alerta.innerHTML = "Por favor, insira o <span class='bold'>tempo</span> necessário para fazer a sua receita."
    } else if (parseInt(valor("recipe-performance")) <= 0){
        alerta.innerHTML = "Por favor, insira <span class='bold'>quantas pessoas</span> a sua receita serve."
    } else {
        alerta.innerHTML = ""

    addRecipe()
    document.getElementById("enviando-receita-alert").style.display = "block"
    const docRef = collection(db, "recipes");
    addDoc(docRef, data)
    .then((doc) => {
      console.log(doc.id)
      addRecipe(doc.id)
      receitaID = doc.id
      var complete = 0
      if(images.length>0){
      images.forEach((e,index)=>{
        const file = e;
        const storageRef = ref(storage, `recipes/images/${doc.id}/image_${index}.png`);
        //console.log(file)
          
        const task = uploadBytesResumable(storageRef,file)
        .then(snapshot => getDownloadURL(snapshot.ref))
        .then(url => {
                console.log(url);
                complete++
                if (complete==images.length){
                    completeSend()
                }
                 //window.location = "../";
            })
            .catch(console.error);
        })
    } else {
        completeSend()
    }

    function completeSend(){
        document.getElementById("enviando-receita-alert").innerHTML = `
        <div id="form-resend">
            <p>Sua receita foi enviada ao nosso site!</p>
            <p>Agora ela vai aparecer <span class="orange-span">em todo lugar</span>!</p>
            <div id="enviando-receita-carregando">
                <div id="goToLogin" class="h-pointer ntext-select" onclick="location.href='/r/?r=${receitaID}'">Ver minha receita</div>
            </div>
        </div>`
    }
        
    })
    .catch(error => {
        console.log(error);
    })
    
    } 
  })

// Mascara para tempo de preparo: (coloquei o imput type text no html)
const timeInput = document.getElementById('recipe-time-minutes');

    timeInput.addEventListener('input', (event) => {
        let value = event.target.value;
        value = value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + ':' + value.substring(2, 4);
        }
        event.target.value = value;
    });
    timeInput.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && timeInput.value.endsWith(':')) {
            event.preventDefault(); 
            timeInput.value = timeInput.value.slice(0, -2);
        }
    });


// input de pessoas: não deixa inserir valor negativo e insere apenas numeros. Não fiz nenhuma modificação no html
document.getElementById("recipe-performance").addEventListener('input', function() {
    
    this.value = this.value.replace(/[^0-9]/g, '');

    if (this.value.startsWith('0')) {
        this.value = parseInt(this.value, 10);
    }
    if (this.value === '') {
        this.value = '0';
    }
});