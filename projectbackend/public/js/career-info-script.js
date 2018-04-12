var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

showSlides(slideIndex);

function expandList(hi) {
  var ul = hi;
  var li = ul.getElementsByTagName("li");
  for(var i=0;i<li.length;i++) {
    li[i].style.display = "";
  }
  var height = ul.scrollHeight;
  hi.style.overflow = "";
  hi.style.height = height + "px";
}
function collapseList(hi, initial) {
  var ul = hi;
  var li = hi.getElementsByTagName("li");
  /* Calculating the heights of the lists if collapsed */
  for(var j=0;j<li.length;j++) {
    if(j > 1) {
      li[j].style.display = "none";
    }
  }
  hi.style.overflow = "hidden";
  console.log(initial);
  hi.style.height = initial + "px";
}

var lists = document.getElementsByClassName("list");

for(var i=0;i<lists.length;i++) {
  var li = lists[i].getElementsByTagName("li");
  /* Calculating the heights of the lists if collapsed */
  for(var j=0;j<li.length;j++) {
    if(j > 1) {
      li[j].style.display = "none";
    }
  }
  lists[i].style.overflow = "hidden";
  var initial = lists[i].scrollHeight;
  lists[i].style.height = initial + "px";
  lists[i].addEventListener('mouseenter', function() {
    expandList(lists[i]);
  }, false);
  lists[i].addEventListener('mouseleave', function() {
    collapseList(lists[i], initial);
  }, false);
}
