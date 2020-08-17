import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Cart from "@material-ui/icons/AddShoppingCart";
import Menu from '@material-ui/icons/MenuRounded';
import Close from '@material-ui/icons/CloseRounded';
import M from 'materialize-css';
import $ from 'jquery'
import {v1 as uuid} from 'uuid';

function Navbar() {
    const [menuOpenState, setMenuOpenState] = useState(false);
    const [category, setCategory] = useState('All');
    const [searchTerm,setSearchTerm] = useState('');

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const categories = ['All', 'Electronics', 'Stationery', 'Computers', 'Edibles'];

    const menuOpen = ()=>{
      console.log('menu-open');
      $('.side_menu').css('zIndex', '100');
      $('.side_menu_content').css('transform', 'translateX(0%)');
      $('.overlay').css('opacity', '1');
    }
    const menuClose = ()=>{
      console.log('menu-close');
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
      document.addEventListener('DOMContentLoaded', function() {
        var trigger1 = document.querySelectorAll('.dropdown-trigger1');
        var instance1 = M.Dropdown.init(trigger1, {});
      });
      window.addEventListener("resize", updateWidthAndHeight);
      return () => window.removeEventListener("resize", updateWidthAndHeight);
    },[])

    const submitSearch = ()=>{
      console.log(category, searchTerm);
      setSearchTerm('');
    }

    const search_html_large_screen  = (
      <div className="navbar__searchInput mid_nav hide-on-small-only">
        <div className='dropdown-trigger1 btn categories_dropdown_trigger'  data-target='categories_dropdown1'>{category+" \u25BC"}</div>
        <input id="searchInput" onKeyDown={(e)=>{ if(e.keyCode==13){submitSearch();} }} onChange={(e)=>{setSearchTerm(e.target.value)}}type="text" value={searchTerm} />
        <i onClick={submitSearch} className="material-icons search-icon">search</i>
      </div>
    );

    const search_html_small_screen  = (
      <div className="navbar__searchInput end_nav hide-on-med-and-up">
        <div className='dropdown-trigger1 btn categories_dropdown_trigger'  data-target='categories_dropdown2'>{category+" \u25BC"}</div>
        <input id="searchInput" onKeyDown={(e)=>{ if(e.keyCode==13){submitSearch();} }} onChange={(e)=>{setSearchTerm(e.target.value)}}type="text" value={searchTerm} />
        <i onClick={submitSearch} className="material-icons search-icon">search</i>
      </div>
    )

    const dropdown_html =  categories?.map( eachcategory=> (<li key={uuid()} ><a onClick={()=>{setCategory(eachcategory)}}>{eachcategory}</a></li>) );

    return (
        <div className="Navbar">
          <NavLink className="link cart-link" to="/cart"> 
            <span className="cart_items_count">22</span>
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
              <NavLink exact className="link" to="/">
                <span className="navbar__logo">Digizup</span>
                {/* <span>{width}x{height}</span> */}
              </NavLink>
              </div>
              
              {search_html_large_screen}

              <ul className="hide-on-med-and-down">
                <li><NavLink exact className="link" to="/">Home</NavLink></li>
                <li><NavLink className="link" to="/about">About</NavLink></li>
                <li><NavLink className="link" to="/store">Store</NavLink></li>
                <li><NavLink className="btn login_btn" to="/login">Login</NavLink></li>
                <li><NavLink className="btn signup_btn" to="/signup">Signup</NavLink></li>
              </ul>
              <ul>
                <li><NavLink className="link cart-link" to="/cart"> 
                  <Cart style={{ fontSize: 40, marginTop: 12 }} /> 
                </NavLink></li>
              </ul>

              {search_html_small_screen}

          </nav>  

            <ul id='categories_dropdown1' className='dropdown-content categories_popup'>{dropdown_html}</ul>
            <ul id='categories_dropdown2' className='dropdown-content categories_popup'>{dropdown_html}</ul>

          <div className="side_menu">
            <div className="overlay" onClick={()=>{ setMenuOpenState(false) }}>
              <div className="side_menu_content">
              <ul>
                <li><NavLink exact className="link" to="/">Home</NavLink></li>
                <li><NavLink className="link" to="/about">About</NavLink></li>
                <li><NavLink className="link" to="/store">Store</NavLink></li>
                <li><NavLink className="btn login_btn" to="/login">Login</NavLink></li>
                <li><NavLink className="btn signup_btn" to="/signup">Signup</NavLink></li>
              </ul>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Navbar
