import React, { useState, useEffect } from 'react'
import { NavLink, useHistory, withRouter } from 'react-router-dom'
import {v1 as uuid} from 'uuid';
import { connect, useSelector } from 'react-redux';

import Cart from "@material-ui/icons/AddShoppingCart";
import Close from '@material-ui/icons/CloseRounded';
import Menu from '@material-ui/icons/MenuRounded';

import $ from 'jquery'
import M from 'materialize-css';
import { Dropdown, Button, Divider, Collapsible, CollapsibleItem, Icon } from "react-materialize";

import { firebaseConnect, firestoreConnect, useFirestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { logoutAction } from '../store/actions/authActions';
import { searchAction, searchResetAction } from '../store/actions/searchActions';
import queryString from "query-string";
import _ from 'lodash';

function Navbar(props) {
    const { auth,profile, logout, search, searchReset} = props ;
    const [categories, setCategories] = useState(null);
    const history = useHistory()
    const [cartCount,setCartCount] = useState(0);
    useEffect(()=>{
      if(!props?.categories) return;
      // console.log(props.categories);
      var sortedCategories = props.categories;
      var allCategory = sortedCategories.filter(each=>(each.title =='All'));
      sortedCategories = _.orderBy( sortedCategories, ['title'], ['asc']);
      sortedCategories = sortedCategories.filter(each=>each.title!='All');
      sortedCategories = allCategory.concat(sortedCategories);
      // console.log(sortedCategories);
      setCategories(sortedCategories);
    },[props.categories])
    
    const authuid = useSelector(state=> state.firebase.auth.uid ) ?? 'default';
    useFirestoreConnect([{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'cart'}],
        storeAs: 'cart'
    }]);
    useFirestoreConnect([{
      collection: 'users',
      doc: authuid,
      subcollections: [{collection:'orders'}],
      storeAs: 'orders'
    }]);
    const cart =  useSelector(state=> state.firestore.ordered.cart) ?? []
    useEffect(()=>{
      var localCartCount = cart.reduce((tot,each)=>(parseInt(parseInt(tot)+parseInt(each.cartQty))),0);
      setCartCount(localCartCount);
    },[cart])

    const [menuOpenState, setMenuOpenState] = useState(false);
    const [category, setCategory] = useState('All');
    const [searchTerm,setSearchTerm] = useState('');
    var query = queryString.parse(props?.location?.search);
    useEffect(()=>{
      setSearchTerm(query?.searchTerm ?? '');
    },[query?.searchTerm]);
    useEffect(()=>{
      setCategory(query?.category ?? 'All');
    },[query?.category]);
    
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);


    const menuOpen = ()=>{
      //console.log('menu-open');
      $('.side_menu').css('zIndex', '2900');
      $('.side_menu_content').css('transform', 'translateX(0%)');
      $('.overlay').css('opacity', '1');
    }
    const menuClose = ()=>{
      //console.log('menu-close');
      $('.side_menu_content').css('transform', 'translateX(-100%)');
      $('.overlay').css('opacity', '0');
      setTimeout(()=>{
        $('.side_menu').css('zIndex', '-1');
      },200)
    }

    const updateWidthAndHeight = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    
    useEffect(()=>{
      menuOpenState? menuOpen() : menuClose();
    },[menuOpenState])
    
    useEffect(()=>{
      $('link').click(()=>{ console.log('link Click'); setMenuOpenState(false)})
      $('ovelayLink').click(()=>{ console.log('link Click');; setMenuOpenState(false)})
      window.addEventListener("resize", updateWidthAndHeight);
      return () => {
        window.removeEventListener("resize", updateWidthAndHeight)
      };
    },[])

    const submitSearch = ()=>{
      // console.log(category, searchTerm);
      searchReset();
      history.push('/store?searchTerm='+searchTerm+"&&category="+category);
    }

    const dropdown_inner_html =  categories?.map( eachcategory=> ( <a key={uuid()} onClick={()=>{setCategory(eachcategory?.title)}}>{eachcategory?.title}</a> ) );
    const dropdown_html = (
      <Dropdown
          id="Dropdown_6"
          options={{
            alignment: 'left',
            autoTrigger: true,
            closeOnClick: true,
            constrainWidth: false,
            container: null,
            coverTrigger: false,
            hover: false,
            inDuration: 150,
            onCloseEnd: null,
            onCloseStart: null,
            onOpenEnd: null,
            onOpenStart: null,
            outDuration: 250
          }}
          trigger={
            <div className='btn categories_dropdown_trigger' >{category.slice(0,15)+((category.length>15)?"..":'')+" \u25BC"}</div>
          }
        >
          {dropdown_inner_html}
        </Dropdown>
    );
    const searchbar_inner_html = (
      <div className="navbar__searchInput_container">
        <div className="navbar__searchInput" >
        {dropdown_html}  
        <input 
          id="searchInput" 
          type="text"
          value={searchTerm}
          onChange={ e=>setSearchTerm(e.target.value) }
          onKeyDown={ e=>{ if(e.keyCode==13)submitSearch();} }
        />
        <i onClick={submitSearch} className="material-icons search-icon">search</i>
      </div>
      </div>
    )
    const sideNavCategoryLinks_html =  categories?.map( eachcategory=> (<div key={uuid()} className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to={"/store/"+eachcategory?.urlid}>{eachcategory?.title}</NavLink></div>) );

    return (
        <div className="Navbar">
          <NavLink onClick={()=>{setMenuOpenState(false)}} className="link cart-link" to="/cart"> 
            <span className="cart_items_count">{cartCount}</span>
          </NavLink>
          <nav>
              <div className="nav__left">
              <span onClick={()=>{ setMenuOpenState(!menuOpenState) }}>
                {
                  (!menuOpenState)?
                  (<Menu className="menu-icon"/>):
                  (<Close className="menu-icon" />)
                }
              </span>
              <NavLink onClick={()=>{setMenuOpenState(false)}} exact to="/">
                <span className="navbar__logo">Digizup</span>
                {/* <span>{width}x{height}</span> */}
              </NavLink>
              </div>
              
                {searchbar_inner_html}

              {
                (auth?.uid)?(
                  <ul className="hide-on-med-and-down row-flex-center">
                    <li><NavLink onClick={()=>{setMenuOpenState(false)}} className="link" to="/store">Store</NavLink></li>
                    <li><NavLink onClick={()=>{setMenuOpenState(false)}} className="nav_user_block_link" to="/account">
                    <div className="nav_user_block">
                      <p className="line1">Hello,</p>
                      <p className="line2">{profile?.firstName}</p>
                    </div>
                    </NavLink></li>
                  </ul>
                ):(
                  <ul className="hide-on-med-and-down row-flex-center">
                    <li><NavLink onClick={()=>{setMenuOpenState(false)}} className="link" to="/store">Store</NavLink></li>
                    <li><NavLink onClick={()=>{setMenuOpenState(false)}} className="btn login_btn" to="/login">Login</NavLink></li>
                    <li><NavLink onClick={()=>{setMenuOpenState(false)}} className="btn signup_btn" to="/signup">Signup</NavLink></li>
                  </ul>
                )
              }

              <ul>
                <li><NavLink onClick={()=>{setMenuOpenState(false)}} className="link cart-link" to="/cart"> 
                  <Cart style={{ fontSize: 40, marginTop: 12 }} /> 
                </NavLink></li>
              </ul>


          </nav>  


          <div className="side_menu">
            <div className="overlay">
              <div className="side_menu_content">
                <div className="overlay_top_container">
                  

                  <Collapsible accordion>
                    {(auth?.uid)?(
                    <CollapsibleItem
                      expanded={false}
                      header={`Hello, ${profile.firstName} ${profile.lastName}`}
                      icon={<Icon>account_box</Icon>}
                      node="div"
                    >
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/account">Dashboard</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/account/orders">My Orders</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/account/addresses">My Addresses</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/account/payments">Payments</NavLink></div>
                      
                    </CollapsibleItem>
                    ):(null)}
                    <CollapsibleItem
                      expanded={true}
                      header="Store"
                      icon={<Icon>place</Icon>}
                      node="div"
                    >
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/store">Visit Store</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/cart">My Cart</NavLink></div>
                      {sideNavCategoryLinks_html}

                    </CollapsibleItem>
                    <CollapsibleItem
                      expanded={false}
                      header="Explore"
                      icon={<Icon>whatshot</Icon>}
                      node="div"
                    >
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/">Home</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/about">About Us</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/reviews">Reviews</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/termsconditions">Terms & Conditions</NavLink></div>
                      <div className="overlayLinkContainer"> <NavLink onClick={()=>{setMenuOpenState(false)}} className="overlayLink" exact to="/privacy">Privacy Statement</NavLink></div>
                      
                    </CollapsibleItem>
                  </Collapsible>

                </div>
                  {
                    (auth?.uid)?(
                        <div >
                          Not recognizing this account?
                          <div onClick={()=>{ setMenuOpenState(false); logout(); }} to="/login" className="btn login_btn" >LogOut</div>
                        </div>
                    ):(
                      <div className="overlay_bottom_container">
                        <div><NavLink onClick={()=>{setMenuOpenState(false)}} to="/login" className="btn login_btn" >Login</NavLink></div>
                        <div><NavLink onClick={()=>{setMenuOpenState(false)}} to="/signup" className="btn signup_btn" >Signup</NavLink></div>
                      </div>
                    )
                  }
              
              </div>
              <div onClick={()=>{setMenuOpenState(false)}} className="side_right"></div>
            </div>
          </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
  // console.log('state',state);
  return {
    categories: state.firestore.ordered.categories,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }
}

const mapDispatchToProps = (dispatch)=>{
  return {
    logout: ()=>{ dispatch( logoutAction() ) },
    search: (searchTerm, category)=>{ dispatch( searchAction(searchTerm,category) ) },
    searchReset: ()=>{ dispatch( searchResetAction() ) }
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([
    {collection: 'categories'}
  ]),
  withRouter  
)(Navbar)
