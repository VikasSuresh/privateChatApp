import React from "react";
import jwt from 'jsonwebtoken'
class Home extends React.Component<any,any>{
    componentDidMount(){
        let atrb:any=localStorage.getItem('token')//cookie.get('token')
        if(jwt.decode(atrb)){
            this.props.history.push('/chat')
        }
    }
    render(){
        return(<div style={{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",fontSize:'20px'}}>
            <button className="btn-link" style={{marginRight:"20px"}} type="button" onClick={()=>this.props.history.push("/login")}>
                Login
            </button>
            <button className="btn-link" type="button" onClick={()=>{this.props.history.push("/register")}}>
                Register
            </button>
        </div>)
    }
}

export default Home;