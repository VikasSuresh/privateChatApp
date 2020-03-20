import React from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NavLink } from "react-router-dom";
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
            <div>
                <form onSubmit={this.submit}>
                    <label>Name</label> <input onChange={this.handleChange} name="name" type='text' /> <br/>
                    <div className='text-danger' id='name-err'>{this.state.err.name} </div>
                    <label>UserName</label> <input onChange={this.handleChange} name="username" type='text' /> <br/>
                    <div className='text-danger' id='uname-err'>{this.state.err.username} </div>
                    <label>Pwd</label> <input onChange={this.handleChange} name="password" type='password' /> <br/>
                    <div className='text-danger' id='pwd-err'>{this.state.err.password} </div>
                    <label>ConfirmPwd</label> <input onChange={this.handleChange} name="confirmpwd" type='password' /> <br/>
                    <div className='text-danger' id='cpwd-err'> {this.state.err.confirmpwd} </div>
                    <button type="submit">
                        Submit
                    </button>
                    <div>
                        Have an Acc
                    <NavLink to='/login'>
                        Login    
                    </NavLink>
                    </div>
                </form>
               
            </div>
        )
    }
}

export default Register;