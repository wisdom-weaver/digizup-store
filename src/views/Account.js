import React, { useEffect, Fragment } from 'react'
import { compose } from 'redux'
import { connect, useSelector } from 'react-redux'
import { withRouter, useHistory, NavLink } from 'react-router-dom'
import { addCardAction, removeCardAction, addAddressAction, removeAddressAction } from '../store/actions/accountActions'
import { useFirestoreConnect } from 'react-redux-firebase'
import Delayed from '../utils/Delayed'

function Account(props){
    const { addCard, removeCard, addAddress, removeAddress } = props;
    const authuid = useSelector(state=>state.firebase.auth.uid) || 'default';
    const profile = useSelector(state=>state.firebase.profile) || {};
    const history = useHistory();
    useEffect(()=>{
        if(!authuid || authuid == 'default'){
            setTimeout(()=>{
                history.push('/login');
            },2000);
        }
    },[authuid])

    const AccountPageJSX = (authuid && authuid!='default')?(
        <Fragment>
            <div className="row">
                <div className="col s12 m8 l6 offset-m2 offset-l3">
                    <div className="card round-card">
                    <div className="cart-title"> <h6 className="center primary-green-dark-text"><span className="heavy_text">Account</span> Details:</h6> </div>
                    <div className="card-content">
                    <table> 
                        <tbody>
                            <tr><td>First Name:</td><th>{profile.firstName}</th></tr>
                            <tr><td>Last Name:</td><th>{profile.lastName}</th></tr>
                        </tbody>
                    </table>
                    </div>
                    </div>
                </div>
                <div className="col s12 m6 l6">
                    <div className="card round-card">
                    <div className="cart-title"> <h6 className="center primary-green-dark-text">Manage <span className="heavy_text">Addresses</span> :</h6> </div>
                    <div className="card-content center">
                        <NavLink to="/account/addresses">
                            <div className="btn dark_btn">Manage Addresses</div>
                        </NavLink>
                    </div>
                    </div>
                </div>
                <div className="col s12 m6 l6">
                    <div className="card round-card">
                    <div className="cart-title"> <h6 className="center primary-green-dark-text">Manage <span className="heavy_text">Payments</span> :</h6> </div>
                    <div className="card-content center">
                        <NavLink to="/account/payments">
                            <div className="btn dark_btn">Manage Payments</div>
                        </NavLink>
                    </div>
                    </div>
                </div>
                <div className="col s12 m6 l6">
                    <div className="card round-card">
                    <div className="cart-title"> <h6 className="center primary-green-dark-text">Manage <span className="heavy_text">Orders</span> :</h6> </div>
                    <div className="card-content center">
                        <NavLink to="/account/orders">
                            <div className="btn dark_btn">Manage Orders</div>
                        </NavLink>
                    </div>
                    </div>
                </div>
            </div>
        </Fragment>
    ):(null)

    return (
        <div className="Account Page" >
            <div className="container">
                {(!authuid||authuid=='default')?(
                    <div className="row">
                    <div className="col s12 m6 l6 offset-m2 offset-l2">
                    <div className="card round-card">
                    <div className="card-content center">
                    <h6>Please <span className="heavy_text primary-green-dark-text">SignIn</span> to Continue</h6>
                    </div>
                    </div>
                    </div>
                    </div>
                ):(
                    <Delayed waitBeforeShow={3000}>
                        <Fragment>{AccountPageJSX}</Fragment>
                    </Delayed>
                )}
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    // console.log(state);
    return { 

    }
}

const mapStateToDispatch = (dispatch) =>{
    return {
        addCard: (newCard)=>{dispatch( addCardAction(newCard) )},
        removeCard: (cardid)=>{dispatch( removeCardAction(cardid) )},
        addAddress: (newAddress)=>{dispatch( addAddressAction(newAddress) )},
        removeAddress: (cardid)=>{dispatch( removeAddressAction(cardid) )}
        
    }
}

export default compose(
    connect(mapStateToProps, mapStateToDispatch),
    withRouter
)(Account)