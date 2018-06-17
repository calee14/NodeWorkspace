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
var sidemenu = document.getElementById('sidemenu');
var a_list = sidemenu.children;
var group = document.getElementById('group-container-id').children;
for (var i = 0; i < group.length; i++) {
  if(i == 0) {
    group[i].setAttribute("id", "group-shown");
  }
  group[i].setAttribute("style", "display:none;");
}
for(var i=0;i<a_list.length;i++) {
  var element = a_list[i];
  element.addEventListener('click', function() {
    var sidemenu = document.getElementById('sidemenu');
    var list = sidemenu.children;
    var index = 0;
    for(var j=0;j<list.length;j++) {
      if(list[j] == this) {
        console.log(j);
        index = j;
        break;
      }
    }
    var group = document.getElementById('group-container-id');
    for (var i = 0; i < group.children.length; i++) {
      if(i == index) {
        document.getElementById('group-shown').removeAttribute('id');
        var occupation = group.children[i];
        occupation.setAttribute("id", "group-shown");
      }
    }
  });
}