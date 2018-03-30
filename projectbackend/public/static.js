/* VANILLA JS HOVERING EFFECT */
var holder = document.getElementsByClassName("text-holder");

for (var i = 0; i < holder.length; i++) {
    holder[i].addEventListener('mouseenter', menus, false);
    holder[i].addEventListener('mouseleave', menus, false);
}

function menus() {
  var menu = this;
  menu.classList.toggle("category-shadow");
};