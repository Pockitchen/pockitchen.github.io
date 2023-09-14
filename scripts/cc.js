const father = document.getElementById("restrictions-tag")
const bar = document.getElementById("restrictions-tags")
const search = document.getElementById("tag-search")
const tags = ["Lactose","Açúcar","Nozes","Gluten","Cafeína","Histamina"]

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
