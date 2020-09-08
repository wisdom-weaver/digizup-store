import React, { useState, useEffect, Fragment } from 'react'
import { withRouter, useHistory, NavLink } from 'react-router-dom'
import { compose } from 'redux'
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector, connect } from 'react-redux';
import moment from 'moment';
import { v1 as uuid } from 'uuid';
import { priceFormat } from '../utils/utils';
import Delayed from '../utils/Delayed';
import _ from 'lodash';
import 'materialize-css';
import { Modal, Button } from 'react-materialize';
import { requestCancellationAction } from '../store/actions/orderActions';

function Order(props) {
    // console.log(props)
    const history = useHistory();
    const {orderid} = props.match.params ?? null;
    const authuid = useSelector(state=> state.firebase.auth.uid)??'default';
    const orders = useSelector(state=>state.firestore.ordered.orders)??[];
    const order = orders.find(each => orderid == each.id);
    useEffect(()=>{
        if(!order) return;
    },[order])
    const productRedirect = (item)=>{
        var target = '/product/'+item.productid+((item.option != false)?('?productOption='+item.option):(''));
        history.push(target);
    }

    const {requestCancellationAction} = props;
    const [cancellationMessage,setCancellationMessage] = useState('its boaring');
    const requestCancellation = (orderID)=>{
        console.log('requesting cancellateion', orderID,cancellationMessage);
        requestCancellationAction(orderID, cancellationMessage);
    }
    const cancelButton = (order && order.id) ?(
            <Modal
              actions={[
                  <Fragment>
                    <Button flat modal="close" node="button" waves="green">Close</Button>
                    <Button flat modal="close" node="button" waves="red" onClick={()=>{requestCancellation(order.id,cancellationMessage)}} >Request Cancellation</Button>
                </Fragment>
              ]}
              bottomSheet={false}
              fixedFooter={false}
              header="Modal Header"
              id="Modal-0"
              open={false}
              options={{
                dismissible: true,
                endingTop: '40%',
                inDuration: 250,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                opacity: 0.5,
                outDuration: 250,
                preventScrolling: true,
                startingTop: '20%'
              }}
              trigger={<div className="btn red_btn">Cancel Order</div>}
            >   
                <input onChange={(e)=>{setCancellationMessage(e.target.value)}} type="text" placeholder="Reason for cancellation" value={cancellationMessage}/>
            </Modal>
        ):(null);

    const orderCreds = (order && order.id && order.cart)?
    (<div className="card round-card">
        <div className="card-content">
            <h6 className="center">Order</h6>
            <table>
                <tbody>
                    <tr><th>Order ID :</th><th>{order.id}</th></tr>
                    <tr><th>Cart Count :</th><th>{order.cartCount}</th></tr>
                    <tr><th>Order Placed :</th><th>{moment(order.createdAt.toDate()).format('MMM Do YY, h:mm a')}</th></tr>
                </tbody>
            </table>
        </div>
    </div>):(null);

    const orderPayment = (order && order.id && order.cart)?
    (<div className="card round-card">
        <div className="card-content">
            <h6 className="center">Payment Mode: <span className="heavy_text">{order.paymentType}</span></h6>
            <table>
                <tbody>
                {(order.paymentType == 'card' && order.card) ? (
                    <Fragment>
                    <tr><td>Card Holder :</td><th>{order.card.cardHolderName}</th></tr>
                    <tr><td>Card Number :</td><th>{order.card.cardNo}</th></tr>
                    </Fragment>
                ) : (null)}
                    <tr><td>Payment Status :</td><th>{order.paymentType == 'cod' ? 'Payment scheduled at delivery' : 'Paid'}</th></tr>
                </tbody>
            </table>
        </div>
    </div>):(null);

    const orderAddress = (order && order.id && order.cart)?
    (<div className="card round-card">
        <div className="card-content">
            <h6 className="center">Address: </h6>
            {(order.address) ? (<table>
                <tbody>
                    <tr><td className="no-wrap">Name :</td><th>{order.address.fullName}</th></tr>
                    <tr><td className="no-wrap">Address :</td><th className="line-break">{order.address.addressLine + "\n" + order.address.city + ", " + order.address.state}</th></tr>
                    <tr><td className="no-wrap">Pincode :</td><th>{order.address.pincode}</th></tr>
                    <tr><td className="no-wrap">Phone No. :</td><th>{order.address.phoneNo + ' - ' + order.address.country}</th></tr>
                </tbody>
            </table>) : (null)}
        </div>
    </div>):(null);

    const orderTracking = (order && order.id && order.cart)?
    (<div className="card round-card">
        <div className="card-content">
            <h6 className="center">Order Status: <span className="heavy_text">{order.status}</span></h6>
            {(order.tracking) ? (<table>
                <tbody>
                    {order.tracking.map(each => (<tr><td className="line-break">{each.title}</td><td className="no-wrap">{moment(each.updateTime.toDate()).format('MMM Do YY, h:mm a')}</td></tr>))}
                </tbody>
            </table>) : (null)}
            {['Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)?(null):(
                <Fragment>
                    {(['Cancellation Requested'].includes(order.status))
                    ?( <div className="btn red_btn disabled">Request Cancellation</div> )
                    :(<Fragment>{cancelButton}</Fragment>)}
                </Fragment>
            )}
            
        </div>
    </div>):(null);

    const orderCart = (order && order.id && order.cart)?
    (<div className="card round-card">
        <div className="card-content">
            <h6 className="center">Cart Details:</h6>
            {(order.cart) ? (<table>
                <tbody>
                    <tr>
                        <td className="no-wrap heavy_text">Product Name</td>
                        <td className="no-wrap heavy_text">Price</td>
                        <td className="no-wrap heavy_text">Cart Qty</td>
                        <td className="no-wrap heavy_text">SubTotal</td>
                    </tr>
                    {(order.cart.map(item => (<tr>
                        <td className="text-link" onClick={() => { productRedirect(item); } }>{item.productName}</td>
                        <td className="no-wrap">{priceFormat(item.productPrice)}</td>
                        <td className="no-wrap">{item.cartQty}</td>
                        <td className="no-wrap">{priceFormat(item.productPrice * item.cartQty)}</td>
                    </tr>)))}
                    <tr>
                        <td></td>
                        <td className="no-wrap"></td>
                        <td className="no-wrap heavy_text">Total: </td>
                        <td className="no-wrap heavy_text">{priceFormat(order.total)}</td>
                    </tr>
                </tbody>
            </table>) : (<p>no table</p>)}
        </div>
    </div>):(null);
    const OrderPageJSX =  (order && order.id)?(
        
        <div className="row">
            <div className="col s12 m6">{orderCreds}</div>
            <div className="col s12 m6">{orderPayment}</div>
            <div className="col s12"></div>
            <div className="col s12 m6">{orderAddress}</div>
            <div className="col s12 m6">{orderTracking}</div>
            <div className="col s12"></div>
            <div className="col s12 m12">{orderCart}</div>
        </div>
    ):(null)
    return (
        <div className="Order Page">
            <div className="container">
                <Delayed waitBeforeShow={2000}>
                {(order && order?.id)?(
                        <Fragment>
                            {OrderPageJSX}
                        </Fragment>
                ):(
                    <div className="row">
                        <div className="col s12 m8 l6 offset-m2 offset-l3">
                            <div className="card round-card">
                                <div className="card-content">
                                    <p>
                                        No Such Order Found.
                                        Please Verify your credentials and order id
                                    </p>
                                    <NavLink to="/store"> <div className="btn dark_btn">Shop Now</div> </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </Delayed>
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    // console.log(state);
    return {
        
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        requestCancellationAction: (orderID, cancellationMessage)=>{dispatch(requestCancellationAction(orderID, cancellationMessage))},
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter
)(Order)
