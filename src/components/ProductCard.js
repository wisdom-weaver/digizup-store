import React from 'react'
import $ from 'jquery';
import M from 'materialize-css';
import 'materialize-css';
import { Card, CardTitle, Icon } from 'react-materialize';
import CurrencyFormat from 'react-currency-format';

function ProductCard({product}) {
    const {productName, price, defaultImage, rating} = product;
    const numberFormat = (value) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(value);
    const priceFormat = (price)=>{
      var formatted = numberFormat(price);
      var symbol = formatted[0];
      var integer = formatted.split('.')[0].slice(1);
      var decimal = formatted.split('.')[1];
      return (
        <h5 className="product-price">
          {symbol+" "+integer+"."}<sub>{decimal}</sub>
        </h5>
      )
    }
    return (
        <div className="ProductCard">
            <Card
              header={<CardTitle image={defaultImage} />}
              horizontal
            >
              <h6 className="product-productName">{productName}</h6>
              
              {priceFormat(price)}
              
              <div className="product-rating">
                  {Array(Math.round(rating)).fill().map((_)=>(<span>🌟</span>))} 
                  {Array(5-Math.round(rating)).fill().map((_)=>(<span>★</span>))} 
                  <span className="rating-numbers">{" "+rating} rating</span>
              </div>
            </Card>
        </div>
    )
}

export default ProductCard
