import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth,
        connectAuthEmulator,
        onAuthStateChanged,
        signInWithEmailAndPassword,
        signInWithCustomToken,
        createUserWithEmailAndPassword,
        signOut,
        sendPasswordResetEmail
    } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const appSettings = {
    databaseURL: "https://pockitchen-12f16-default-rtdb.firebaseio.com/",
    apiKey: "AIzaSyDvkoq2peOgmkQYTId55R3vqTB25y53HqQ",
    authDomain: "pockitchen-12f16.firebaseapp.com",
    projectId: "pockitchen-12f16",
    storageBucket: "pockitchen-12f16.appspot.com",
    messagingSenderId: "1058735687239",
    appId: "1:1058735687239:web:155567bc21eb06467dd362",
    measurementId: "G-YWG7SJ2Y8Y"
};

export const app = initializeApp(appSettings)
export const db = getDatabase(app)
export const auth = getAuth(app);
/* Logar usuário
var email = "macaco@animal.kitten"
var senha = "123net"

const userCredential = await signInWithEmailAndPassword(auth, email, senha)
console.log(userCredential.user)*/
//

try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha)
    console.log(userCredential.user)
} catch(error){
    //console.log(error)
}
/*
onAuthStateChanged(auth, user=> {
    if (user != null){
        console.log(user.email);
        console.log("Logado");
        //window.location = "entrada.html"
    } else {
        console.log("No User");
    }
})*/

export const logout = async () => {
    await signOut(auth)
}