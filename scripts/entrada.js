import {onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { auth, logout } from "./firebaseAPI.js";

document.getElementById("logoutBtn").addEventListener("click", function() {
    deslogar();
  });


  onAuthStateChanged(auth, user=> {
    if (user != null){
      document.getElementById("email").innerHTML = user.email;
        console.log("Logado");
        //window.location = "entrada.html"
    } else {
        console.log("No User");
    }
})

function deslogar() {
  // Lógica para deslogar o usuário aqui
  alert("Usuário deslogado com sucesso!");
  logout()
  // Redirecionar para a página de login, por exemplo:
  window.location.href = "index.html";
}
  