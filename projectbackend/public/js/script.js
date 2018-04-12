/* VANILLA JS HOVERING EFFECT */
function menus() {
  var menu = this;
  menu.classList.toggle("category-shadow");
};

var holder = document.getElementsByClassName("text-holder");
for (var i = 0; i < holder.length; i++) {
    holder[i].addEventListener('mouseenter', menus, false);
    holder[i].addEventListener('mouseleave', menus, false);
}

/* JS FOR EXPANDING & COLLAPSING TEXT */
function expandText() {
	var p = this;
    var curHeight = p.height;
    var autoHeight = p.scrollHeight;
    p.style.height = autoHeight + "px";
}

function collapseText() {
	var p = this;
    var curHeight = p.height;
    var autoHeight = 3;
    p.style.height = autoHeight + "em";
}

var holder = document.getElementsByClassName("text-holder");

for (var i = 0; i < holder.length; i++) {
	var p = holder[i].getElementsByTagName('p')[0];
	p.addEventListener('mouseenter', expandText, false);
	p.addEventListener('mouseleave', collapseText, false);
    // var curHeight = p.height;
    // var autoHeight = p.scrollHeight;
   	// console.log(autoHeight);
    // p.style.height = autoHeight + "px";
}