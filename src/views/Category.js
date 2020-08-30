import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase';
import { db } from '../config/FirebaseConfig';

function Category(props) {
    const category = props.match.params.category ?? 'all';
    const categoriesCollection = useSelector(state=>state.firestore.ordered.categories);
    const [cat , setCat] = useState(null);
    const productsCollection = [];
    
    useEffect(()=>{
        console.log(categoriesCollection);
        if(!categoriesCollection) return;
        setCat( categoriesCollection.find((each)=>each.urlid==category) );
    },[categoriesCollection])
    useEffect(()=>{
        if(!cat)return;
        console.log({cat});
        getProductsCollection();
    },[cat])
    
    var [categoryProducts,setCategoryProducts] = useState(null??[]);
    const getProductsCollection = async ()=>{
        var keywords = [category,cat?.title];
        console.log({keywords});
        const snaps = await db.collection('products').where('categories','array-contains-any',keywords).get();
        if(snaps.empty){console.log('empty');return; }
        var localProducts = [];
        snaps.forEach(doc=>{
            localProducts.push(doc.data());
        })
        setCategoryProducts(localProducts);
    }
    

    return (
        <div className="Category Page" >
            <p className="flow-text">{category}</p>
            <p>{JSON.stringify(cat)}</p>
            <p>{JSON.stringify(categoryProducts)}</p>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {}
}

export default  
compose(
    connect(mapStateToProps, null),
    firestoreConnect([
        {collection: 'categories'}
    ]),
    withRouter
)(Category)
