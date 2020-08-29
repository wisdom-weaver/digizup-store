import React, { useState, useEffect, Fragment } from 'react'
import 'materialize-css';
import { Collapsible, CollapsibleItem, Icon, Modal, Button } from 'react-materialize';
import queryString from 'query-string';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { v1 as uuid, parse } from "uuid";
import { isLoaded, useFirestoreConnect, useFirebaseConnect, useFirestore } from 'react-redux-firebase';
import { db } from '../config/FirebaseConfig';
import { addAddressAction, addCardAction, placeOrderAction } from '../store/actions/checkoutActions';
import Delayed from '../utils/Delayed';

function Checkout(props) {
    
    const authuid = useSelector(state=> state.firebase.auth.uid ) ?? 'default';
    const history = useHistory();
    useEffect(()=>{
        if(!authuid || authuid == 'default'){
            setTimeout(()=>{
                // history.push('/login');
            },3000)
        }
    },[authuid])
    useFirestoreConnect([{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'cart'}],
        storeAs: 'cart'
    },{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'addresses'}],
        storeAs: 'addresses'
    },{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'cards'}],
        storeAs: 'cards'
    }]);
    const addAddress = props?.addAddress;
    const addCard = props?.addCard;
    const placeOrder = props?.placeOrder;

    const cart =  useSelector(state=> state.firestore.ordered.cart) ?? []
    useEffect(()=>{
        // console.log('cart',cart)
        if(cart.length>0){
            var localTotal = cart.reduce((acc,each)=>(acc+each.productPrice*each.cartQty),0);
            setTotal(localTotal);
        }
    },[cart]);

    const addresses = useSelector(state=> state.firestore.ordered.addresses) ?? [];
    useEffect(()=>{ 
        // console.log('addresses',addresses);
        if(!addresses || addresses.length==0) return;
        if(addressIndex==-1){setAddressIndex(0); }
    },[addresses]);

    const cards = useSelector(state=> state.firestore.ordered.cards) ?? [];
    useEffect(()=>{ 
        console.log('cards',cards);
        if(!cards || cards.length==0) return;
        if(cardIndex == -1) setCardIndex(0);
    },[cards]);
    
    const [total,setTotal] = useState(0);

    useEffect(()=>{},[cart, addresses, cards])

    const initAddress = { fullName    :'', addressLine :'', city    :'', state   :'', country :'', pincode :'', phoneNo :'' }
    const [newAddress, setNewAddress] = useState(initAddress);
    const [addressIndex, setAddressIndex] = useState(-1);
    var [paymentModeIndex, setPaymentModeIndex] = useState(4);
    var [cardIndex, setCardIndex] = useState(-1);
    var initCard = { cardHolderName: '', cardNo: '', cardExpMM: '', cardExpYY: '' };
    const [newCard, setNewCard] = useState(initCard);
    useEffect(()=>{
        console.log({addressIndex});
    },[addressIndex]);
    useEffect(()=>{
        console.log({cardIndex});
    },[cardIndex]);
    const submitNewAddress = ()=>{
        addAddress(newAddress);
        setNewAddress(initAddress);
    }
    const submitAddress = ()=>{
        console.log({addresses,addressIndex});
        if(addressIndex < 0) return;
        else{setStage(1);}
    }

    const submitNewCard = (newCard)=>{
        addCard(newCard);
        setNewCard(initCard);
    } 

    const submitPaymentMode = ()=>{
        console.log('paymentModeIndex', paymentModeIndex, 'cardIndex', cardIndex);
        if(paymentModeIndex == 0 && cardIndex > -1) setStage(2);
        if(paymentModeIndex > 0) setStage(2);
    }
    const proceedToPayment= ()=>{
        setStage(3);
    }

    const payNow = ()=>{
        if(addressIndex< 0 )return;
        if(paymentModeIndex< 0 )return;
        if(paymentModeIndex == 0 && cardIndex < 0)return;
        var order = { 
            cart: cart,
            total: total,
            address:addresses[addressIndex],
            paymentType: paymentModes[paymentModeIndex].paymentType,
        }
        if(paymentModeIndex ==0 && cardIndex > -1){
            order = {...order, card:{cardHolderName: cards[cardIndex].cardHolderName, cardNo: 'XXXX XXXX XXXX '+cards[cardIndex].cardHolderName.slice(12)}
            }
        }else{
            order = {...order}
        }
        placeOrder(order);
    }

    const deliverySectionJSX = (
        <div className="deliverySection">
            <h4 className="center">Select Your Delivery Location</h4>
            <div className="row">
                { (!addresses && addresses.length ==0)?(
                    <p className="center">
                        No saved Address found.
                        <br />Please add atleast one.
                    </p>
                ):(null)}
                { addresses && addresses.map((eachLoc,index)=>(
                <div key={uuid()} className="col s6 m6 l4">
                    <div  onClick={()=>{setAddressIndex(index)}} className="card round-card">
                        <div className="card-content">
                            <p className="flow-text"> 
                            <label>
                              <input name="addressGroup" type="radio" checked={(index == addressIndex)} />
                              <span className="primary-green-dark-text heavy_text">{eachLoc.fullName}</span>
                            </label>
                             </p>
                            <p>{eachLoc.addressLine}</p>
                            <p>{eachLoc.city}, {eachLoc.state}-{eachLoc.pincode}</p>
                            <p>{eachLoc.country}</p>
                        </div>
                    </div>   
                </div>
                )) }
                <div className="col s12"></div>
                <div className="col s12 m6 center">
                    <Modal
                      actions={[
                        (<Button flat modal="close" node="button" waves="red">Close</Button>),
                        (<Button onClick={()=>{submitNewAddress(newAddress)}} flat modal="close" node="button" waves="green">Add Address</Button>)
                      ]}
                      bottomSheet={false}
                      fixedFooter={true}
                      header="Add a new Address"
                      id="addAddressModal"
                      open={false}
                      options={{
                        dismissible: true,
                        endingTop: '16%',
                        inDuration: 250,
                        onCloseEnd: null,
                        onCloseStart: null,
                        onOpenEnd: null,
                        onOpenStart: null,
                        opacity: 0.5,
                        outDuration: 250,
                        preventScrolling: true,
                        startingTop: '55%'
                      }}
                    //   root={[object HTMLBodyElement]}
                      trigger={<div className="btn light_btn"> <i className="material-icons">add</i> <span>Add Address</span> </div>}
                    >
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix">account_circle</i>
                                <input onChange={(e)=>{setNewAddress({...newAddress, fullName:e.target.value})}} value={newAddress.fullName} id="fullName-addAddress" type="text" required />
                                <label  htmlFor="fullName-addAddress">Full Name</label>
                            </div>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">location_city</i>
                                <input onChange={(e)=>{setNewAddress({...newAddress, addressLine:e.target.value})}} value={newAddress.addressLine} id="addressLine-addAddress" type="text" required />
                                <label htmlFor="addressLine-addAddress">Address Line</label>
                            </div>
                            <div className="input-field col s6">
                                <i className="material-icons prefix">location_on</i>
                                <input onChange={(e)=>{setNewAddress({...newAddress, city:e.target.value})}} value={newAddress.city} id="city-addAddress" type="text" required />
                                <label htmlFor="city-addAddress">City</label>
                            </div>
                            <div className="input-field col s6">
                                <input onChange={(e)=>{setNewAddress({...newAddress, state:e.target.value})}} value={newAddress.state} id="state-addAddress" type="text" required />
                                <label htmlFor="state-addAddress">State</label>
                            </div>
                            <div className="input-field col s6">
                                <input onChange={(e)=>{setNewAddress({...newAddress, country:e.target.value})}} value={newAddress.country} id="country-addAddress" type="text" required />
                                <label htmlFor="country-addAddress">Country</label>
                            </div>
                            <div className="input-field col s6">
                                <input onChange={(e)=>{setNewAddress({...newAddress, pincode:e.target.value})}} value={newAddress.pincode} id="pincode-addAddress" type="text" required />
                                <label htmlFor="pincode-addAddress">Pincode</label>
                            </div>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">local_phone</i>
                                <input onChange={(e)=>{setNewAddress({...newAddress, phoneNo:e.target.value})}} value={newAddress.phoneNo} id="phoneNo-addAddress" type="text" required />
                                <label htmlFor="phoneNo-addAddress">Phone Number</label>
                            </div>
                        </div>
                    </Modal>
                </div>
                <div className="col s12 m6 center">
                    {
                    (!addresses || addresses.length ==0)?(
                        <div className="btn dark_btn disabled">Select Address</div>
                    ):(
                        <div onClick={()=>{submitAddress()}} className="btn dark_btn">Select Address</div>
                    )
                    }
                </div>
            </div>
        </div>
    )
    
     var paymentModes = [
         {  paymentType :'card', paymentModeHead:"Credit / Debit Card",             paymentModeIcon:'payment',      paymentModeInner:(
             <div>
                 <p>We accept  VISA, MasterCard and Western Union credit/debit cards only.* </p> 
                 <div className="row">
                    {(!cards || cards.length == 0 )?(
                        <p className="center">
                            No Saved Card Found
                            Please add atleast one.
                        </p>
                    ):(
                        <Fragment>
                            <p className="flow-text center">Saved Cards: </p>
                            {cards.map((card,index)=>(
                             <div className="col s12 m6">
                                 <div className="card round-card"
                                 onClick={()=>{setCardIndex(index)}} 
                                 >
                                     <div className="card-content">
                                         <label>
                                             <input name="cardsGroup" type="radio" checked={( index == cardIndex )} />
                                             <span></span>
                                         </label>
                                         {card?(
                                            <div>
                                                <p>Card Holder: {card.cardHolderName}</p>
                                                <p>Card No: {'XXXX XXXX XXXX '+card.cardNo.slice(12)}</p>
                                                <p>Card Expiry: { card.cardExpMM+'/'+card.cardExpYY }</p>
                                            </div>
                                         ):(null)}
                                     </div>
                                 </div>
                             </div>
                            ))}
                        </ Fragment>  
                    )}
                    <div className="col s12"></div>
                    <div className="col s12 m6 center">
                     <Modal
                       actions={[
                         (<Button flat modal="close" node="button" waves="red">Close</Button>),
                         (<Button onClick={()=>{ submitNewCard(newCard) }} flat modal="close" node="button" waves="green">Add Card</Button>)
                       ]}
                       bottomSheet={false}
                       fixedFooter={true}
                       header="Add a new Address"
                       id="addAddressModal"
                       open={false}
                       options={{
                         dismissible: true,
                         endingTop: '16%',
                         inDuration: 250,
                         onCloseEnd: null,
                         onCloseStart: null,
                         onOpenEnd: null,
                         onOpenStart: null,
                         opacity: 0.5,
                         outDuration: 250,
                         preventScrolling: true,
                         startingTop: '55%'
                       }}
                     //   root={[object HTMLBodyElement]}
                       trigger={<div className="btn light_btn"> <i className="material-icons">add</i> <span>Add Card</span> </div>}
                     >
                         <div className="row">
                             <div className="input-field col s12">
                                 <i className="material-icons prefix">account_circle</i>
                                 <input onChange={(e)=>{setNewCard({...newCard, cardHolderName:e.target.value})}} value={newCard.cardHolderName} id="cardHolderName-addCard" type="text" required />
                                 <label  htmlFor="cardHolder-addCard">Full Name</label>
                             </div>
                             <div className="input-field col s8">
                                 <i className="material-icons prefix">payment</i>
                                 <input onChange={(e)=>{setNewCard({...newCard, cardNo:e.target.value})}} value={newCard.cardNo} id="cardNo-addCard" type="text" required />
                                 <label htmlFor="cardNo-addCard">Card Line</label>
                                 {/* <NumberFormat customInput={TextField} format="#### #### #### ####"/> */}
                             </div>
                             <div className="input-field col s2">
                                 <input onChange={(e)=>{setNewCard({...newCard, cardExpMM:e.target.value})}} value={newCard.cardExpMM} id="cardExpMM-addCard" type="text" required />
                                 <label htmlFor="cardExpMM-addCard">MM</label>
                             </div>
                             <div className="input-field col s2">
                                 <input onChange={(e)=>{setNewCard({...newCard, cardExpYY:e.target.value})}} value={newCard.cardExpYY} id="cardExpYY-addCard" type="text" required />
                                 <label htmlFor="cardExpYY-addCard">YY</label>
                             </div>
                         </div>
                     </Modal>
                    </div>
                 </div>
             </div>
         ) },
 
         { paymentType:'crypto', paymentModeHead:"Crypto Currencies",               paymentModeIcon:'fingerprint',  paymentModeInner:( <p>coinbase e-commerce * </p> ) },
 
         { paymentType:'paypal', paymentModeHead:"PayPal",                          paymentModeIcon:'filter_drama', paymentModeInner:( <p>paypal Integration* </p> ) },
 
         { paymentType:'paytm', paymentModeHead:"Paytm",                           paymentModeIcon:'filter_drama', paymentModeInner:( <p>paytm Integration* </p> ) },
 
         { paymentType:'cod', paymentModeHead:"COD/POD (Cash/Pay On Delivery)",  paymentModeIcon:'attach_money', paymentModeInner:( <p>we acccept cash aswell as digital payment options on your door step </p> ) }
 
     ]
 
    const paymentModesSectionJSX = (
        <div className="checkout-payment-modes-section">
            {/* 2=> payment option */}
            <h4 className="center">Select Your Payment Option</h4>
            <Collapsible>
                {paymentModes.map((mode,index)=>(
                <CollapsibleItem
                    expanded = {(index == paymentModeIndex)}
                    onClick={()=>{setPaymentModeIndex(index)}}
                    header={( 
                    <div className="payment-mode-option">
                        <label>
                            <input name="paymentModesGroup" type="radio" checked={( index == paymentModeIndex )} />
                            <span></span>
                        </label>
                        <p className=" payment-mode-option-name primary-green-dark-text heavy_text">{mode.paymentModeHead}</p>
                        <span><i className="material-icons">{(index == paymentModeIndex)?('keyboard_arrow_up'):('keyboard_arrow_down')}</i></span>
                    </div> )}
                    icon={<Icon>{mode.paymentModeIcon}</Icon>}
                    node="div"
                >
                    {mode.paymentModeInner}
                </CollapsibleItem>
                ))}
            </Collapsible>
            <div className="center">
                {(paymentModeIndex ==0 && cardIndex==-1)?(
                    <div className="btn dark_btn disabled">Order Summary</div>
                ):(
                    <div onClick={()=>{ submitPaymentMode()}} className="btn dark_btn">Order Summary</div>
                )}
            </div>
        </div>
    )

    const orderSummarySectionJSX = (
        <div className="checkout-order-summary-section">
        {/* 3=> order summary   */}
            <div className="summary-delivery-address">
                <h6>Delivery Address:</h6>
                {(addresses && addressIndex>-1)?(<div className="center">
                    <div className="row">
                        <div className="card col s8 m8 l6 round-card">
                            <div className="card-content">
                            {(addresses[addressIndex])?(
                            <Fragment>
                                <p className="heavy_text">{ addresses[addressIndex].fullName }</p>
                                <p className="heavy_text">{ addresses[addressIndex].addressLine +'-'+ addresses[addressIndex].city}</p>
                                <p className="heavy_text">{ addresses[addressIndex].state+'-'+addresses[addressIndex].pincode +', '+addresses[addressIndex].country}</p>
                                <p className="heavy_text">{ addresses[addressIndex].phoneNo}</p>
                            </Fragment>
                            ):(null)}
                            </div>
                        </div>
                    </div>
                </div>):(null)}
            </div>
            <div className="summary-payment-mode">
                <h6>Payment Option: <Icon>{paymentModes[paymentModeIndex].paymentModeIcon}</Icon> {paymentModes[paymentModeIndex].paymentModeHead}</h6>
                {(paymentModeIndex==0 && cards && cardIndex> -1)?(
                <div className="center">
                    <div className="row">
                        <div className="card col s8 m8 l6 round-card">
                            <div className="card-content left-align">
                                <p className="heavy_text">Card Holder: {cards[cardIndex].cardHolderName}</p>
                                <p className="heavy_text">Card Number: {'XXXX XXXX XXXX '+cards[cardIndex].cardNo.slice(12)}</p>
                                <p className="heavy_text">Card Expiry: {cards[cardIndex].cardExpMM+'/'+cards[cardIndex].cardExpYY}</p>
                            </div>
                        </div>
                    </div>
                </div>):(null)}
            </div>
            <div className="summary-order-details">
                <table>
                    <tbody>
                        <tr>
                            <td>Product</td> <td>Price/Qty</td> <td>Qty</td> <td>SubTotal</td>
                        </tr>
                        { cart && cart.map(item=>( 
                        <tr>
                            <td>{item.productName}</td> <td>{item.productPrice}</td> <td>{item.cartQty}</td> <td>{item.productPrice*item.cartQty}</td>
                        </tr> ))}
                        <tr>
                            <td></td> <td></td> <td className="heavy_text">Total</td> <td className="heavy_text">{total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="summary-payment-proceeding">
                <div onClick={()=>{proceedToPayment()}} className="btn dark_btn">Proceed To Payment</div>
            </div>
        </div>
    )

    const integrationJSX = (
        <div className="checkout-integration-section">
            Integration
            <div onClick={ ()=>{payNow()} } className="btn dark_btn">Pay Now</div>
        </div>
    )
    const checkoutResultJSX = (
        <div className="checkout-integration-section">
            <h5 className="center">Success!!</h5>
        </div>
    )
    const [stage, setStage] = useState(0);
    const checkout = [
        deliverySectionJSX,
        paymentModesSectionJSX,
        orderSummarySectionJSX,
        integrationJSX,
        checkoutResultJSX
    ]
    return(
        <div className="Checkout Page">
            <div className="container">
                {(authuid!='default')?(
                    <Delayed waitBeforeShow={5000} >
                        {checkout[stage]}
                    </Delayed>
                ):(
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
                )}
            </div>
                
        </div>
    )

}

const mapStateToProps = (state)=>{
    // console.log('state-checkout',state);
    return { }
}

const mapDispatchToProps = (dispatch)=>{
    return{ 
        addAddress : (newAddress)=>{ dispatch(addAddressAction(newAddress)) },
        addCard : (newCard)=>{ dispatch( addCardAction(newCard) ) },
        placeOrder : (newOrder)=>{ dispatch( placeOrderAction(newOrder) ) }
    }
}

export default 
compose(
    connect(mapStateToProps,mapDispatchToProps),
    withRouter
)(Checkout)
