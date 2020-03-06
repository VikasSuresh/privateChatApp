import React from "react";
import axios from "axios";
class Register extends React.Component<any,any>{
    state={
        userDetails:{
            name:'',
            username:'',
            password:'',
        }
       
    }
    submit=(e:any)=>{
        e.preventDefault();
        axios.post('http://localhost:8000/user/register',this.state.userDetails)
        .then((bool)=>{
            if(bool){
                this.props.history.push('/login')
            }
            
        }).catch(()=>{
            console.log('err')
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
                    <label>UserName</label> <input onChange={this.handleChange} name="username" type='text' /> <br/>
                    <label>Pwd</label> <input onChange={this.handleChange} name="password" type='password' /> <br/>
                    <label>ConfirmPwd</label> <input onChange={this.handleChange} name="confirmpwd" type='password' /> <br/>
                    <button type="submit">
                        Submit
                    </button>
                </form>
               
            </div>
        )
    }
}

export default Register;