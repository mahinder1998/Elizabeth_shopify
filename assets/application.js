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




// search toggle start
const searchToggle = document.querySelector(".search_toggle");
const searchWrap = document.querySelector(".search_wrapper");
const searchClose = document.querySelector(".search_close");

searchToggle.addEventListener("click", ()=>{
    searchWrap.classList.add("search_wrapper_active");
}) 

searchClose.addEventListener("click", ()=>{
    searchWrap.classList.remove("search_wrapper_active");
}) 




// cart drawer js start
document.querySelectorAll("form[action='/cart/add']").forEach((form)=>{
    form.addEventListener("submit", async (e)=>{
        console.log(e.currentTarget)
        e.preventDefault();

        // Submit form with ajax
       await fetch("/cart/add",{
            method: "post",
            body: new FormData(form)
        })

        // Open cart drawer
        document.querySelector(".cart-drawer").classList.add("cart-drawer-active");

        // clsoe cart drwer
        document.querySelectorAll(".cart-drawer, .close-drawer").forEach((el)=>{
            el.addEventListener("click", ()=>{
                document.querySelector(".cart-drawer").classList.remove("cart-drawer-active");
            })
        })

        document.querySelector(".cart-drawer-box").addEventListener("click", (e)=>{
            e.stopPropagation();
        })

    })
})