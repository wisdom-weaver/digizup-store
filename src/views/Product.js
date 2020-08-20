import React, { useEffect, useState } from 'react'
import { withRouter, useHistory } from 'react-router-dom'
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

import queryString from 'query-string'
import { renderIntoDocument } from 'react-dom/test-utils';

import { v1 as uuid } from "uuid";

function Product(props) {
    const {productid} = props.match.params;
    const [productOption, setProductOption] = useState(queryString.parse(props?.location?.search)?.productOption);
    
    const history = useHistory();

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
        console.log('product',product);
        if(product.options){
            setRenderedProduct(product)
        }else{
            setOptionsIndexArray(toOptionIndexArray(productOption));
        }

    },[product])
    useEffect(()=>{
        if(!product && !optionsIndexArray) return;
        console.log('optionsIndexArray',optionsIndexArray);
        setRenderedProduct( getRenderableProduct() );
        
    },[optionsIndexArray])
    useEffect(()=>{
        if(!renderedProduct) return;
        console.log('renderedProduct',renderedProduct);
    },[renderedProduct]);
    

    const getRenderableProduct = ()=>{
        if(!product) return;
        var options = product?.options;
        if(!options){ return product;}

        if( options && !productOption){
            // productOption = "option"+Array(options.length).fill().reduce((acum, each)=> acum+="_0", '');
            history.push('/product/'+productid+'?productOption='+productOption);
        }
        console.log('productOption',productOption);
        var allOptionSpecs = optionsIndexArray.reduce((acc ,optionIndex, index)=>  ({...acc, ...product[product.options[index]][optionIndex]?.optionSpecs}) , {});
        var allOptionFeatures = optionsIndexArray.reduce((acc ,optionIndex, index)=>  {
            var optionFeatures = product[product.options[index]][optionIndex]?.optionFeatures;
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
        console.log(newArr);
        var newProductOption = toOptionString(newArr);
        console.log(newProductOption);
        setProductOption(newProductOption);
    }

    const renderedProductJSX = renderedProduct && (
        <div className="row product-row-1">
           <div className="col s12 m4">
                <div className="product-image-section">
                    <div className="product-image-container">
                        <img className="product-image" src={renderedProduct.images[0]} alt=""/>
                    </div>
                </div>
           </div>
           <div className="col s12 m6">
                <h5 className="primary-green-light-text light_text">{renderedProduct.productName}</h5>
                {priceFormat(renderedProduct.price)}
                {
                    (product.options)?(
                        <div className="product-options-section">
                            { 
                                product.options.map((eachOption,eachOptionIndex)=>(
                                <div className="product-each-option-container">
                                    <p className="primary-green-light-text">{eachOption} : </p>
                                    {
                                        product[eachOption].map((eachOptionElement,eachOptionElementIndex) => {
                                            if(optionsIndexArray[eachOptionIndex] == eachOptionElementIndex){
                                                return (<div className="btn btn-small product-each-option-element active">{eachOptionElement.optionName}</div>)
                                            }else{
                                                return (<div 
                                                onClick={()=>{ selectOption(eachOptionIndex, eachOptionElementIndex) }}
                                                className="btn btn-small product-each-option-element">{eachOptionElement.optionName}</div>)
                                            }
                                        })
                                    }
                                </div>
                                )) 
                            }
                        </div>
                    ):(
                        <p>no options</p>
                    )
                }
                {(renderedProduct.inStock)?(
                    <h6 className="green-text">In Stock</h6>
                ):(
                    <h6 className="red-text">Out of Stock</h6>
                )}
                <hr/>
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
           <div className="col s12 m2">
               add to cart
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
                    {Object.keys(renderedProduct.specs).map((eachspec=>( <tr> <th>{eachspec}</th>  <td>{renderedProduct.specs[eachspec]}</td> </tr> )))}
                </table>
                <hr/>
            </div>
            ):(null)}

        </div>
    );

    return (
        <div className='Product Page'>
        <button onClick={()=>{setProductOption('option_0_0')}} >{productOption}</button>
            <div className="container">
                {(renderedProduct)
                ?( renderedProductJSX )
                :( <p>Product not found</p> )}
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {

    }
}

const mapDispatchToProps = ()=>{
    return {

    }
}

export default 
compose(
    connect(mapStateToProps,null),
    withRouter
)(Product)
