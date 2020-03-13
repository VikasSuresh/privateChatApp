import React from "react";
import jwt from 'jsonwebtoken'
class Home extends React.Component<any,any>{
    componentDidMount(){
        let atrb:any=localStorage.getItem('token')
        if(jwt.decode(atrb)){
            this.props.history.push('/chat')
        }
    }
    render(){
        return(<div>
            <button type="button" onClick={()=>this.props.history.push("/login")}>
                Login
            </button>
            <button type="button" onClick={()=>{this.props.history.push("/register")}}>
                Register
            </button>
        </div>)
    }
}

export default Home;