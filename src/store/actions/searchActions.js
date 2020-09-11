import _ from "lodash";

export const searchAction = (searchTerm, category)=>{
    // console.log('in searchAction', searchTerm, category);
    return async (dispatch, getState, {getFirestore, getFirebase})=>{
        dispatch({type:'SEARCH_IN_PROGRESS'});
        const firestore = getFirestore();
        searchTerm= searchTerm.toLowerCase();
        var keywords = searchTerm.split(/(?:,| |\+|-|\(|\))+/);
        
        //  console.log('key',keywords);
        const snapWithoutOptions = await firestore.collection('/products').where('hasOptions','==',false).where('tags','array-contains-any',keywords).get();
        const snapWithOptions = await firestore.collection('/products').where('hasOptions','==',true).where('tags','array-contains-any',keywords).get();
        if( snapWithOptions.empty && snapWithoutOptions.empty ){ 
            // console.log('nothing found'); return dispatch({ type:"SEARCH_RESULTS_NOT_FOUND", err: "No Results Found" }); 
        }
        var out=[];
        snapWithoutOptions.forEach(doc=>{
            try{
                // console.log(doc.id)
                var data = doc.data();
                if(!data.categories.includes(category)) return;
                var matches = data.tags.reduce((acc,tag)=> (keywords.includes(tag))?(acc+1):(acc) ,0);
                // if(matches>0) 
                out.push({
                    id: doc.id, 
                    productName:data.productName, 
                    price:data.price, 
                    defaultImage:data.images[0], 
                    option: false, 
                    matches, 
                    rating: data.rating ?? 4.5
                });
            }catch(err){ return; }
        })
        snapWithOptions.forEach(doc=>{
            // console.log(doc.id)
            var data = doc.data();
            if(!data.categories.includes(category)) return;
            var optionsKeys = Object.keys(data.productOptions).sort();
            optionsKeys.forEach((key,index)=>{
                try{
                    // console.log('key',key);
                    if(!data.productOptions[key].isActive) return;
                    var matches = data.productOptions[key].optionTags.reduce((acc,tag)=> (keywords.includes(tag))?(acc+1):(acc) ,0);
                    // console.log(key, matches, data.productOptions[key].optionTags);
                    out.push({ id: doc.id,
                        productName:data.productOptions[key].productFullName,
                        price:data.productOptions[key].price,
                        defaultImage:data.productOptions[key].images[0],
                        option: key,
                        matches,
                        rating: data.rating ?? 4.5
                    });
                }
                catch(err){return;}
            });
        })
        out = _.orderBy( out, ['matches','option'], ['desc','asc']);
        // console.log(out);
        // console.log('Results=>',out);
        if(out.length > 0) dispatch({ type:"SEARCH_RESULTS_FETCHED", searchResults: out });
        else dispatch({ type:"SEARCH_RESULTS_NOT_FOUND", err: "No Results Found" });
    }
}

export const searchResetAction = ()=>{
    return (dispatch, getState, {getFirebase, getFirestore})=>{
        return dispatch({ type:"SEARCH_RESET" });
    }
}