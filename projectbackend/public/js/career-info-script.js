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

function expandList() {
  var ul = this;
  var li = this.getElementsByTagName("li");
  for(var i=0;i<li.length;i++) {
    li[i].style.display = "";
  }
  var height = ul.scrollHeight;
  this.style.overflow = "";
  this.style.height = height + "px";
}
function collapseList() {
  var ul = this;
  var li = this.getElementsByTagName("li");
  /* Calculating the heights of the lists if collapsed */
  for(var j=0;j<li.length;j++) {
    if(j > 1) {
      li[j].style.display = "none";
    }
  }
  this.style.overflow = "hidden";
  console.log(initial);
  this.style.height = "96" + "px";
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
  var initial = lists[i].style.height;
  lists[i].style.height = initial + "px";
  console.log(initial);
  lists[i].addEventListener('mouseenter', function() {
    var ul = this;
    var li = this.getElementsByTagName("li");
    for(var i=0;i<li.length;i++) {
      li[i].style.display = "";
    }
    var height = ul.scrollHeight;
    this.style.overflow = "";
    this.style.height = height + "px";
  }, false);
  lists[i].addEventListener('mouseleave', function() {
    var ul = this;
    var li = this.getElementsByTagName("li");
    /* Calculating the heights of the lists if collapsed */
    for(var j=0;j<li.length;j++) {
      if(j > 1) {
        li[j].style.display = "none";
      }
    }
    this.style.overflow = "hidden";
    console.log(initial);
    this.style.height = "96" + "px";
  }, false);
  // lists[i].addEventListener('mouseenter', function() {
  //   expandList(lists[i]);
  // }, false);
  // lists[i].addEventListener('mouseleave', function() {
  //   collapseList(lists[i], initial);
  // }, false);
}
