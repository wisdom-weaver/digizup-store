import React,{useState, useEffect} from 'react'
import 'materialize-css';
import { Card, CardTitle, Icon, Chip } from 'react-materialize';
import { priceFormat } from '../utils/utils';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

function OrderCard(props) {
    const history = useHistory();
    var {order} = props;
    var {defaultImage, id, cartCount, total ,createdAt, status} = order;
    var redirectToOrderSummaryPage = ()=>{
        console.log('redirect to order summary page');
        history.push('/account/order/'+id);
    }
    return (
        <div className="OrderCard">
            <Card
              className="round-card"
              closeIcon={<Icon>close</Icon>}
              header={<CardTitle onClick={redirectToOrderSummaryPage} image={defaultImage} />}
              horizontal
              revealIcon={<Icon>more_vert</Icon>}
            >
                <Chip
                  className="green-chip"
                  close={false}
                  closeIcon={<Icon className="close">close</Icon>}
                  options={null}
                >
                  <span className="flow-text">{cartCount}</span> {(cartCount>1)?'items':'item'}
                </Chip>
                <p>Order Placed: <span className="heavy_text">{
                    moment(createdAt.toDate()).format('MMM Do YY, h:mm a')
                }</span></p>
                <p>Total: <span className="heavy_text">{priceFormat(total)}</span></p>
            <p>Status: <span className="heavy_text">{status}</span></p>
                <div className="row">
                    <div onClick={redirectToOrderSummaryPage} className="col s12 m6 center"> <div className="btn light_btn">View Order</div> </div>
                    <div className="col s12 "></div>
                    <div onClick={redirectToOrderSummaryPage} className="col s12 m6 center"> <div className="btn dark_btn">Track Order</div> </div>
                </div>
            </Card> 
        </div>
    )
}

const mapStateToProps = (state)=>{
  return {
  }
}

export default connect(mapStateToProps,null)(OrderCard);