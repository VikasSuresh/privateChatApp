import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NavLink } from "react-router-dom";
import './Register.css';
class Register extends React.Component<any,any>{
    componentDidMount(){
        let atrb:any=localStorage.getItem('token')// cookie.get('token')
        if(jwt.decode(atrb)){
            this.props.history.push('/chat')
        }
    }
    state={
        userDetails:{
            name:'',
            username:'',
            password:'',
            confirmpwd:''
        },
        err:{
            name:"",
            username:"",
            password:"",
            confirmpwd:''
        }
    }
    submit=(e:any)=>{
        e.preventDefault();
        axios.post(`${process.env.REACT_APP_API}user/register`,this.state.userDetails)
        .then(({data})=>{
            if(data===true){
                this.props.history.push('/login')
            }else{
                this.setState((prevState:any)=>{
                    return{
                        ...prevState,
                        err:data
                    }
                })
            }

        }).catch((errors)=>{
            console.log(errors)
        })
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

    render(){
        return(
            <div className="main">
               <p className="sign" style={{textAlign:"center"}} >Register</p>
                <form className="form1" onSubmit={this.submit}>
                    <input className="un" onChange={this.handleChange}  placeholder="Name" name="name" type='text' />
                    <div className='text-danger' style={{textAlign:"center"}} id='name-err'>{this.state.err.name} </div>
                    <input className="un" onChange={this.handleChange} placeholder="User Name" name="username" type='text' /> 
                    <div className='text-danger' style={{textAlign:"center"}} id='uname-err'>{this.state.err.username} </div>
                    <input className="pass" onChange={this.handleChange} placeholder="Password" name="password" type='password' /> 
                    <div className='text-danger' style={{textAlign:"center"}} id='pwd-err'>{this.state.err.password} </div>
                    <input className="pass" onChange={this.handleChange} placeholder="Confirm Password" name="confirmpwd" type='password' /> 
                    <div className='text-danger' style={{textAlign:"center"}} id='cpwd-err'> {this.state.err.confirmpwd} </div>
                    <button className="submit" type="submit">
                        Submit
                    </button>
                    <div style={{textAlign:"center",paddingTop:"15px",paddingBottom:'5px'}} >
                    <NavLink className="forgot"  to='/login'>
                        Login    
                    </NavLink>
                    </div>
                </form>
               
            </div>
        )
    }
}

export default Register;