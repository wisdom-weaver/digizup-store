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
import queryString from 'query-string'
import { withRouter, useHistory } from 'react-router-dom';
import { searchAction, searchResetAction } from '../store/actions/searchActions';


function Store(props) {
    const history = useHistory();
    var query = queryString.parse(props?.location?.search)
    const searchTerm =query?.searchTerm ?? ''; 
    const category =query?.category ?? 'All'; 
    // console.log('seachTerm form store page', searchTerm);
    const {search, searchAction, searchReset} = props;
    const {searchError, searchResults, searchMessage} = search;
    useEffect(()=>{
      searchReset();
      if(searchTerm == ''){
        history.push('/store/all');
      }else{
        searchAction(searchTerm,category);
      }
    },[searchTerm,category])
    useEffect(()=>{
      console.log("searchState=>",{searchMessage, searchError, searchResults});
    },[searchMessage,searchError, searchResults])
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
              {
                (searchMessage == 'SEARCH_IN_PROGRESS' )
                ?( <p>Loading...</p> ):null
              }
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
  // console.log(state);
  return {
    search: state.search,
    products: state.firestore.ordered.products,
    isLoaded: true
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    searchAction: (searchTerm, category)=>{ dispatch( searchAction(searchTerm,category) ) },
    searchReset: ()=>{ dispatch( searchResetAction() ) }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter  
)
(Store)

