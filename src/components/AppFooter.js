import React from 'react'
import { useSelector } from 'react-redux'
import { compose } from 'redux';
import { withRouter, NavLink } from 'react-router-dom';
import _ from 'lodash';
import { v1 as uuid } from 'uuid';
import logo from '../assets/img/digi-logo.jpg'

function AppFooter(props) {
    const categories = useSelector(state=>state.firestore.ordered.categories ?? []);
    const link= (to,text) => 
    <div key={uuid()} className="footer-btn-container">
        <NavLink className="btn" exact to={to}>{text}</NavLink>
    </div>

    return (
        <div className="AppFooter" >
            <div className="footer-top primary-green-light-bg">
                <div className="logo-container">
                    <img src={logo} />
                </div>
                <div className="row-flex-center flex-wrap">
                    {link('/','Home')}
                    {link('/store','Store')}
                    {link('/cart','Cart')}
                </div>
                <div className="row-flex-center flex-wrap">
                    {categories && _.orderBy(categories,['title'],['asc']).map(each=>link(`/store/${each.urlid}`,each.title))}
                </div>
            </div>
            <div className="footer-bottom primary-green-dark-bg">
                <h4 className="center white-text">
                    <span className="light_text">Powered By</span> <a target="_blank" href="https://digizup.com" className="white-text">Digizup</a><sup><span className="light_text">&copy; 2020</span></sup>
                </h4>
            </div>
        </div>
    )
}

export default compose(
    withRouter
)(AppFooter)
