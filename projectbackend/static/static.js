$('.text-paragraph').find('a[href="#"]').on('click', function (e) {
    e.preventDefault();
    this.expand = !this.expand;
    $(this).text(this.expand?"Click to collapse":"Click to read more");
    $(this).closest('.text-paragraph').find('.small, .big').toggleClass('small big');
});
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