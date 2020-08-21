import React, { useState } from 'react'
import {db} from '../config/FirebaseConfig';

import _ from "lodash";
import isNumber from 'lodash/isNumber';
import ProductCard from '../components/ProductCard';


function Test() {

    const [search, setSearch] = useState('');
    const brands = ['nokia', 'samsung', 'oneplus', 'realme', 'redmi'];
    const [productsList, setProductsList] = useState([]);
    const test = async (searchTerm)=>{
        console.log(searchTerm);
        searchTerm= searchTerm.toLowerCase();
        var keywords = searchTerm.split(/(?:,| |\+|-|\(|\))+/);
        keywords.forEach((each,index)=>{
            if(brands.includes(each)&&keywords[index+1]&&isNumber(keywords[index+1])){
                console.log('brand matched');
                keywords[index]+='_'+keywords[index+1];
            }
        })
        console.log('key',keywords);
        var category = 'All';
        const snapWithoutOptions = await db.collection('/products').where('hasOptions','==',false).where('tags','array-contains-any',keywords).get();
        const snapWithOptions = await db.collection('/products').where('hasOptions','==',true).where('tags','array-contains-any',keywords).get();
        if( snapWithOptions.empty && snapWithoutOptions.empty ){ console.log('nothing found'); return; }
        var out=[];
        snapWithoutOptions.forEach(doc=>{
            var data = doc.data();
            if(!data.categories.includes(category)) return;
            var matches = data.tags.reduce((acc,tag)=> (keywords.includes(tag))?(acc+1):(acc) ,0);
            // if(matches>0) 
            out.push({ id: doc.id, productName:data.productName, price:data.price, defaultImage:data.images[0], option: false, matches });
        })
        snapWithOptions.forEach(doc=>{
            var data = doc.data();
            if(!data.categories.includes(category)) return;
            var optionsKeys = Object.keys(data).filter(each => each.startsWith('option_'));
            optionsKeys.forEach((key,index)=>{
                var matches = data[key].optionTags.reduce((acc,tag)=> (keywords.includes(tag))?(acc+1):(acc) ,0);
                // if(matches>0) 
                out.push({ id: doc.id, productName:data[key].productFullName, price:data[key].price, defaultImage:data[key].images[0], option: key, matches });
            });
        })
        out = _.orderBy( out, ['matches','option'], ['desc','asc']);
        console.log(out);
        setProductsList(out);
    }

    return (
        <div className="Test Page container">
            <p>test: Search Page</p>
            <input onKeyDown={e=>{ if(e.keyCode == 13)test(search) }} onChange={(e)=>{setSearch(e.target.value)}} type="text" value={search} />
            <p>SearchTerm: {search}</p>
            <button onClick={()=>{test('OnePlus 8 (Glacial Green 6GB RAM+128GB Storage)')}} >OnePlus 8 (Glacial Green 6GB RAM+128GB Storage)</button>
            {
                productsList && productsList.map(product=> ( <ProductCard product={{...product, rating:4.2}} /> ) )
            }
        </div>
    )
}

export default Test
