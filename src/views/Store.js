import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'

import $ from 'jquery'
import M from 'materialize-css';
import { Dropdown, Button, Divider, Icon } from "react-materialize";
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import ProductCard from '../components/ProductCard';
import {v1 as uuid } from 'uuid';

function Store(props) {
    const {products, isLoaded} = props;
    const [exportProducts,setExportProducts] = useState([]);
    useEffect(() => {
      setExportProducts(exportingProducts());
    }, [products])

    

    const exportingProducts = ()=>{
      var renderableProducts = []
      if(products){
         products.forEach(product=>{
           if(product.options){
            var productOptions = Object.keys(product).filter((each)=>each.startsWith('option_')).sort();
            productOptions.forEach(each=>{
              var productForCard = {
                productName: product[each].productFullName,
                price: product[each].price,
                defaultImage: product[each].images[0],
                rating: 4.2,
                id: product.id,
                option: each
              }
              renderableProducts.push(productForCard);
            })
          }else{
            var productForCard = {
              productName: product.productName,
              price: product.price,
              defaultImage: product.images[0],
              rating: 4.2,
              id: product.id,
              option: false
            }
            renderableProducts.push(productForCard);
          }
         })
       }else{
         console.log('product not present')
       }
       return renderableProducts;
    }
    
    return (
        <div className="Store Page">
            <div className="products-container container">
              {
                exportProducts?(
                  exportProducts.map(eachProduct=>(<ProductCard key={uuid()} product={eachProduct} />))
                ):( <p>no products found</p> )
              }
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
  return {
    products: state.firestore.ordered.products,
    isLoaded: true
  }
}

export default compose(
  firestoreConnect([
    { collection : 'products' }
  ]),
  connect(mapStateToProps, null)
)
(Store)
