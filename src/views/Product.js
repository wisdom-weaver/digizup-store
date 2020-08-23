import React, { useEffect, useState } from 'react'
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

function Product(props) {
    const {productid} = props.match.params;
    const [productOption, setProductOption] = useState(queryString.parse(props?.location?.search)?.productOption);
    
    const history = useHistory();
    const {addToCart} = props;
    useFirestoreConnect([
        {collection: 'products', doc: productid}
    ])
    const product = useSelector(({firestore:{data}})=> data.products && data.products[productid] )
    const [optionsIndexArray, setOptionsIndexArray] = useState(false);
    const [renderedProduct, setRenderedProduct] = useState(false);
    
    const toOptionIndexArray = (optionString)=>{
        return optionString?.split('_').slice(1);
    }
    const toOptionString = (array)=>{
        return "option"+array?.reduce((acum, each)=> acum+="_"+each, '');
    }


    useEffect(()=>{
        if(!productOption) return;
        var proopar = toOptionIndexArray(productOption) ;
        history.push('/product/'+productid+"?productOption="+productOption);
        setOptionsIndexArray(proopar);
    },[productOption])
    useEffect(()=>{ 
        if(!product) return;
        // console.log('product',product);
        if(product.optionCategories){
            setOptionsIndexArray(toOptionIndexArray(productOption));
        }else{
            setRenderedProduct(product)
        }

    },[product])
    useEffect(()=>{
        if(!product && !optionsIndexArray) return;
        // console.log('optionsIndexArray',optionsIndexArray);
        setRenderedProduct( getRenderableProduct() );
        
    },[optionsIndexArray])
    useEffect(()=>{
        if(!renderedProduct) return;
        // console.log('renderedProduct',renderedProduct);
    },[renderedProduct]);
    

    const getRenderableProduct = ()=>{
        if(!product) return;
        var options = product?.optionCategories;
        if(!options){ return product;}

        if( options && !productOption){
            var productOption_def = "option"+Array(options.length).fill().reduce((acum, each)=> acum+="_0", '');
            history.push('/product/'+productid+'?productOption='+productOption_def);
            setOptionsIndexArray(toOptionIndexArray(productOption_def));
            setProductOption(productOption_def);
        }
        if(!optionsIndexArray) return;
        var allOptionSpecs = optionsIndexArray?.reduce((acc ,optionIndex, index)=>  ({...acc, ...product[product.optionCategories[index]][optionIndex]?.optionSpecs}) , {});
        var allOptionFeatures = optionsIndexArray?.reduce((acc ,optionIndex, index)=>  {
            var optionFeatures = product[product.optionCategories[index]][optionIndex]?.optionFeatures;
            if(!optionFeatures) return acc;
            return acc.concat(optionFeatures)
        } , []);
        
        var outputProduct = {
            productName: product[productOption].productFullName,
            price: product[productOption].price,
            description: product.description,
            features: product.features.concat(allOptionFeatures),
            specs: {...product.specs, ...allOptionSpecs},
            images: product[productOption].images,
            inStock: product[productOption].inStock
        }
        return outputProduct;
    }
    
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

    const selectOption = (eachOptionIndex,eachOptionElementIndex)=>{
        var newArr = optionsIndexArray;
        newArr[eachOptionIndex] = eachOptionElementIndex;
        // console.log(newArr);
        var newProductOption = toOptionString(newArr);
        // console.log(newProductOption);
        handleCartUpdate(1);
        setProductOption(newProductOption);
    }
    
    const [cartQuantity, setCartQuantity] = useState(1);

    const handleCartUpdate = (val)=>{
        if(val> 0) setCartQuantity(val)
        else{ setCartQuantity(1) }
    }
    
    const cartMessage = props?.cartUpdate?.cartMessage
    
    useEffect(()=>{
        if(cartMessage == 'CART_ADDED'){
            cartMessageReset();
        }
    },[cartMessage])


    const options = {
        items: 1,
        nav: true,
        rewind: true,
        autoplay: true
    };
    
    const events = { };

    const renderedProductJSX = renderedProduct && (
        <div className="row product-row-1">
           <div className="col s12 m5">
                <div className="product-image-section">
                    <div className="product-image-container">
                        {/* <img className="product-image" src={renderedProduct.images[0]} alt=""/> */}
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
           <div className="col s12 m7">
                <h5 className="primary-green-light-text light_text">{renderedProduct.productName}</h5>
                {priceFormat(renderedProduct.price)}
                {
                    (product.optionCategories)?(
                        <div className="product-options-section">
                            { 
                                product.optionCategories.map((eachOption,eachOptionIndex)=>(
                                <div key={uuid()} className="product-each-option-container">
                                    <p className="primary-green-light-text">{eachOption} : </p>
                                    {
                                        product[eachOption].map((eachOptionElement,eachOptionElementIndex) => {
                                            if(optionsIndexArray[eachOptionIndex] == eachOptionElementIndex){
                                                return (<div key={uuid()} className="btn btn-small product-each-option-element active">{eachOptionElement.optionName}</div>)
                                            }else{
                                                return (<div key={uuid()}
                                                onClick={()=>{ selectOption(eachOptionIndex, eachOptionElementIndex); }}
                                                className="btn btn-small product-each-option-element">{eachOptionElement.optionName}</div>)
                                            }
                                        })
                                    }
                                </div>
                                )) 
                            }
                        </div>
                    ):(
                        <p></p>
                    )
                }
                <hr/>
                {(renderedProduct.inStock)?(
                    <div>
                        <h5 className="green-text heavy_text">In Stock</h5>
                        From: <span className="primary-green-light-text">Digizup Exclusive Seller</span>
                        <div className="product-quantity-selection">
                            <div className="quantity-selection-container">
                                <div onClick={()=>{handleCartUpdate(cartQuantity-1)}} className="btn-floating quantity-adjustment-btn"> <i className="material-icons">remove_circle</i> </div>
                                <input value={cartQuantity} onChange={(e)=>{handleCartUpdate(e.target.value)}} className="cart-quantity-input" type="number"/>
                                <div onClick={()=>{handleCartUpdate(cartQuantity+1)}} className="btn-floating quantity-adjustment-btn"> <i className="material-icons">add_circle</i> </div>
                            </div>
                            <div 
                                onClick={(e)=>{
                                    console.log('adding to cart');
                                    addToCart(productid, productOption, cartQuantity);
                                    history.push('/cart');
                                }}
                                className="btn btn add-to-cart-btn"
                            > <i className="material-icons">add_shopping_cart</i> Add to Cart</div>
                        </div>
                    </div>
                ):(
                    <h5 className="red-text heavy_text">Out of Stock</h5>
                )}
                {(renderedProduct?.features)?(
                <div className="col s12 product-features-section">
                    <h5 className="primary-green-dark-text">Features</h5>
                    <ul>
                        { renderedProduct.features.map((feature)=>( <li key={uuid()}> <p className="line-break"> <span className="primary-green-light-text">{"\u2023 "}</span> {feature+"\n"}</p> </li> )) }
                    </ul>
                    <hr/>
                </div>
                ):(null)}
           </div>
            {(renderedProduct?.description)?(
            <div className="col s12 product-description-section">
                <h5 className="primary-green-dark-text">Description</h5>
                <p>{renderedProduct.description}</p>
                <hr/>
            </div>
            ):(null)}

            {(renderedProduct?.specs)?(
            <div className="col s12 product-specs-section">
                <h5 className="primary-green-dark-text">Specs</h5>
                <table>
                    <tbody>
                    {Object.keys(renderedProduct.specs).map((eachspec=>(<tr key={uuid()}><th>{eachspec}</th><td>{renderedProduct.specs[eachspec]}</td></tr>)))}
                    </tbody>
                </table>
                <hr/>
            </div>
            ):(null)}

        </div>
    );

    return (
        <div className='Product Page'>
            <div className="container">
                {
                    (isLoaded(product))
                    ?( isLoaded(renderedProduct)?(renderedProductJSX):( <p>Product Not Found</p> ) )
                    :( <p>Loading...</p> )
                }
            </div>
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
        addToCart: (productid, option, cartQty)=>{ dispatch( addToCartAction(productid, option, cartQty) ) },
        cartMessageReset: ()=>{ dispatch( cartMessageReset() ) }
    }
}

export default 
compose(
    connect(mapStateToProps,mapDispatchToProps),
    withRouter
)(Product)
