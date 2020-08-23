import React from 'react'

export const numberFormat = (value) =>
new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
}).format(value);

export const priceFormat = (price)=>{
    var formatted = numberFormat(price);
    var symbol = formatted[0];
    var integer = formatted.split('.')[0].slice(1);
    var decimal = formatted.split('.')[1];
    return (
      <span className="product-price">
        {symbol+" "+integer+"."}<sub>{decimal}</sub>
      </span>
    )
}