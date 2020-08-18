import React, { useState, useEffect } from 'react'
import $ from 'jquery';
import { authMessageResetAction, signupAction } from '../store/actions/authActions';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Signup(props) {
    
    const { authMessage, authError, signup, authMessageReset} = props;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [firstNameBlur, setFirstNameBlur] = useState(false);
    const [lastNameBlur, setLastNameBlur] = useState(false);
    const [emailBlur, setEmailBlur] = useState(false);
    const [passwordBlur, setPasswordBlur] = useState(false);
    const [confirmPasswordBlur, setConfirmPasswordBlur] = useState(false);

    var [allValid, setAllValid] = useState(false);

    var [authLog,setAuthLog] =  useState('');

    const history = useHistory();

    useEffect(()=>{  if(!firstNameBlur){ return;}  firstNameValidation(); },[firstName]);
    useEffect(()=>{  if(!lastNameBlur){ return;}  lastNameValidation(); },[lastName]);
    useEffect(()=>{  if(!emailBlur){ return;}  emailValidation(); },[email]);
    useEffect(()=>{ if(!passwordBlur){ return;} passwordValidation(); },[password]);
    useEffect(()=>{ if(!confirmPasswordBlur){ return;} confirmPasswordValidation(); },[confirmPassword]);
    
    useEffect(()=>{
        console.log('authMessage',authMessage, authError);
        if(authMessage == 'SIGNUP_SUCCESS'){ 
            setAuthLog('You are successfully signed up and logged in.');
            setTimeout(()=>{ history.push('/') },3000)
        }
        else { setAuthLog(authError) };
        setTimeout(()=>{
            authMessageReset();
        },5000)
    },[authMessage]);

    
    var renderLog = (authMessage=="AUTH_MESSAGE_RESET" || authMessage == null)?null
        :(<span className={(authMessage=="SIGNUP_SUCCESS")?"success":"error"} >{authLog}</span>);

    const firstNameValidation = ()=>{
        if(firstName.length==0){ setInvalid('firstName', 'enter your firstName'); return;}
        setValid('firstName'); return;
    }

    const lastNameValidation = ()=>{
        if(lastName.length==0){ setInvalid('lastName', 'enter your lastName'); return;}
        setValid('lastName'); return;
    }

    const emailValidation = ()=>{
        if(email.length==0){ setInvalid('email', 'enter your email'); return;}
        var regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        if( !regexEmail.test(email) ){ setInvalid('email', 'email not valid'); return;}
        setValid('email'); return;
    }

    const passwordValidation = ()=>{
        if(password.length==0){ setInvalid('password', 'enter your password'); return;}
        if( password.length<8){ setInvalid('password', 'password should be a minimum of 8 characters'); return;}
        setValid('password'); return;
    }

    const confirmPasswordValidation = ()=>{
        if(confirmPassword.length==0){ setInvalid('confirmPassword', 'confirm your password'); return;}
        if( confirmPassword!=password){ setInvalid('confirmPassword', 'passwords didnot match'); return;}
        setValid('confirmPassword'); return;
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
        setFirstNameBlur(true);
        setLastNameBlur(true);
        setEmailBlur(true);
        setPasswordBlur(true);
        setConfirmPasswordBlur(true);
        firstNameValidation();
        lastNameValidation();
        emailValidation();
        passwordValidation();
        confirmPasswordValidation();
        if($('.input-field.invalid').length == 0) allValid= true;
        else allValid = false;
    }

    const handleSubmit= (e)=>{
        e.preventDefault();
        formValidation();
        console.log('formvalidation', allValid);
        if(allValid){ 
            signup({firstName, lastName, email, password, confirmPassword})
        }
        else console.log('form is invalid');
    }

    return (
        <div className="Signup">
            <div className="form-container">
                <div className="card">
                    <div className="card-title">
                        <span className="light_text">Sign</span>
                        <span className="heavy_text">Up</span>
                    </div>
                    <div className="card-content">
                    <div className="log center">
                        {renderLog}
                    </div>
                        <form className="row" onSubmit={handleSubmit}>
                            
                            <div className="col s6 input-field firstName-field">
                                <i className="material-icons prefix">person</i>
                                <label htmlFor="firstName">First Name</label>
                                <input onChange={(e)=>{setFirstName(e.target.value)}}  onBlur={()=>{setFirstNameBlur(true); firstNameValidation();}} id="firstName" type="text" value={firstName}/>
                                <span className="helper-text firstName-helper-text"></span>
                            </div>

                            <div className="col s6 input-field lastName-field">
                                <i className="material-icons prefix"></i>
                                <label htmlFor="lastName">Last Name</label>
                                <input onChange={(e)=>{setLastName(e.target.value)}}  onBlur={()=>{setLastNameBlur(true); lastNameValidation();}} id="lastName" type="text" value={lastName}/>
                                <span className="helper-text lastName-helper-text"></span>
                            </div>

                            <div className="col s12 input-field email-field">
                                <i className="material-icons prefix">email</i>
                                <label htmlFor="email">Email</label>
                                <input onChange={(e)=>{setEmail(e.target.value)}}  onBlur={()=>{setEmailBlur(true); emailValidation();}} id="email" type="email" value={email}/>
                                <span className="helper-text email-helper-text"></span>
                            </div>

                            <div className="col s12 input-field password-field">
                                <i className="material-icons prefix">fingerprint</i>
                                <label htmlFor="password">Password</label>
                                <input onChange={(e)=>{setPassword(e.target.value)}} onBlur={()=>{setPasswordBlur(true); passwordValidation();}} id="password" type="password" value={password}/>
                                <span className="helper-text password-helper-text"></span>
                            </div>
                            <div className="col s12 input-field confirmPassword-field">
                                <i className="material-icons prefix">check_circle</i>
                                <label htmlFor="confirmPassword">confirmPassword</label>
                                <input onChange={(e)=>{setConfirmPassword(e.target.value)}} onBlur={()=>{setConfirmPasswordBlur(true); confirmPasswordValidation();}} id="confirmPassword" type="password" value={confirmPassword}/>
                                <span className="helper-text confirmPassword-helper-text"></span>
                            </div>

                            <div className="center">
                                <button className="btn signup_btn">Signup</button>
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
        signup: (newUser)=>{ dispatch( signupAction(newUser) ) },
        authMessageReset: ()=>{ dispatch( authMessageResetAction() ) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
