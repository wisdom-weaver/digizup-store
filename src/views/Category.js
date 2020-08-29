import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

function Category(props) {
    const {category} = props.match.params;
    const categoriesCollection = useSelector(state=>state.firestore.ordered.categories);
    const [cat , setCat] = useState(null);
    useEffect(()=>{
        if(!categoriesCollection) return;
        setCat( categoriesCollection.find((each)=>each.urlid==category) );
    },[categoriesCollection])
    return (
        <div className="Category Page" >
            <p className="flow-text">{category}</p>
            <p>{JSON.stringify(cat)}</p>
        </div>
    )
}

const mapStateToProps = (state)=>{
    return {}
}

export default  
compose(
    connect(mapStateToProps, null),
    withRouter
)(Category)