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
    const {search, products, isLoaded} = props;
    const {searchError, searchResults, searchTerm, searchMessage} = search;
    useEffect(()=>{
      // console.log('search',search);
    },[search])
    
    return (
        <div className="Store Page">
            <div className="products-container container">
              {searchResults && searchResults.map(product=>( 
                <ProductCard key={uuid()} product={product} /> 
              ))}
              {
                (searchMessage == 'SEARCH_RESULTS_NOT_FOUND')
                ?( <p>{searchError}</p> ):null
              }
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
  console.log(state);
  return {
    search: state.search,
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
