//スクロール出現
let scroll = document.getElementsByClassName("scroll");
function scroll_show(){
	for(let i = 0; i < scroll.length; i++) {
    if (window.innerHeight > scroll[i].getBoundingClientRect().top + 75) {
	    scroll[i].classList.add('scrollShow');
    } else {
  	  scroll[i].classList.remove('scrollShow');
    }
	}
}
window.addEventListener("load", event => {
	scroll_show();
});
window.addEventListener("scroll", event => {
  scroll_show();
});

//メニュー
let menu = document.getElementsByClassName("menu")[0];
let content = document.getElementsByClassName("content")[0];
menu.addEventListener("click", event => {
	if(content.classList.contains("contentShow") === false){
		content.classList.add("contentShow");
	} else {
		content.classList.remove("contentShow");
	}
});

window.onload = function(){
}
