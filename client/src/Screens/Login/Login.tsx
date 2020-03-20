import React from "react";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import jwt from "jsonwebtoken";
import './Login.css'

class Login extends React.Component<any,any>{
    componentDidMount(){
        let atrb:any=localStorage.getItem('token')//cookie.get('token')
        if(jwt.decode(atrb)){
            this.props.history.push('/chat')
        }
    }
    state={
        userDetails:{
            username:'',
            password:''
        },
        err:{
            username:'',
            password:''
        }
    }
    handleChange=(e:any)=>{
        e.preventDefault();
        const field=e.target.name;
        const value=e.target.value;
        this.setState((prevState:any)=>{
            return{
                ...prevState,
                userDetails:{
                    ...prevState.userDetails,
                    [field]:value
                }
            }
        })
    }
    submit=(e:any)=>{
        e.preventDefault();
        Axios.post(`${process.env.REACT_APP_API}user/login`,this.state.userDetails,{
            withCredentials:true
        })
        .then(({data})=>{
            if(data.success){
                localStorage.setItem('token',data.token)
                this.props.history.push(`/chat`)
            }else{
                this.setState((prevState:any)=>{
                    return{
                        ...prevState,
                        err:data
                    }
                })
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
    render(){
        return(
            <div className="main">
                <p className="sign" style={{textAlign:"center"}} >Sign in</p>
                <form className="form1" onSubmit={this.submit}>
                    <input className="un" type='text' onChange={this.handleChange} placeholder="User Name" name="username" />
                    <div className="text-danger" style={{textAlign:"center"}}>{this.state.err.username}</div>
                    <input className="pass" type='password' onChange={this.handleChange} placeholder="Password" name="password" />
                    <div className="text-danger" style={{textAlign:"center"}} >{this.state.err.password}</div>
                    <button className="submit" type='submit'>Sign in</button>
                    <div style={{textAlign:"center",paddingTop:"15px",paddingBottom:'5px'}}>
                            <NavLink className="forgot" to='/register'>
                                Sign up    
                            </NavLink>
                    </div>
                </form>
            </div>
        )
    }
}

export default Login;