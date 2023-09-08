import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js"; import {onAuthStateChanged,getAuth,} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";const appSettings = {databaseURL: "https://pockitchen-12f16-default-rtdb.firebaseio.com/",apiKey: "AIzaSyDvkoq2peOgmkQYTId55R3vqTB25y53HqQ",authDomain: "pockitchen-12f16.firebaseapp.com",projectId: "pockitchen-12f16",storageBucket: "pockitchen-12f16.appspot.com",messagingSenderId: "1058735687239",appId: "1:1058735687239:web:155567bc21eb06467dd362",measurementId: "G-YWG7SJ2Y8Y",};const app = initializeApp(appSettings); const auth = getAuth(app);

window.addEventListener("load", function(){
    var textlogin;
    onAuthStateChanged(auth, (user) => {
        if (user != null) {
            textlogin = "Sair da Conta"
            
        } else {
            textlogin = "Entrar/Cadastrar"
        }
    var pages
    fetch("/lateral_bar.json")
    .then((response) => response.json())
    .then((json) => {
        pages = json.pages
    
    console.log(pages[1].icon)

    this.document.body.innerHTML = `
    <div id="lateral-bar">
        <div id="lb-profile">
            <img src="/images/profile-picture-padrao.png">
            <a>Nome do usuário </a>
        </div>
        <hr>
        <ol id="page-list">
            <li onClick="location.href='${pages[0].link}'"><i class="fa-solid fa-${pages[0].icon}"></i>${pages[0].text}</li>
            <li onClick="location.href='${pages[1].link}'"><i class="fa-solid fa-${pages[1].icon}"></i>${pages[1].text}</li>
            <li onClick="location.href='${pages[2].link}'"><i class="fa-solid fa-${pages[2].icon}"></i>${pages[2].text}</li>
            <li onClick="location.href='${pages[3].link}'"><i class="fa-solid fa-${pages[3].icon}"></i>${pages[3].text}</li>
            <li onClick="location.href='${pages[4].link}'"><i class="fa-solid fa-${pages[4].icon}"></i>${pages[4].text}</li>
        </ol>
        <ol id="page-options">
            <li><a><i class="fa-solid fa-sun"></i><div id="theme-slider"><div></div></div></a>Tema Claro</li>
            <li><i class="fa-solid fa-users"></i>Sobre-nós</li>
            <li><i class="fa-solid fa-right-to-bracket"></i>${textlogin}</li>
        </ol>
    </div>` + this.document.body.innerHTML
    var bar = this.document.getElementById("lateral-bar")
    
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
});
});



})