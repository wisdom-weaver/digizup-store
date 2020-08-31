import React from 'react'
import $ from 'jquery';
import M from 'materialize-css';
import 'materialize-css';
import { Card, CardTitle, Icon } from 'react-materialize';
import CurrencyFormat from 'react-currency-format';
import { useHistory } from 'react-router-dom';

import { v1 as uuid } from 'uuid';

function ProductCard({product}) {
    const {productName, id, option, price, defaultImage, rating} = product;
    
    const history= useHistory();
    
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

    const redirectToProductPage = ()=>{
      var target = '/product/'+id+(option?("?productOption="+option):(''))
      history.push(target);
    }

    return (
        <div className="ProductCard">
            <Card 
              className="round-card"
              onClick={redirectToProductPage}
              header={<CardTitle image={defaultImage} />}
              horizontal
            >
              <h6 className="product-productName">{productName}</h6>
              
              {priceFormat(price)}
              
              <div className="product-rating">
                  {Array(Math.round(rating)).fill().map((_)=>(<span key={uuid()} >🌟</span>))} 
                  {Array(5-Math.round(rating)).fill().map((_)=>(<span  key={uuid()} >★</span>))} 
                  <span className="rating-numbers">{" "+rating} rating</span>
              </div>
            </Card>
        </div>
    )
}

export default ProductCard
