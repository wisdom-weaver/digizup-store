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
                <div className="row">
                  <div className="col s12 l7">
                    <table>
                      <tbody>
                        <tr><td>Order Placed: </td><th>{moment(createdAt.toDate()).format('MMM Do YY, h:mm a')}</th></tr>
                        <tr><td>Total: </td><th>{priceFormat(total)}</th></tr>
                        <tr><td>Status: </td><th>{status}</th></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col s12 l5">
                    <div className="row">
                        <div onClick={redirectToOrderSummaryPage} className="col s12 l12 center"> <div className="btn light_btn">View Order</div> </div>
                        <div onClick={redirectToOrderSummaryPage} className="col s12 l12 center"> <div className="btn dark_btn">Track Order</div> </div>
                    </div>
                  </div>
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