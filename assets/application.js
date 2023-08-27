// Put your application javascript here

// mobile nav

let mobileButton = document.querySelector(".mobile-menu-btn");
let mobileNavbar = document.querySelector(".mobile-menu-wrap");
let closeButton = document.querySelector(".close-menu"); 

let submenuButton = document.querySelectorAll(".mobile-submenu-btn");



mobileButton.addEventListener("click", function(){
    mobileNavbar.classList.remove("hidden");
})
closeButton.addEventListener("click", function(){
    mobileNavbar.classList.add("hidden");
})


submenuButton.forEach(toggle =>{
    toggle.addEventListener("click", function(e){
        e.preventDefault();
        const submenu = this.parentNode.querySelector('.submenu-items');
        console.log(submenu, 'submenu')
        submenu.classList.toggle('submenu-open');
    })
})

