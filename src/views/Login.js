import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import { loginAction, authMessageResetAction } from '../store/actions/authActions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Login(props) {
    
    const { authMessage, authError, login, authMessageReset} = props;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailBlur, setEmailBlur] = useState(false);
    const [passwordBlur, setPasswordBlur] = useState(false);

    var [allValid, setAllValid] = useState(false);

    var [authLog,setAuthLog] =  useState('');

    const history = useHistory();


    useEffect(()=>{
        if(!emailBlur){ return;}
        emailValidation();
    },[email]);

    useEffect(()=>{
        if(!passwordBlur){ return;}
        passwordValidation();
    },[password]);
    
    useEffect(()=>{
        console.log('authMessage',authMessage, authError);
        if(authMessage == 'LOGIN_SUCCESS'){ 
            setAuthLog('You are successfully logged in.');
            setTimeout(()=>{ history.push('/') },3000)
        }
        else { setAuthLog(authError) };
        setTimeout(()=>{
            authMessageReset();
        },5000)
    },[authMessage]);

    
    var renderLog = (authMessage=="AUTH_MESSAGE_RESET" || authMessage == null)?null
        :(<span className={(authMessage=="LOGIN_SUCCESS")?"success":"error"} >{authLog}</span>);

    const emailValidation = ()=>{
        if(email.length==0){ setInvalid('email', 'enter your email'); return;}
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if( !regexEmail.test(email) ){ setInvalid('email', 'email not valid'); return;}
        setValid('email'); return;
    }

    const passwordValidation = ()=>{
        if(password.length==0){ setInvalid('password', 'enter your password'); return;}
        if( password.length<8){ setInvalid('password', 'password length might be greater'); return;}
        setValid('password'); return;
    }

    const setInvalid = (field, errorMessage)=>{
        $(`.${field}-field`).removeClass('valid').addClass('invalid');
        $(`.${field}-helper-text`).html(errorMessage);
    }
    const setValid = (field)=>{
        $(`.${field}-field`).removeClass('invalid').addClass('valid');
        $(`.${field}-helper-text`).html('');
    }

    const formValidation = ()=>{
        setEmailBlur(true);
        setPasswordBlur(true);
        emailValidation();
        passwordValidation();        
        if($('.input-field.invalid').length == 0) allValid= true;
        else allValid = false;
    }

    const handleSubmit= (e)=>{
        e.preventDefault();
        formValidation();
        console.log('formvalidation', allValid);
        if(allValid){ 
            console.log(email, password);
            props.login({email,password});
        }
        else console.log('form is invalid');
    }

    return (
        <div className="Login">
            <div className="form-container">
                <div className="card">
                <div className="card-title">
                        <span className="light_text">Log</span>
                        <span className="heavy_text">In</span>
                    </div>
                    <div className="card-content">
                    <div className="log center">
                        {renderLog}
                    </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-field email-field">
                                <i className="material-icons prefix">email</i>
                                <label htmlFor="email">Email</label>
                                <input onChange={(e)=>{setEmail(e.target.value)}}  onBlur={()=>{setEmailBlur(true); emailValidation();}}id="email" type="email" value={email}/>
                                <span className="helper-text email-helper-text"></span>
                            </div>
                            <div className="input-field password-field">
                                <i className="material-icons prefix">fingerprint</i>
                                <label htmlFor="password">Password</label>
                                <input onChange={(e)=>{setPassword(e.target.value)}} onBlur={()=>{setPasswordBlur(true); passwordValidation();}} id="password" type="password" value={password}/>
                                <span className="helper-text password-helper-text"></span>
                            </div>
                            <div className="center">
                                <button className="btn light_btn">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps =(state)=>{
    return{
        authError: state.auth.authError,
        authMessage: state.auth.authMessage
    }

}

const mapDispatchToProps = (dispatch)=>{
    return {
        login: (credentials)=>{ dispatch( loginAction(credentials) ) },
        authMessageReset: ()=>{ dispatch( authMessageResetAction() ) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
