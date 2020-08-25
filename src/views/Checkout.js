import React, { useState, useEffect } from 'react'
import 'materialize-css';
import { Collapsible, CollapsibleItem, Icon, Modal, Button } from 'react-materialize';
import queryString from 'query-string';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { v1 as uuid, parse } from "uuid";

function Checkout(props) {
    // console.log(props);
    const history = useHistory();
    // var query = queryString.parse(props?.location?.search);
    // console.log('query.stage',query.stage);
    var [stage, setStage] = useState( parseInt(1) );
    // var [stage, setStage] = useState( parseInt(query?.stage ?? 1) );
    // console.log('query', query, 'stage', stage);
    const selectStage = (newStage)=>{
        newStage = parseInt(newStage);
        if(newStage>5) {setStage(5); return;}
        if(newStage<1) { setStage(1); return; }
        setStage(newStage);
        // history.push('/checkout?stage='+newStage);
        // query = queryString.parse(props?.location?.search);
    }
    // useEffect(()=>{
        // console.log('query',query);
        // console.log('effq',query.stage);
        // if( !query.stage ) history.push('/checkout?stage='+stage);
        // setStage(parseInt(query.stage));
    // },[query])
    
    var cartItems = [
        { productName:'OnePlus 8 (Glacier Green, 6GB RAM+ 128GB Storeage)', price:41999 , cartQty: 2  },
        { productName:'Samsung 4k monitor', price:38799 , cartQty: 1  },
    ];

    var deliveryLocations = [
        { fullName: 'Danish Ansari', addressLine: '188/A, JailRoad, Naini', city: 'Prayagraj', state:'Uttar Pradesh', country:'India', phoneNo:'+91 9336674604', pincode:211008 },
        { fullName: 'Wisdom Weaver', addressLine: '188/A, JailRoad, Naini', city: 'Prayagraj', state:'Uttar Pradesh', country:'India', phoneNo:'+91 9336674604', pincode:211008 }
    ];
    var [deliveryLocationIndex, setDeliverLocationIndex] = useState(0);

    const deliverySectionJSX = (
        <div className="checkout-delivery-section">
        {/* 1=> delivery addresses and speeds */}
            {/* {deliveryLocations Cards} */}
            <h6 className="center-align">Choose Your Delivery Location</h6>
            <div className="row"> 
                {deliveryLocations?(
                    deliveryLocations.map((eachLoc,index)=>(
                    <div key={uuid()} className="col s6 m6 l4">
                    <div className="card round-card" onClick={()=>{setDeliverLocationIndex(index)}} >
                        <div className="card-content">
                            <p className="flow-text"> 
                            <label>
                              <input name="addressGroup" type="radio" checked={(index == deliveryLocationIndex)} />
                              <span className="primary-green-dark-text heavy_text">{eachLoc.fullName}</span>
                            </label>
                             </p>
                            <p>{eachLoc.addressLine}</p>
                            <p>{eachLoc.city}, {eachLoc.state}-{eachLoc.pincode}</p>
                            <p>{eachLoc.country}</p>
                        </div>
                    </div>
                    </div>
                ))
                ):(
                    <span>No addresses found</span>
                )}
                <div className="col s12"></div>
                <div className="col s12 m6 center">
                    <Modal
                      actions={[
                        (<Button flat modal="close" node="button" waves="red">Close</Button>),
                        (<Button flat modal="close" node="button" waves="green">Add Address</Button>)
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
                                <input id="fullName-addAddress" type="text" required />
                                <label  htmlFor="fullName-addAddress">Full Name</label>
                            </div>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">location_city</i>
                                <input id="addressLine-addAddress" type="text" required />
                                <label htmlFor="addressLine-addAddress">Address Line</label>
                            </div>
                            <div className="input-field col s6">
                                <i className="material-icons prefix">location_on</i>
                                <input id="city-addAddress" type="text" required />
                                <label htmlFor="city-addAddress">City</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="state-addAddress" type="text" required />
                                <label htmlFor="state-addAddress">State</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="country-addAddress" type="text" required />
                                <label htmlFor="country-addAddress">Country</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="pincode-addAddress" type="text" required />
                                <label htmlFor="pincode-addAddress">Pincode</label>
                            </div>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">local_phone</i>
                                <input id="phoneNo-addAddress" type="text" required />
                                <label htmlFor="phoneNo-addAddress">Phone Number</label>
                            </div>
                        </div>
                    </Modal>
                </div>
                <div className="col s12 m6 center">
                    <div onClick={()=>{selectStage(2)}} className="btn dark_btn">Select Address</div>
                </div>
            </div>
            {/* 1.1=> for new address */}
        </div>
    );
    
    
   var savedCards  = [
       {cardHolderName:'DANISH ANSARI', cardNo:'1212121212121212', cardExpMM:'06', cardExpYY:'28'},
       {cardHolderName:'Wisdom Weaver', cardNo:'5858585858585858', cardExpMM:'07', cardExpYY:'26'}
   ]
   var [savedCardIndex, setSavedCardIndex] = useState(0);

    var paymentModes = [
        { paymentModeHead:"Credit / Debit Card",             paymentModeIcon:'payment',      paymentModeInner:(
            <div>
                <p>we accept  VISA, MasterCard and Western Union credit/debit cards only.* </p> 
                <p>Saved Cards:</p>
                <div className="row">
                    {savedCards.map((card,index)=>(
                        <div className="col s12 m6">
                            <div className="card round-card"
                            onClick={()=>{setSavedCardIndex(index)}} 
                            >
                                <div className="card-content">
                                    <label>
                                        <input name="savedCardsGroup" type="radio" checked={( index == savedCardIndex )} />
                                        <span></span>
                                    </label>
                                    <p>Card Holder: {card.cardHolderName}</p>
                                    <p>Card No: {'XXXX XXXX XXXX '+card.cardNo.slice(12)}</p>
                                    <p>Card Expiry: { card.cardExpMM+'/'+card.cardExpYY }</p>
                                </div>
                            </div>
                        </div>
                    ))}
                     <div className="col s12"></div>
                <div className="col s12 m6 center">
                    <Modal
                      actions={[
                        (<Button flat modal="close" node="button" waves="red">Close</Button>),
                        (<Button flat modal="close" node="button" waves="green">Add Address</Button>)
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
                                <input id="fullName-addAddress" type="text" required />
                                <label  htmlFor="fullName-addAddress">Full Name</label>
                            </div>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">location_city</i>
                                <input id="addressLine-addAddress" type="text" required />
                                <label htmlFor="addressLine-addAddress">Address Line</label>
                            </div>
                            <div className="input-field col s6">
                                <i className="material-icons prefix">location_on</i>
                                <input id="city-addAddress" type="text" required />
                                <label htmlFor="city-addAddress">City</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="state-addAddress" type="text" required />
                                <label htmlFor="state-addAddress">State</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="country-addAddress" type="text" required />
                                <label htmlFor="country-addAddress">Country</label>
                            </div>
                            <div className="input-field col s6">
                                <input id="pincode-addAddress" type="text" required />
                                <label htmlFor="pincode-addAddress">Pincode</label>
                            </div>
                            <div className="input-field col s12">
                                <i className="material-icons prefix">local_phone</i>
                                <input id="phoneNo-addAddress" type="text" required />
                                <label htmlFor="phoneNo-addAddress">Phone Number</label>
                            </div>
                        </div>
                    </Modal>
                </div>
                </div>
            </div>
        ) },

        { paymentModeHead:"Crypto Currencies",               paymentModeIcon:'fingerprint',  paymentModeInner:( <p>coinbase e-commerce * </p> ) },

        { paymentModeHead:"PayPal",                          paymentModeIcon:'filter_drama', paymentModeInner:( <p>paypal Integration* </p> ) },

        { paymentModeHead:"Paytm",                           paymentModeIcon:'filter_drama', paymentModeInner:( <p>paytm Integration* </p> ) },

        { paymentModeHead:"COD/POD (Cash/Pay On Delivery)",  paymentModeIcon:'attach_money', paymentModeInner:( <p>we acccept cash aswell as digital payment options on your door step </p> ) }

    ]

    var [paymentModeIndex, setPaymentModeIndex] = useState(4);

    const paymentModesSectionJSX = (
        <div className="checkout-payment-modes-section">
            {/* 2=> payment option */}
            <h6 className="center">Select Your Payment Method</h6>
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
                <div onClick={()=>{selectStage(3)}} className="btn dark_btn">Order Summary</div>
            </div>
        </div>
    )
    
    const orderSummarySectionJSX = (
        <div className="checkout-order-summary-section">
        {/* 3=> order summary   */}
            <div className="summary-delivery">
                <p className="flow-text">Delivery Address:</p>
                <p>{deliveryLocations[deliveryLocationIndex].fullName}</p>
                <p>{deliveryLocations[deliveryLocationIndex].addressLine}</p>
                <p>{deliveryLocations[deliveryLocationIndex].city}, {deliveryLocations[deliveryLocationIndex].state}-{deliveryLocations[deliveryLocationIndex].pincode}</p>
                <p>{deliveryLocations[deliveryLocationIndex].country}</p>
                <p>{deliveryLocations[deliveryLocationIndex].phoneNo}</p>
            </div>
            <br/><hr/><br/>
            <div className="summary-payments">
                <p className="flow-text">Payment Options: {paymentModes[paymentModeIndex].paymentModeHead}</p>
                {(paymentModeIndex == 0)?(
                <div className="card-details">
                    <p>Card Holder: {savedCards[savedCardIndex].cardHolderName}</p>
                    <p>Card No: {'XXXX XXXX XXXX '+savedCards[savedCardIndex].cardNo.slice(12)}</p>
                    <p>Card Expiry: { savedCards[savedCardIndex].cardExpMM+'/'+savedCards[savedCardIndex].cardExpYY }</p>
                </div>
                ):(null)}
            </div>
            <div className="summary-order-details">
                <table>
                    <tbody>
                        <tr>
                            <td>Product</td> <td>Price/Qty</td> <td>Qty</td> <td>SubTotal</td>
                        </tr>
                        {cartItems && cartItems.map(item=>( 
                        <tr>
                            <td>{item.productName}</td> <td>{item.price}</td> <td>{item.cartQty}</td> <td>{item.price*item.cartQty}</td>
                        </tr> ))}
                    </tbody>
                </table>
            </div>
            <div className="summary-payment-proceeding">
                <div onClick={()=>{selectStage(4)}} className="btn dark_btn">Proceed To Payment</div>
            </div>
        </div>
    )
    
    const makePaymentSectionJSX = (
        <div className="checkout-make-payment">
            {/* 4=> make payment  */}
            what ever integration to put in here;
            <div className="btn dark_btn">Pay Now</div>
        </div>
    );
    const resultSectionJSX = (
        <div className="checkout-result">
        {/* 5=> redirect To confirmation Page*/}
            confirmation page
        </div>
    )
    const checkoutPage= {
        '1':{ stageid:1, stageTitle: 'Delivery',      stateJSX: deliverySectionJSX },
        '2':{ stageid:2, stageTitle: 'Payment Options',      stateJSX: paymentModesSectionJSX },
        '3':{ stageid:3, stageTitle: 'Order Summary',  stateJSX: orderSummarySectionJSX },
        '4':{ stageid:4, stageTitle: 'Make Payment',   stateJSX: makePaymentSectionJSX },
        '5':{ stageid:5, stageTitle: 'Result',        stateJSX: resultSectionJSX },
    }
    return (
        <div className="Checkout Page">
            <div className="container">
                <h4 className="stage_control_panel">
                    <i onClick={()=>{selectStage(stage-1)}} className={"material-icons stage_arrow "+((stage==1)?('disabled'):(''))}>arrow_left</i>
                    <span className="stage_title" >{(stage)?(checkoutPage[stage]?.stageTitle):(null)}</span>
                    <i onClick={()=>{selectStage(stage+1)}} className={"material-icons stage_arrow "+((stage==5)?('disabled'):(''))}>arrow_right</i>
                </h4>

                {
                    (stage)?(
                        <div>
                            {checkoutPage[stage].stateJSX}
                        </div>
                    ):(null)
                }
                
            </div>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {

    }
}

const mapDispatchToProps = (dispatch)=>{
    return{

    }
}

export default withRouter(Checkout)
