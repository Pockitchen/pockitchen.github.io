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
  
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      console.log(user.uid);
      console.log("Logado");
      puxar(user.uid)
      sendInfo(user.uid)
      
    } else {
      console.log("No User");
      window.location = "/login"
    }
  });

async function puxar(u) {
    const docRef = doc(db, "users", u);
    const user = (await getDoc(docRef)).data();
    //console.log(user.restrictions)
    escreverInfos("user-name",user.name)
    escreverInfos("user-bio",user.bio)
    escreverInfos("user-gender",user.gender)
    escreverInfos("user-birth",new Date(user.birth))
    escreverInfos("user-state",user.state)
    escreverInfos("user-city",user.city)
    user.restrictions.forEach(e => {
        document.getElementById(e).checked = true
    });
}

function escreverInfos(input,info){
    document.getElementById(input).value = info
}

function puxarInfos(input){
    return document.getElementById("user-"+input).value
}

async function sendInfo(user){
    const docRef = doc(db, "users", user);
    const u = (await getDoc(docRef)).data();
    //console.log(u)
    document.getElementById("send-btn").addEventListener("click", function(){
        const data = {
            name: puxarInfos("name"),
            bio: puxarInfos("bio"),
            gender: puxarInfos("gender"),
            birth: Date.parse(puxarInfos("birth")),
            state: puxarInfos("state"),
            city: puxarInfos("city"),
            favourite: u.favourite,
            restrictions: res(),
          };
          
          setDoc(docRef, data).then(() => {
            console.log("Document has been added successfully");
            console.log(data)
            //window.location = "../entrada"
          }).catch((error) => {
            console.log(error);
          });
    })
}
function res(){
    var kk = []
    document.querySelectorAll(".limitation").forEach(e=>{
        //console.log(e.checked)
        if(e.checked){
            kk.push(e.id)
        }
    })
    return kk
}