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

// open cart drawer
function openCartDrawer() {
    document.querySelector(".cart-drawer").classList.add("cart-drawer-active");
}

// close cart drawer
function closeCartDrawer() {
    document.querySelectorAll(".cart-drawer, .close-drawer").forEach((el) => {
        el.addEventListener("click", () => {
            document.querySelector(".cart-drawer").classList.remove("cart-drawer-active");
        })
    })
}
// update cart drawer
async function updateCartDrawer() {
    const res = await fetch("/?section_id=cart-drawer");
    const text = await res.text();

    const html = document.createElement("div");
    html.innerHTML = text;

    const newBox = html.querySelector(".cart-drawer").innerHTML;
    document.querySelector('.cart-drawer').innerHTML = newBox;
    addCartDrawerListener();
}

// update cart count
function updateCartItemCount(count) {
    document.querySelectorAll(".cart_count").forEach((el) => {
        el.innerHTML = count;
        if (el.innerHTML == 0) {
            el.style.display = "none";
        }

    });
}

function addCartDrawerListener() {
    // update quantity
    document.querySelectorAll(".cart-drawr-quantity-selector button").forEach((button) => {
        button.addEventListener("click", async () => {
            // Get line item key
            const rootItem = button.closest(".cart-items");
            const key = rootItem.getAttribute('data-line-item-key');
            // Get new quantity
            const currentQuantity = Number(button.parentElement.querySelector("input").value);
            const isUp = button.classList.contains("cart-drawr-quantity-selector-plus");
            const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;

            console.log(key, newQuantity)

            // Ajax update
            const res = await fetch('/cart/update.js', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    updates: {
                        [key]: newQuantity
                    }
                }),

            });

            const cart = await res.json();

            updateCartItemCount(cart.item_count)

            // update cart            
            updateCartDrawer()

        })
    })

    document.querySelector(".cart-drawer-box").addEventListener("click", (e) => {
        e.stopPropagation();
    })

    // clsoe cart drwer
    closeCartDrawer();
}
addCartDrawerListener();

document.querySelectorAll("form[action='/cart/add']").forEach((form) => {
    form.addEventListener("submit", async (e) => {
        console.log(e.currentTarget)
        e.preventDefault();

        // Submit form with ajax
        await fetch("/cart/add", {
            method: "post",
            body: new FormData(form)
        })


        // Get cart count
        const resp = await fetch('/cart.js');
        const cart = await resp.json();

        updateCartItemCount(cart.item_count);


        // update cart
        await updateCartDrawer();

        // Open cart drawer
        openCartDrawer();


    })
})



// money formatter

var formatMoney = function(cents, format) {
    if (typeof cents == 'string') { cents = cents.replace('.',''); }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || this.money_format);
  
    function defaultOption(opt, def) {
       return (typeof opt == 'undefined' ? def : opt);
    }
  
    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ',');
      decimal   = defaultOption(decimal, '.');
  
      if (isNaN(number) || number == null) { return 0; }
  
      number = (number/100.0).toFixed(precision);
  
      var parts   = number.split('.'),
          dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
          cents   = parts[1] ? (decimal + parts[1]) : '';
  
      return dollars + cents;
    }
  
    switch(formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
    }
  
    return formatString.replace(placeholderRegex, value);
  };