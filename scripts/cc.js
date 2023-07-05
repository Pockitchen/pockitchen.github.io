import {
  getFirestore,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  getDocs,
  doc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";
import { app, auth, db, storage } from "./firebaseAPI.js";

document.addEventListener("DOMContentLoaded", function () {
  var hamburger = document.querySelector(".hamburger-menu");
  var sideMenu = document.querySelector(".side-menu");

  hamburger.addEventListener("click", function () {
    sideMenu.classList.toggle("active");
  });

  document.addEventListener("click", function (event) {
    var target = event.target;

    if (!target.closest(".navbar-menu") && !target.closest(".side-menu")) {
      sideMenu.classList.remove("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Função para adicionar uma restrição alimentar à lista
  function addRestriction(event) {
    const input = document.getElementById("in_restricoes");
    const restriction = input.value;

    if (restriction) {
      const listItem = document.createElement("span");
      listItem.classList.add("restriction-item");
      listItem.innerText = restriction;

      const removeButton = document.createElement("button");
      removeButton.classList.add("remove-button");
      removeButton.innerText = "-";
      removeButton.addEventListener("click", removeRestriction);

      listItem.appendChild(removeButton);

      const restrictionList = document.getElementById("ingredient-list");
      restrictionList.appendChild(listItem);

      input.value = ""; // Limpa o campo de entrada após adicionar a restrição
    }
  }

  // Função para remover uma restrição alimentar da lista
  function removeRestriction() {
    const listItem = this.parentNode;
    const restrictionList = document.getElementById("ingredient-list");
    restrictionList.removeChild(listItem);
  }
});

// Função para carregar os estados na lista de seleção

function carregarEstados() {
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((response) => response.json())
    .then((data) => {
      const estadoSelect = document.getElementById("estado");
      estadoSelect.innerHTML = '<option value="">Selecione um estado</option>';

      data.forEach((estado) => {
        const option = document.createElement("option");
        option.value = estado.id;
        option.textContent = estado.nome;
        estadoSelect.appendChild(option);
      });
    })
    .catch((error) => console.error(error));
}

// Função para carregar as cidades do estado selecionado

// Carregar os estados ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  carregarEstados();
});

document.getElementById("estado").addEventListener("change", (event) => {
  const estadoId = document.getElementById("estado").value;
  const cidadeSelect = document.getElementById("cidade");

  if (estadoId !== "") {
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`
    )
      .then((response) => response.json())
      .then((data) => {
        cidadeSelect.innerHTML =
          '<option value="">Selecione uma cidade</option>';

        data.forEach((cidade) => {
          const option = document.createElement("option");
          option.value = cidade.id;
          option.textContent = cidade.nome;
          cidadeSelect.appendChild(option);
        });
      })
      .catch((error) => console.error(error));
  } else {
    cidadeSelect.innerHTML =
      '<option value="">Selecione um estado primeiro</option>';
  }
});

/* Máscaras ER */

var v_obj, v_fun;
function mascara(o, f) {
  v_obj = o;
  v_fun = f;
  setTimeout(execmascara(), 1);
}
function execmascara() {
  v_obj.value = v_fun(v_obj.value);
}
function mtel(v) {
  v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  v = v.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
  return v;
}
function id(el) {
  return document.getElementById(el);
}
window.onload = function () {
  id("telefone").onkeyup = function () {
    mascara(this, mtel);
  };
};

var userid = "";
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log(user.email);
    console.log("Logado");
    userid = user.uid;
  } else {
    window.location = "../login";
    console.log("No User");
  }
});

function v(id) {
  //console.log(document.getElementById(id).value)
  return document.getElementById(id).value;
}

function separateComma(txt) {
  if (txt.includes(",")) {
    var text = txt.split(",").filter((word) => word.trim().length > 0);
  } else {
    var text = [txt];
  }
  return text;
}

let enviar = document.getElementById("cadastrar");
enviar.addEventListener("click", () => {
  event.preventDefault();

  
  
  const data = {
    name: v("nome"),
    bithday: v("nasc"),
    gender: v("generos"),
    state: v("estado"),
    city: v("cidade"),
    picture: v("file-input"),
    telephone: v("telefone"),
    restrictions: separateComma(v("telefone")),
  };

  if (v("nome").trim().length <= 0) {
    alerta.innerHTML =
    "Por favor, insira um <span class='bold'>nome</span> válido.";
  } else if (v("nasc").trim().length <= 0) {
    alerta.innerHTML =
      "Por favor, insira uma <span class='bold'>data de nascimento</span> válida.";
  } else if (v("estado").trim().length <= 0) {
    alerta.innerHTML =
    "Por favor, escolha um <span class='bold'>estado</span>.";
  } else if (v("cidade").trim().length <= 0) {
    alerta.innerHTML =
    "Por favor, escolha uma <span class='bold'>cidade</span>.";
  } else if (v("file-input").trim().length <= 0) {
    alerta.innerHTML =
    "Por favor, envie uma <span class='bold'>foto</span> para usar de perfil.";
  } else if (v("telefone").trim().length <= 0) {
    alerta.innerHTML =
    "Por favor, insira um <span class='bold'>número de telefone</span> válido.";
  } else {
    



    
    const file = document.getElementById("file-input").files[0];
    const metadata = {
      contentType: file.type
    };
    const storageRef = ref(storage, `users/pp/`+userid +"."+ "png");
    console.log(file)
  
    const task = uploadBytesResumable(storageRef,file, metadata)
        .then(snapshot => getDownloadURL(snapshot.ref))
        .then(url => {
        console.log(url);
        alert('Cadastro completo efetuado com sucesso!');
          window.location = "../user";
     })
     .catch(console.error);




    
    const docRef = doc(db, "users", userid);
    updateDoc(docRef, data)
    .then(() => {
        console.log("Document has been added successfully");
        })
      .catch((error) => {
        console.log(error);
      });
  }

  console.log(data);
});