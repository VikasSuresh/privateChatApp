import React from "react";
import { NavLink } from "react-router-dom";
import Axios from "axios";

class Login extends React.Component<any,any>{
    state={
        userDetails:{
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
        Axios.post('http://localhost:8000/user/login',this.state.userDetails)
        .then(({data})=>{
            console.log(data)
            this.props.history.push(`/chat/${data.name}/${data._id}`)
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
                    <label>
                       Password
                    </label>
                    <input type='password' onChange={this.handleChange} name="password" /><br/>
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