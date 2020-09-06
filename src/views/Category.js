import React, { useEffect, useState, Fragment } from 'react'
import { connect, useSelector } from 'react-redux'
import { withRouter, NavLink } from 'react-router-dom'
import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase';
import { db } from '../config/FirebaseConfig';
import 'materialize-css';
import { Carousel, Icon, Modal, Button } from 'react-materialize';
import CatProductCard from '../components/CatProductCard';
import { v1 as uuid } from 'uuid';
import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/lib/styles.css'; //Allows for server-side rendering.
import 'react-owl-carousel2/src/owl.carousel.css'; //Allows for server-side rendering.
import 'react-owl-carousel2/src/owl.theme.green.css'; //Allows for server-side rendering.
import Delayed from '../utils/Delayed';

function Category(props) {
    const category = props.match.params.category ?? 'all';
    const categoriesCollection = useSelector(state=>state.firestore.ordered.categories);
    const [cat , setCat] = useState(null);
    const productsCollection = [];
    var [categoryProducts,setCategoryProducts] = useState(null??[]);
    useEffect(()=>{
        console.log('category=>', category);
        if(!categoriesCollection) return;
        setCat( categoriesCollection.find(each=>(category==each.title || category==each.urlid)) );
        setCategoryProducts([]);
    },[category]);
    useEffect(()=>{
        if(!categoriesCollection) return;
        setCat( categoriesCollection.find(each=>(category==each.title || category==each.urlid)) );
    },[categoriesCollection])
    useEffect(()=>{
        if(!category || !cat || !categoriesCollection) return;
        getProductsCollection();
    },[cat])

    const getProductsCollection = async ()=>{
        var keywords = [category,cat?.title];
        console.log({keywords});
        const snaps = await db.collection('products').where('categories','array-contains-any',keywords).get();
        if(snaps.empty){console.log('empty');return; }
        var localProducts = [];
        snaps.forEach(doc=>{
            var data = doc.data();
            var pro = {};
            if(data.hasOptions == true){
                var options = Object.keys(data.productOptions).sort().filter(each=>data.productOptions[each].isActive);
                var randOption = options[ Math.floor(Math.random()*options.length) ];
                pro={
                    productName: data.productOptions[randOption].productFullName,
                    defaultImage: data.productOptions[randOption].images[0],
                    price: data.productOptions[randOption].price,
                    productid: doc.id,
                    productOption: randOption,
                    hasOptions: true
                }
            }else{
                pro={
                    productName: data.productName,
                    defaultImage: data.images[0],
                    price: data.price,
                    productid: doc.id,
                    productOption: false,
                    hasOptions: false
                }
            }
            localProducts.push(pro);
        })
        console.log('localProducts',localProducts);
        setCategoryProducts(localProducts);
    }
    
    const CategoryBannerJSX = (cat&& cat?.banner && cat.banner.length>0)?(
        <div className="banner-carousel">
            <OwlCarousel  options={{
                items: 1,
                nav: false,
                dots: false,
                dotsEach:false,
                rewind: true,
                autoplay: true,
                loop: true,
                }} 
                events={{}} 
            >
                { cat.banner.map((each,index)=> (<div key={uuid()}><img src={each.image}/></div>) ) }
            </OwlCarousel>
        </div>
    ):(null)

    const CategoryProductsJSX = (cat && categoryProducts)?(
        <div className="container">
        <div className={(cat.banner && cat.banner.length>0)?('categoriesProductsSection flyover-banner'):('categoriesProductsSection')}>
            <div className="row">
                {categoryProducts.map(each=>( 
                    <div key={uuid()} className="col s6 m4 l3">
                        <CatProductCard product={each} />
                    </div>
                 ))}

            </div>
        </div>
        </div>

    ):(null)
    const CategoryPageJSX = (cat)?(
        <Fragment>
            {CategoryBannerJSX}
            {CategoryProductsJSX}
        </Fragment>
    ):(
        <div className="row">
            <div className="col s12 m6 offset-m2">
                <div className="card round-card">
                    <div className="card-content">
                        <h6 className="center">Sorry this category doesnot exist</h6>
                        <div className="center">
                            <NavLink to="/store"> <div className="btn dark_btn">Visit Store</div> </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="Category Page" >
            
            <Delayed waitBeforeShow={2000} >
                {CategoryPageJSX}
            </Delayed>
            
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
