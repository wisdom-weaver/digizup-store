import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import $ from 'jquery';
import M from 'materialize-css';

function Store() {
    useEffect(()=>{
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.dropdown-trigger');
            var instances = M.Dropdown.init(elems, {});
          });
    },[]);
    const categories = ['All', 'Electronics', 'Stationery', 'Computers', 'Edibles'];
    const html = categories.map(each=>( <li>{each}</li> ) );
    
    return (
        <div className="Store Page">
            <h1>Store</h1>
            <ul>{
                html
            }</ul>
        </div>
    )
}

export default Store
