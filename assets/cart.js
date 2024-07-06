formatMoney = function(cents, format) {
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


document.querySelectorAll(".cart-quantity-selector button").forEach((button)=>{
    button.addEventListener("click", ()=>{
        const input = button.parentElement.querySelector("input");
        const value = Number(input.value);
        const isPlus = button.classList.contains("plus");

        const key = button.closest(".table-row").getAttribute('data-key');

        if(isPlus){
            const newValue = value + 1
            input.value = newValue ;
            changeItemQuantity(key, newValue);
        }else if(value > 1){
            const newValue = value - 1;
            input.value = newValue;
            changeItemQuantity(key, newValue);
        }

    })
})


function changeItemQuantity(key, quantity) {
    fetch('/cart/change.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: key,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(res => {

        const format = document.querySelector("[data-money-format]").getAttribute("data-money-format");

        console.log(format);
        
        const totalDiscount = formatMoney(res.total_discount, format);
        const totalPrice = formatMoney(res.total_price, format);
        const item = res.items.find(item => item.key === key);
        const itemPrice = formatMoney(item.final_line_price, format);

    

        document.querySelector("#total-discount").textContent = totalDiscount;
        document.querySelector("#total-price").textContent = totalPrice;
        document.querySelector(`[data-key="${key}"] .line-item-price`).textContent = itemPrice;

        console.log(totalDiscount, totalPrice, item);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
