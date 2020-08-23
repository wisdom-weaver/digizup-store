import React,{useState, useEffect} from 'react'
import 'materialize-css';
import { Card, CardTitle, Icon } from 'react-materialize';
import { priceFormat } from '../utils/utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function CartCard(props) {
    const { productName, price, defaultImage, cartQty, cartid, productid, option } = props?.cartItem
    const [locCartQty,setLocCartQty] = useState(cartQty);
    const { updateCart, removeFromCart } = props?.cartFunc
    const {cartMessage,cartCount} = props?.cartUpdate;
    useEffect(()=>{
      if(locCartQty <=0 ) setLocCartQty(1);
      if(cartMessage == 'CART_UPDATING') return;
      if(locCartQty != cartQty){
        setTimeout(()=>{
          updateCart(cartid, locCartQty);
        },3000)
      }
    },[locCartQty]);


    const history = useHistory();
    const redirectToProductPage = ()=>{
      var target = `/product/${productid}`+((option)?`?productOption=${option}`:``)
      history.push(target);
    }
    return (
        <div className="CartCard">
            <Card
              closeIcon={<Icon>close</Icon>}
              header={<CardTitle onClick={redirectToProductPage} image={defaultImage} />}
              horizontal
              revealIcon={<Icon>more_vert</Icon>}
            >
              <div className="card-info">
                <p onClick={redirectToProductPage} >{productName}</p>
                <p className="flow-text regular_text primary-green-dark-text right-align">{priceFormat(price)}</p>
              </div>
              <div className="cart-management">
                    
                <div className="quantity-selection-container">
                  <div onClick={()=>{ updateCart(cartid,cartQty-1) }} className="btn-floating quantity-adjustment-btn"> <i className="material-icons">remove_circle</i> </div>
                  <input 
                  value={locCartQty} 
                  onKeyDown={(e)=>{if(e.keyCode==13 && e.target.value>0 )updateCart(cartid, e.target.value)}} 
                  onBlur={(e)=>{if(e.target.value>0)updateCart(cartid, e.target.value)}}
                  onChange={(e)=>{if(e.target.value<=0){setLocCartQty(1)}else{ setLocCartQty(e.target.value) }}}  className="cart-quantity-input" type="number"/>
                  <div onClick={()=>{ updateCart(cartid, cartQty+1) }} className="btn-floating quantity-adjustment-btn"> <i className="material-icons">add_circle</i> </div>
                </div>
                    
                <div  
                onClick={()=>{ removeFromCart(cartid) }}
                className="btn remove_btn">Remove</div>
              </div>
            </Card> 
        </div>
    )
}

const mapStateToProps = (state)=>{
  return {
    cartUpdate: state.cartUpdate
  }
}

export default connect(mapStateToProps,null)(CartCard);