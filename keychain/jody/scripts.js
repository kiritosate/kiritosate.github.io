// Get the button
var mybutton = document.getElementById("scrollBtn");

// When the user scrolls down 20px from the top of the document, show the button
document.body.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

var show = document.getElementById("show");

var a = 1;

document.getElementById("show").addEventListener("click", function() {
    if(a==1){
        show.innerText = "show anime";
        a=0;
        document.querySelector(".anime").style.display = "inline";
        document.querySelector(".cat").style.display = "none";
    }else if(a==0)
    {
        show.innerText = "show cats";
        a=1;
        document.querySelector(".anime").style.display = "none";
        document.querySelector(".cat").style.display = "inline";
    }
});
