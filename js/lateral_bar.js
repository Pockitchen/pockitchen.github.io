import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";const appSettings = {databaseURL: "https://pockitchen-12f16-default-rtdb.firebaseio.com/",apiKey: "AIzaSyDvkoq2peOgmkQYTId55R3vqTB25y53HqQ",authDomain: "pockitchen-12f16.firebaseapp.com",projectId: "pockitchen-12f16",storageBucket: "pockitchen-12f16.appspot.com",messagingSenderId: "1058735687239",appId: "1:1058735687239:web:155567bc21eb06467dd362",measurementId: "G-YWG7SJ2Y8Y",};const app = initializeApp(appSettings); const auth = getAuth(app);
import {
    onAuthStateChanged,
    signOut,
    getAuth,
  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
  import {
    ref,
    getDownloadURL,
  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
  import {
    getDoc,
    doc,
  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
  import { db, storage } from "/scripts/firebaseAPI.js";

var tema;

async function getUserInfo(i){
    console.log(i)
    const docRef = doc(db, "users", i);
    const user = await getDoc(docRef);
    console.log(user.data())
    document.getElementById("lb-username").innerHTML= user.data().name
    getDownloadURL(ref(storage, `users/pp/` + i + ".png"))
    .then((url) => {
      var link = String(url)
      //console.log(link)
        document.getElementById("lb-pp").src = link
    })
}

document.getElementById("header-div").addEventListener("click",()=>{
    window.location = "/"
})

window.addEventListener("load", function(){
    var textlogin;
    var loged = false
    var userName = "Clique aqui<br>para ENTRAR"
    onAuthStateChanged(auth, (user) => {
        if (user != null) {
            loged = true
        } else {
        }
    var pages
    fetch("/lateral_bar.json")
    .then((response) => response.json())
    .then((json) => {
        pages = json.pages

        theme()

    this.document.getElementById("bar-space").innerHTML = `
    <div id="lateral-bar">
        <div id="lb-profile" class="h-pointer" onclick="location.href='/${(loged)?"user":"login"}'">
            <img id="lb-pp" src="/images/profile-picture-padrao.png">
            <a id="lb-username">${userName} </a>
        </div>
        <hr>
        <ol id="page-list">
            <li onClick="location.href='${pages[0].link}'" class="ntext-select"><i class="fa-solid fa-${pages[0].icon}"></i>${pages[0].text}</li>
            <li onClick="location.href='${pages[1].link}'" class="ntext-select"><i class="fa-solid fa-${pages[1].icon}"></i>${pages[1].text}</li>
            <li onClick="location.href='${pages[2].link}'" class="ntext-select"><i class="fa-solid fa-${pages[2].icon}"></i>${pages[2].text}</li>
            <li onClick="location.href='${pages[3].link}'" class="ntext-select"><i class="fa-solid fa-${pages[3].icon}"></i>${pages[3].text}</li>
            <li onClick="location.href='${pages[4].link}'" class="ntext-select"><i class="fa-solid fa-${pages[4].icon}"></i>${pages[4].text}</li>
        </ol>
        <ol id="page-options">
            <li class="ntext-select " id="themeChange">
                <div id="theme-slider" class="dark-theme">
                    <div>
                    </div>
                </div>
                <i class="fa-solid fa-moon"></i>
                </a>
                ${tema}
            </li>
            <li class="ntext-select" onClick="location.href='/sobrenos'"><i class="fa-solid fa-users"></i>Sobre-nós</li>
            <li class="ntext-select" id="logBtn"><i class="fa-solid fa-right-to-bracket"></i><span id="textLogin"></span></li>
        </ol>
    </div>`
    var bar = this.document.getElementById("lateral-bar")
    if (user != null) {
        this.document.getElementById("textLogin").innerHTML = "Sair da Conta"
        getUserInfo(user.uid)
    } else {
        this.document.getElementById("textLogin").innerHTML = "Entrar/Cadastrar"
    }

    
    
    document.getElementById("side-bar").addEventListener('click',function() {
        let id = null;
        let pos = -460;
        clearInterval(id);
        id = setInterval(frame, 5);
        function frame() {
            if (pos == 0) {
            clearInterval(id);
            document.getElementById("lateral-bar").addEventListener('mouseleave',function() {
                let id = null;
                let pos = 0;
                clearInterval(id);
                id = setInterval(frame, 5);
                function frame() {
                    if (pos == -460) {
                    clearInterval(id);
                    } else {
                    pos-=10; 
                    bar.style.left = pos + "px"
                    }
                }
            })
            } else {
            pos+=10; 
            bar.style.left = pos + "px"
            }
        }
    })

    this.document.getElementById("logBtn").addEventListener('click',function() {
        if (loged){
            signOut(auth).then(() => {
                window.location = "/"
            }).catch((error) => {
            });
        } else {
            window.location = "/login"
        }
    })
    
    this.document.getElementById("themeChange").addEventListener('click',function() {
        if (parseInt(localStorage.getItem("pockitchenActiveTheme")) == 0){
            localStorage.setItem("pockitchenActiveTheme", 1);
            theme()
            tema = "Tema Claro"
            document.getElementById("themeChange").innerHTML = `<a><i class="fa-solid fa-sun"></i><div id="theme-slider" class="bright-theme"><div></div></div></a>${tema}`
        }else{
            localStorage.setItem("pockitchenActiveTheme", 0);
            theme()
            tema = "Tema Escuro"
            document.getElementById("themeChange").innerHTML = `<a><div id="theme-slider" class="dark-theme"><div></div></div><i class="fa-solid fa-moon"></i></a>${tema}`
        }
    })
});
});
})

function theme(){
    if (localStorage.getItem("pockitchenActiveTheme") === null) {
        //console.log("não tem")
        localStorage.setItem("pockitchenActiveTheme", 0);
        // console.log("tema claro")
    } else {
        if (parseInt(localStorage.getItem("pockitchenActiveTheme")) == 0){
            //Tema Escuro
            document.documentElement.style.setProperty('--f1', '#222')
            document.documentElement.style.setProperty('--f2', '#141414')
            document.documentElement.style.setProperty('--t1', '#fff')
            document.documentElement.style.setProperty('--t2', '#484848')
            document.documentElement.style.setProperty('--i-logo', '0')
            tema = "Tema Escuro"
        }else{
            //Tema Claro
            document.documentElement.style.setProperty('--f1', '#fff')
            document.documentElement.style.setProperty('--f2', '#e8e8e8')
            document.documentElement.style.setProperty('--t1', '#272727')
            document.documentElement.style.setProperty('--t2', '#d8d8d8')
            document.documentElement.style.setProperty('--i-logo', '.87')
            tema = "Tema Claro"
        }
    }
}