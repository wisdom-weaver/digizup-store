import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'

import $ from 'jquery'
import M from 'materialize-css';
import { Dropdown, Button, Divider, Icon } from "react-materialize";

function Store() {
    useEffect(()=>{
        
    },[]);
    
    return (
        <div className="Store Page">
            <h1>Store</h1>
            <Dropdown
              id="Dropdown_6"
              options={{
                alignment: 'left',
                autoTrigger: true,
                closeOnClick: true,
                constrainWidth: true,
                container: null,
                coverTrigger: true,
                hover: false,
                inDuration: 150,
                onCloseEnd: null,
                onCloseStart: null,
                onOpenEnd: null,
                onOpenStart: null,
                outDuration: 250
              }}
              trigger={<Button node="button">Drop Me!</Button>}
            >
              <a href="#">
                one
              </a>
              <a href="#">
                two
              </a>
              <Divider />
              <a href="#">
                three
              </a>
              <a href="#">
                <Icon>
                  view_module
                </Icon>
                four
              </a>
              <a href="#">
                <Icon>
                  cloud
                </Icon>
                {' '}five
              </a>
            </Dropdown>
        </div>
    )
}

export default Store
