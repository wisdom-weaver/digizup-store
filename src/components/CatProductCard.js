import React from 'react'
import 'materialize-css';
import { Card, CardTitle, Icon, Modal, Button } from 'react-materialize';
import { compose } from 'redux';
import { withRouter, NavLink } from 'react-router-dom';
import { priceFormat } from '../utils/utils';

function CatProductCard(props) {
    console.log(props);
    const { productName, defaultImage, price, productid, productOption } = props.product;
    // console.log(defaultImage);
    return (
        <div className="CatProductCard">
            <Card
              className="round-card"
              closeIcon={<Icon>close</Icon>}
              header={<CardTitle image={defaultImage} className="card-title-img" reveal waves="light" />}
              revealIcon={<Icon>more_vert</Icon>}
            >
              <div className="card-content-area">
                <NavLink to={ '/product/'+productid+(productOption?('?productOption='+productOption):('')) } >
                    <p class="text-link">{productName}</p>
                </NavLink>
                <p className="right-align heavy_text">{ priceFormat(price) }</p>
              </div>
            </Card>
        </div>
    )
}

export default  compose(
    withRouter
)(CatProductCard)
