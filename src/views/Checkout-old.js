import React, { useState, useEffect } from 'react'
import 'materialize-css';
import { Collapsible, CollapsibleItem, Icon, Modal, Button } from 'react-materialize';
import queryString from 'query-string';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import { v1 as uuid, parse } from "uuid";
import { isLoaded, useFirestoreConnect, useFirebaseConnect } from 'react-redux-firebase';
import { db } from '../config/FirebaseConfig';

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

    const authuid = useSelector(state=> state.firebase.auth.uid);
    useFirestoreConnect([{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'cart'}],
        storeAs: 'cart'
    },{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'savedAddresses'}],
        storeAs: 'savedAddresses'
    },{
        collection: 'users',
        doc: authuid,
        subcollections: [{collection:'savedCards'}],
        storeAs: 'savedCards'
    }]);

    const cartCollection = useSelector(state=>state.firestore.ordered.cart);
    const savedAddresses = useSelector(state=> state.firestore.ordered.savedAddresses);
    const savedCards = useSelector(state=> state.firestore.ordered.savedCards) ;
    const cartCollectionObj = useSelector(state=>state.firestore.data.cart);

    const [cart, setCart] = useState();
    const [total, setTotal] = useState(0)
    useEffect(()=>{
        if(!isLoaded(cartCollection) || !isLoaded(cartCollectionObj)) return;
        if(!cartCollection || !cartCollectionObj){ setCart([]); setTotal(0); return;}
        getCart();
    },[cartCollection,cartCollectionObj])
    useEffect(() => {
        if(!isLoaded(savedCards)) return;
        else console.log('savedCards loaded', savedCards);
    }, [savedCards])
    useEffect(() => {
        if(!isLoaded(savedAddresses)) return;
        else console.log('savedAddresses loaded', savedAddresses);
    }, [savedAddresses])
    const getCart = async ()=>{
        //console.log('getcart', cartCollection);
        var localCart = [];
        var localTotal = 0;
        var cartCollectionIds = Object.keys(cartCollectionObj);
        for(let i=0;i<cartCollection.length;i++){
            //console.log(i);
            try{
                var cartEach = cartCollection[i];
            //console.log(cartEach);
            var cartProductDoc = await db.collection('products').doc(cartEach?.cartItemRef).get();
            if(cartProductDoc.empty){ /* console.log('product doc not found'); */ continue;}
            var cartProduct = cartProductDoc.data();
            //console.log(cartProduct);
            var localCartItem = {}
            if(cartEach.option == false){
                localCartItem = {
                    productName : cartProduct.productName,
                    productid : cartProductDoc.id,
                    price: cartProduct.price,
                    defaultImage: cartProduct.images[0],
                    cartQty : cartEach.cartQty,
                    option: false,
                    cartid: cartCollectionIds[i]
                }
                localTotal += localCartItem.price*localCartItem.cartQty;
            }else{
                localCartItem = {
                    productName : cartProduct[cartEach.option].productFullName,
                    productid : cartProductDoc.id,
                    price: cartProduct[cartEach.option].price,
                    defaultImage: cartProduct[cartEach.option].images[0],
                    cartQty : cartEach.cartQty,
                    option: cartEach.option,
                    cartid: cartCollectionIds[i]
                }
                localTotal += localCartItem.price*localCartItem.cartQty;
            }
            }catch(er){continue;}
            //console.log(localCartItem);
            localCart.push(localCartItem);
        }
        setCart(localCart);
        setTotal(localTotal);
    }
    
    var [deliveryLocationIndex, setDeliverLocationIndex] = useState(0);
    const [newAddress, setNewAddress] = useState({
        fullName    :'',
        addressLine :'',
        city    :'',
        state   :'',
        country :'',
        pincode :'',
        phoneNo :''
    });
    const deliverySectionJSX = (
        <div className="checkout-delivery-section">
        {/* 1=> delivery addresses and speeds */}
            {/* {savedAddresses Cards} */}
            <h6 className="center-align">Choose Your Delivery Location</h6>
            <div className="row"> 
                {isLoaded(savedAddresses) && savedAddresses && savedAddresses.map((eachLoc,index)=>(
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
                ))}
                <div className="col s12"></div>
                <div className="col s12 m6 center">
                    <Modal
                      actions={[
                        (<Button flat modal="close" node="button" waves="red">Close</Button>),
                        (<Button onClick={()=>{console.log(newAddress)}} flat modal="close" node="button" waves="green">Add Address</Button>)
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
                    <div onClick={()=>{selectStage(2)}} className="btn dark_btn">Select Address</div>
                </div>
            </div>
            {/* 1.1=> for new address */}
        </div>
    );
    
    
   var [savedCardIndex, setSavedCardIndex] = useState(0);
   const [newCard, setNewCard] = useState({
    cardHolderName  : '',
    cardNo          : '',
    cardExpMM       : '',
    cardExpYY       : ''
   })
   
    var paymentModes = [
        { paymentModeHead:"Credit / Debit Card",             paymentModeIcon:'payment',      paymentModeInner:(
            <div>
                <p>we accept  VISA, MasterCard and Western Union credit/debit cards only.* </p> 
                <p>Saved Cards:</p>
                <div className="row">
                    {isLoaded(savedCards) && savedCards  && savedCards.map((card,index)=>(
                        <div className="col s12 m6">
                            <div className="card round-card"
                            onClick={()=>{setSavedCardIndex(index)}} 
                            >
                                <div className="card-content">
                                    <label>
                                        <input name="savedCardsGroup" type="radio" checked={( index == savedCardIndex )} />
                                        <span></span>
                                    </label>
                                    {/* {card?( */}
                                        {/* <div> */}
                                            {/* <p>Card Holder: {card.cardHolderName}</p> */}
                                            {/* <p>Card No: {'XXXX XXXX XXXX '+card.cardNo.slice(12)}</p> */}
                                            {/* <p>Card Expiry: { card.cardExpMM+'/'+card.cardExpYY }</p> */}
                                        {/* </div> */}
                                    {/* ):(null)} */}
                                </div>
                            </div>
                        </div>
                    ))}
                     <div className="col s12"></div>
                <div className="col s12 m6 center">
                    <Modal
                      actions={[
                        (<Button flat modal="close" node="button" waves="red">Close</Button>),
                        (<Button onClick={()=>{console.log(newCard); }} flat modal="close" node="button" waves="green">Add Address</Button>)
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
                {((isLoaded(savedAddresses) && savedAddresses)?(
                    <div>
                        <p>{savedAddresses[deliveryLocationIndex].fullName}</p>
                        <p>{savedAddresses[deliveryLocationIndex].addressLine}</p>
                        <p>{savedAddresses[deliveryLocationIndex].city}, {savedAddresses[deliveryLocationIndex].state}-{savedAddresses[deliveryLocationIndex].pincode}</p>
                        <p>{savedAddresses[deliveryLocationIndex].country}</p>
                        <p>{savedAddresses[deliveryLocationIndex].phoneNo}</p>
                    </div>
                ):(null))}
            </div>
            <br/><hr/><br/>
            <div className="summary-payments">
                <p className="flow-text">Payment Options: {paymentModes[paymentModeIndex].paymentModeHead}</p>
                {( paymentModeIndex ==0 && savedCards && savedCardIndex)?(
                    <div className="card-details">
                        <p>Card Holder: {savedCards[savedCardIndex].cardHolderName}</p>
                        <p>Card No: {'XXXX XXXX XXXX '+savedCards[savedCardIndex].cardNo?.slice(12)}</p>
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
                        { isLoaded(cartCollection) && cart && cart.map(item=>( 
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
    console.log('state',state);
    return {

    }
}

const mapDispatchToProps = (dispatch)=>{
    return{

    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps)
)(Checkout)
