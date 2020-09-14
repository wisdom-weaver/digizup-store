import React, { useEffect, useState, Fragment } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import queryString from 'query-string'
import { renderIntoDocument } from 'react-dom/test-utils';

import $ from 'jquery';

import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/lib/styles.css'; //Allows for server-side rendering.
import 'react-owl-carousel2/src/owl.carousel.css'; //Allows for server-side rendering.
import 'react-owl-carousel2/src/owl.theme.green.css'; //Allows for server-side rendering.

import { v1 as uuid } from "uuid";
import { addToCartAction, cartMessageReset } from '../store/actions/cartUpdateActions';
import Delayed from '../utils/Delayed';
import { priceFormat } from '../utils/utils';
import { Materialbox } from 'materialize-css';

function Product(props) {
    // console.log(props)
    const history = useHistory();
    // console.log(history,props);
    const {productid} = props.match.params;
    var  query = queryString.parse(history.location.search)
    const [productOption,setProductOption] = useState( query.productOption ?? null);
    useFirestoreConnect([{
        collection: 'products',
        doc: productid ?? 'default',
        storeAs: `product-${productid}`
    }])
    const productFromCollection = useSelector(state=> state.firestore.ordered[`product-${productid}`]) 
    const [product, setProduct] = useState({});
    useEffect(()=>{
        if(!productFromCollection || !productFromCollection[0] ) return;
        setProduct(productFromCollection[0]);
    },[productFromCollection])
    useEffect(()=>{
        if(!product || !product.productName) return ;
        // console.log('product =>',product);
        // console.log('product =>',product.productOptions);
        getRenderedProduct();
    },[product])

    const getOptionIndicesArray = (optionString)=> optionString.split('_').splice(1);
    const getOptionString = (optionIndicesArray) => ('option_'+optionIndicesArray.join('_'));

    const [renderedProduct, setRenderedProduct] = useState({});
    const getRenderedProduct = ()=>{
        if(productid == 'default') return;
        if(product.hasOptions == false){ setRenderedProduct(product); return; }        
        if(product.productOptions[productOption].isActive == false){ console.log('this option is not Active'); return;}
        setRenderedProduct({
            productName: product.productOptions[productOption].productFullName,
            price: product.productOptions[productOption].price,
            images: product.productOptions[productOption].images,
            inStock: product.productOptions[productOption].inStock,
            features: [...product.features, ...getOptionIndicesArray(productOption).map((eaOp,eaOpIndex)=>( product.optionCategoriesObject[product.optionCategories[eaOpIndex]][eaOp].optionFeatures )).reduce((ac,eaAr)=>[...ac,...eaAr],[]) ],
            specs: [...product.specs, ...getOptionIndicesArray(productOption).map((eaOp,eaOpIndex)=>( product.optionCategoriesObject[product.optionCategories[eaOpIndex]][eaOp].optionSpecs )).reduce((ac,eaAr)=>[...ac,...eaAr],[]) ]
        });
    }
    const selectProductOption = (option)=>{
        console.log('request to select', option);
        setProductOption(option);
    }
    const setHistoryToProductOption=(option)=>{ history.push(`/product/${productid}?productOption=${option}`) }
    useEffect(()=>{
        if(!product || product.hasOptions == false || !product?.productOptions || product.productOptions[productOption].isActive == false) return;
        
        getRenderedProduct();
    },[productOption])
    useEffect(()=>{
        return history.listen(()=>{
            query = queryString.parse(history.location.search);
            var localProductOption = query?.productOption || 'default';
            return selectProductOption(localProductOption);
        });
    },[history])

    const authuid = useSelector((state)=>state.firebase.auth.uid) ?? 'default';
    const [cartQuantity, setCartQuantity] = useState(1);
    const handleCartUpdate = (val)=>{
        if(val>=0) setCartQuantity(val)
        else{ setCartQuantity(1) }
    }
    const {addToCart} = props;
    const addingToCart = ()=>{
        if(cartQuantity == 0){ handleCartUpdate(1); return; }
        console.log('adding to cart');
        var newProduct = {
            cartQty      : cartQuantity,
            defaultImage : renderedProduct.images[0] ?? '',
            option       : productOption ?? false,
            productName  : renderedProduct.productName,
            productPrice : renderedProduct.price,
            productid    : productid ?? null ,
            createdAt    : new Date()
        }
        if(!authuid || authuid =='default'){
            alert('Please Login to add this item to cart');
            history.push('/login');
        }else{
            addToCart(newProduct);
            history.push('/cart');
        }
    }
    
    const categoryOptionsSelectionBtns = (product && product.hasOptions && product.optionCategories && product.optionCategoriesObject)?(
        <div className="categoryOptionsSelectionBtnsSection">
            {product.optionCategories.map((eachCat, eachCatIndex)=>(
            <Fragment key={uuid()}>
                <p key={uuid()} className="flow-text head heavy_text">{eachCat} :</p>
                <div className="row-flex-center flex-wrap">
                {product.optionCategoriesObject[eachCat].map((eachCatObj,eachCatObjIndex)=>{
                    var opAr = getOptionIndicesArray(productOption);
                    var isSelected = (getOptionIndicesArray(productOption)[eachCatIndex] == eachCatObjIndex);
                    opAr[eachCatIndex] = eachCatObjIndex;
                    var op = getOptionString(opAr);
                    // console.log(opAr,op);
                    var isAvailable  = product.productOptions[op].isActive;
                    var bestMatch = op;
                    if(!isAvailable){
                        var allOpAr = Object.keys(product.productOptions).sort().map((ea)=> getOptionIndicesArray(ea) );
                        bestMatch = getOptionString(allOpAr.find(eaAr=> (eaAr[eachCatIndex]==eachCatObjIndex && product.productOptions[getOptionString(eaAr)].isActive)))
                    }
                    if(isAvailable && isSelected){
                        return ( <div key={uuid()}  className="category_chip selected">{eachCatObj.optionName}</div> )
                    }else if(isAvailable){
                        return ( <div key={uuid()} onClick={()=>{setHistoryToProductOption(op)}} className="category_chip available">{eachCatObj.optionName}</div> )
                    }else{
                        return ( <div key={uuid()} onClick={()=>{setHistoryToProductOption(bestMatch)}} className="category_chip unavailable">{eachCatObj.optionName}</div> )
                    }
                })}
                </div>
            </Fragment>
            ))}
        </div>
    ):(null);

    const ImageSectionJSX = (renderedProduct && renderedProduct.images)?(
        <div className="image-section">
            <div className="card round-card">
                <div className="card-content">
                <OwlCarousel  options={{
                items: 1,
                nav: false,
                dots: true,
                dotsEach:true,
                rewind: true,
                autoplay: true,
                loop: true,
                }} 
                events={{}} 
            >
                { renderedProduct.images.map((eachImage,index)=> (<div key={uuid()}><img src={eachImage} alt={renderedProduct.productName+"-img"+index}/></div>) ) }
            </OwlCarousel>
                </div>
            </div>
        </div>
    ):(null)

    const InStockJSX = (renderedProduct && renderedProduct.inStock)?(
        <div>
            <hr/>
            <h5 className="green-text heavy_text">In Stock</h5>
            From: <span className="primary-green-light-text">Digizup Exclusive Seller</span>
            <div className="row">
                <div className="col s6 m12 l6 center">
                <div className="quantity-selection-container">
                    <div onClick={()=>{handleCartUpdate(cartQuantity-1)}} className="btn-floating quantity-adjustment-btn"> <i className="material-icons">remove_circle</i> </div>
                    <input value={cartQuantity} onChange={(e)=>{handleCartUpdate(e.target.value)}} className="cart-quantity-input" type="number"/>
                    <div onClick={()=>{handleCartUpdate(cartQuantity+1)}} className="btn-floating quantity-adjustment-btn"> <i className="material-icons">add_circle</i> </div>
                </div>
                </div>
                <div className="col s6 m12 l6 center">
                <div 
                    onClick={()=>{ addingToCart() }}
                    className="btn btn add-to-cart-btn"
                > <i className="material-icons">add_shopping_cart</i> Add to Cart</div>
                </div>
            </div>
            <hr/>
        </div>
    ):(
        <h5 className="primary-red-text heavy_text">Out of Stock</h5>
    )

    const FeaturesJSX = (renderedProduct && renderedProduct.features?(
        <Fragment>
            <h5 className="left-align head regular_text">Features</h5>
            <p className="line-break" key={uuid()}>
            {renderedProduct.features.map((feature,index)=>(
                <Fragment key={uuid()}><span className="head">‣ </span>{feature}{"\n\n"}</Fragment>
            ))}
            </p>
        </Fragment>
    ):(null))

    const SpecsJSX= (renderedProduct && renderedProduct.specs?(
        <Fragment>
            <h5 className="left-align head regular_text">Specs</h5>
            <table>
            <tbody>
            {renderedProduct.specs.map((spec,index)=>(
                <tr key={uuid()}>
                    <td className="primary-green-dark-bg white-text" >{spec.specKey}</td>
                    <td className="white head" >{spec.specValue}</td>
                </tr>
            ))}
            </tbody>
            </table>
        </Fragment>
    ):(null))

    const DescriptionJSX= (renderedProduct && renderedProduct.description?(
        <Fragment>
            <h5 className="left-align head regular_text">Description</h5>
            <div className="container">
                <p className="line-break">{renderedProduct.description}</p>
            </div>
        </Fragment>
    ):(null))

    return (
        <div className="Product Page">
            {(renderedProduct && renderedProduct.productName)
            ?(
            <div className="container">
                <div className="top-row">
                    {ImageSectionJSX}
                    <div className="product-section">
                        <h4 className="center head light_text">{renderedProduct.productName}</h4>
                        <h4 className="right-align head heavy_text">{priceFormat(renderedProduct.price)}</h4>
                        {categoryOptionsSelectionBtns}
                        {InStockJSX}
                        {FeaturesJSX}
                    </div>
                </div>
                {DescriptionJSX}
                {SpecsJSX}
            </div>
            )
            :(null)}
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {
        cartUpdate: state.cartUpdate
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
        addToCart: (newProduct)=>{ dispatch( addToCartAction(newProduct) ) },
        cartMessageReset: ()=>{ dispatch( cartMessageReset() ) }
    }
}

export default 
compose(
    connect(mapStateToProps,mapDispatchToProps),
    withRouter
)(Product)
