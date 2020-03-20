import React from "react";
import { NavLink } from "react-router-dom";
import Axios from "axios";
import jwt from "jsonwebtoken";

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
            <div>
                <form onSubmit={this.submit}>
                    <label>
                        User Name
                    </label>
                    <input type='text' onChange={this.handleChange} name="username" /><br/>
                    <div className="text-danger">{this.state.err.username}</div>
                    <label>
                       Password
                    </label>
                    <input type='password' onChange={this.handleChange} name="password" /><br/>
                    <div className="text-danger">{this.state.err.password}</div>
                    <button type='submit'>Submit</button>
                    <div>
                        Dont have an Acc
                    <NavLink to='/register'>
                        SignUp    
                    </NavLink>
                    </div>
                   
                </form>
            </div>
        )
    }
}

export default Login;