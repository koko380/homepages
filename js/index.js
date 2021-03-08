//スクロール出現
let scroll = document.getElementsByClassName("scroll");
function scrollShow(){
	for(let i = 0; i < scroll.length; i++) {
    if (window.innerHeight > scroll[i].getBoundingClientRect().top + 75) {
	    scroll[i].classList.add('scrollShow');
    } else {
  	  scroll[i].classList.remove('scrollShow');
    }
	}
}
window.addEventListener("load", event => {
	scrollShow();
});
window.addEventListener("scroll", event => {
  scrollShow();
});

//メニュー
let menu = document.getElementsByClassName("menu")[0];
let content = document.getElementsByClassName("content")[0];
function contentShow(){
	if(content.classList.contains("contentShow") === false){
    content.classList.add("contentShow");
  } else {
    content.classList.remove("contentShow");
  }
}
menu.addEventListener("click", event => {
	contentShow();
});

//メニューを押した時のリンク
let profileMenu = document.getElementById("profileMenu");
let skillMenu = document.getElementById("skillMenu");
let educationMenu = document.getElementById("educationMenu");
let workMenu = document.getElementById("workMenu");
profileMenu.addEventListener("click", event => {
	contentShow();
});
skillMenu.addEventListener("click", event => {
  contentShow();
});
educationMenu.addEventListener("click", event => {
  contentShow();
});
workMenu.addEventListener("click", event => {
  contentShow();
});

window.onload = function(){
}
