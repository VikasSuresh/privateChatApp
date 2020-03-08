import React from "react";
import io from "socket.io-client";
import SideBar from "../../Components/SideBar";
import Message from "../../Components/Message";

class Chat extends React.Component<any,any>{
   state={
       users:[{
        id:'',
        name:'',
        socketid:''
    }],
    recieverId:'',
    msg:'',
    chats:[{
        sid:'',
        msg:''
    }],
    socket:io.connect('http://localhost:8000')
   }
   componentDidMount(){
        const {socket}=this.state
        socket.on('connect',()=>{
            console.log('connected')
        })
        socket.emit('usersConnected',{id:this.props.match.params.id,name:this.props.match.params.name})
        socket.on('push',(data:any)=>{
            const {sid,msg}:any=JSON.parse(data)
            this.setState((prevState:any)=>({
                ...prevState,
                chats:[
                    ...prevState.chats,
                    {sid:sid,msg:msg}
                ]
            }))
        })
        socket.on('connectedUsers',(users:any)=>{
            this.setState({
                users:users
            })
        })
   }
   handleText=(e:any)=>{       
        this.setState({
            msg:e.target.value
        })
   }
   submit=(e:any)=>{
       e.preventDefault();
       console.log('emit')
        this.state.socket.emit('privateMessage',{rid:this.state.recieverId,sid:this.props.match.params.id,msg:this.state.msg})
   }
   onUserClick=(e:any)=>{
        this.setState({
            recieverId:e.target.value
        })
   }
    render(){
        let renderUser:any=this.state.users.map((m:any,index:any)=>{
            if(m.id!==this.props.match.params.id){
                return (    
                    <li className="person" data-chat="person" key={index} >
                        <button className="userButton" onClick={this.onUserClick} value={m.id}>
                        <div className="user">
                            <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin" />
                            <span className="status online"></span>
                        </div>
                        <p className="name-time">
                            <span className="name">{m.name}</span>                            
                        </p>                        
                        </button>
                    </li> 
                )
            }
        })
        let renderMsg:any=this.state.chats.map(m=>{
            if(m.sid===this.state.recieverId && m.sid!==""){
                return(<li className="chat-left">
					<div className="chat-avatar">
						<img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin" />
						<div className="chat-name">Russell</div>
					</div>
					<div className="chat-text">
                        {m.msg}
                    </div>
					<div className="chat-hour">08:55 <span className="fa fa-check-circle"></span></div>
				</li>)
            }
        })
       return(
           <div className="container-fluid">
               {renderMsg}               
                <div className="row">
                <div className="col-sm-4">
                    <SideBar users={renderUser}/>
                </div>
                <div className="col-sm-8">
                    <Message msgs={renderMsg} handleText={this.handleText} submit={this.submit}/>
                </div>

                    {/* <div className="col-sm-4">
                        {this.state.chats.filter(m=>m.sid===this.state.recieverId).map(m=>m.msg)}
                        <form onSubmit={this.submit}>
                        <input onChange={this.handleText} type="text"></input>
                        <button type='submit'>submit</button>
                        </form>
                    </div> */}
                </div>
            </div>
       )
   }
   
}

export default Chat;