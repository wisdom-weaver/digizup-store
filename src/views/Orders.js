import React, { useState, useEffect, Fragment } from 'react'
import { compose } from 'redux'
import { withRouter, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase';
import Delayed from '../utils/Delayed';
import OrderCard from '../components/OrderCard';
import _ from 'lodash';


function Orders() {
    
    const authuid = useSelector(state=>state.firebase.auth.uid) ?? 'default';
    // useFirestoreConnect([{
        // collection: 'users',
        // doc: authuid,
        // subcollections: [{collection: 'orders'}],
        // storeAs: 'orders'
    // }]);
    const ordersCollection =  useSelector(state=>state.firestore.ordered.orders) ?? [];
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        var local = ordersCollection;
        local = _.orderBy(local,['createdAt'],['desc'])
        setOrders(local);
    },[ordersCollection])
    
    const ordersJSX = (
        <div className="orders">
            {(!orders || orders.length == 0)?(
                <div className="center">
                <div className="row">
                <div className="col s8 m6 l6 offset-s2 offset-m3 offset-l3">
                <div className="card round-card">
                <div className="card-content">
                    <p className="flow-text">
                        No Orders placed yet
                    </p>
                    <NavLink to='/store/all'><div className="btn dark_btn">Shop Now</div></NavLink>
                </div>    
                </div>    
                </div>
                </div>
                </div>
            ):(
                <div className="row">
                    { orders.map((order)=>( 
                        <div className="col s12 m8 l8 offset-m2 offset-l2">
                            <OrderCard order={order} />
                        </div>
                     )) }
                </div>
            )}
        </div>
    )

    return (
        <div className="Orders Page">
            <h3 className="center primary-green-dark-text">Your <span className="heavy_text">Orders</span></h3>
            {(!authuid || authuid == 'default')?(
                <div className="center">
                <div className="row">
                <div className="col s8 m6 l6 offset-s2 offset-m3 offset-l3">
                <div className="card round-card">
                <div className="card-content">
                    <p className="flow-text">
                        Please <span className="heavy_text primary-green-dark-text">SignIn</span> To Continue
                    </p>
                </div>    
                </div>    
                </div>
                </div>
                </div>
            ):(
                <Delayed waitBeforeShow={3000}>
                    {ordersJSX}
                </Delayed>
            )}
        </div>
    )
}

export default compose(
    withRouter
)(Orders)