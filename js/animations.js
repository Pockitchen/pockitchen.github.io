export function fadeIn(x, time = 1){
    let id = null;
    x.style.opacity = 0
    x.style.display = 'block';
    let pos = 0;
    clearInterval(id);
    id = setInterval(frame, time);
    function frame() {
        if (pos == 100) {
        clearInterval(id);
        } else {
        pos+=4; 
        x.style.opacity = pos/100
        }
    }
}

export function fadeOut(x, time = 1){
    let id = null;
    let pos = 100;
    clearInterval(id);
    id = setInterval(frame, time);
    function frame() {
        if (pos == 0) {
        clearInterval(id);
        x.style.display = 'none';
        } else {
        pos-=4; 
        x.style.opacity = pos/100
        }
    }
}