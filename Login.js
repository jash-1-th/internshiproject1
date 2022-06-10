import React, { useState, useReducer,useEffect,useContext,useRef } from "react";
import { AuthContext } from "../../auth_context";
import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  } else if (action.type === "ON_BLUR") {
    return { value: state.value, isValid: action.isValidEmail };
  }
  return { value: "", isValid: false };
};
function passwordReducer(state, action) {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.trim().length >= 6 };
  }
  if (action.type === "ON_BLUR") {
    return { value: state.value, isValid: state.value.trim().length >= 6 };
  }
  return { value: "", isValid: false };
}
const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: false,
  });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: false,
  });
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;
  useEffect(() => {
    console.log("checking.......")
    const interval = setTimeout(()=>{
      setFormIsValid(emailIsValid && passwordIsValid)
  },500);
    return () => {
      console.log("clearing interval....")
      clearTimeout(interval);
    };
  }, [emailIsValid,passwordIsValid]);
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_INPUT", val: event.target.value });
    setFormIsValid(
      event.target.value.includes("@") && passwordState.value.trim().length >= 6
    );
  };
  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_INPUT", val: event.target.value });
    setFormIsValid(event.target.value.trim().length >= 6 && emailState.isValid);
  };

  const validateEmailHandler = () => {
    if (emailState.value.includes("@")) {
      dispatchEmail({ type: "ON_BLUR", isValidEmail: true });
    }
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "ON_BLUR" });
  };
  const cxt = useContext(AuthContext)
  const InputRefEmail = useRef()
  const InputRefPassword = useRef()
  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid){
    cxt.onLogin(emailState.value, passwordState.value);
    }
    else if(!emailIsValid){
      InputRefEmail.current.focus()
    }
    else{
      InputRefPassword.current.focus()
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <Input
            htmlFor = 'email'
            type = 'email'
            id = 'email'
            label = 'E-mail'
            value = {emailState.value}
            onChange = {emailChangeHandler}
            onBlur = {validateEmailHandler}
            ref = {InputRefEmail} 
          />          
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
           <Input
            htmlFor = 'password'
            type = 'password'
            id = 'password'
            label = 'Password'
            value = {passwordState.value}
            onChange = {passwordChangeHandler}
            onBlur = {validatePasswordHandler}
            ref = {InputRefPassword} 
          />      
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
