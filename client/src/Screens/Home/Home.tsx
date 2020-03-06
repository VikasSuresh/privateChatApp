import React from "react";

class Home extends React.Component<any,any>{
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