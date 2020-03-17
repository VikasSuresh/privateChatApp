import React from "react";
import io from "socket.io-client";
import SideBar from "../../Components/SideBar";
import Message from "../../Components/Message";
import jwt from "jsonwebtoken";
import Axios from "axios";

class Chat extends React.Component<any,any>{
   state={
    currUser:{
        id:'',
        name:''
    },
    users:[{
        id:'',
        name:'',
        socketid:''
    }],
    prevUsers:[{
        id:'',
        name:'',
        socketid:''
    }],
    recieverId:'',
    msg:'',
    chats:[{
        rid:'',
        sid:'',
        msg:''
    }],
    socket:io.connect(process.env.REACT_APP_API||'http://localhost:8000')
   }
   componentWillUnmount(){
    
   }
   componentDidMount(){
        const {socket}=this.state;
        var retrievedObject:any = localStorage.getItem('token');
            retrievedObject=(jwt.decode(retrievedObject));
            if(retrievedObject!==null){
                Axios.get(`${process.env.REACT_APP_API}user/onMount/${retrievedObject.id}`).then(({data}:any)=>{
                if (data!==null && data!==""){
                    this.setState({
                        chats:data.data.chats,
                        prevUsers:data.prevUsers,
                        currUser:{
                            name:retrievedObject.name,
                            id:retrievedObject.id
                            }
                        })
                    }
                })
                socket.emit('usersConnected',retrievedObject);
                this.setState({
                    currUser:{
                        name:retrievedObject.name,
                        id:retrievedObject.id
                    }
                })
            }else{
                this.props.history.push('/login')
            }
            
        socket.on('logouted',()=>{
            this.props.history.push('/login')
        })
        socket.on('push',(data:any)=>{
            const {sid,msg,rid}:any=JSON.parse(data)
            this.setState((prevState:any)=>({
                ...prevState,
                chats:[
                    ...prevState.chats,
                    {sid:sid,msg:msg,rid:rid}
                ]
            }))
        })
        socket.on('connectedUsers',(users:any)=>{
            this.setState({
                users:users
            })
        })
        socket.on('disconnect',()=>{
            alert("Disconnected refresh to connect again")
            window.location.reload()
        })
        window.addEventListener('beforeunload',(e)=>{
            e.preventDefault();
            this.end()
        })
        // window.addEventListener('blur',()=>{
        //    console.log('yo')
        //     this.end()
        // })
        this.setState({
            socket
        })
   }
   end=()=>{
    Axios.post(`${process.env.REACT_APP_API}user/onUnmount`,{id:this.state.currUser.id ,chats:this.state.chats})
    .then(({data})=>{
        console.log(data===true?"Logouted":"Some Prblem in Logging out")
    }).catch((err)=>{
        console.log(err,"err")
    })
   }
   logout=()=>{
       this.setState(()=>{
            this.state.socket.emit('logout',this.state.currUser); 
            localStorage.removeItem('token');
            this.end()
            this.props.history.push('/login')
            return{
                state:{}
            }
       })
   }
   handleText=(e:any)=>{       
        this.setState({
            msg:e.target.value
        })
   }

   handleKeyPress=(e:any)=>{
        if(e.key==="Enter" && this.state.users.map(u=>u.id).includes(this.state.recieverId)){this.submit(e)}
   }
   submit=(e:any)=>{
       e.preventDefault();
       if(this.state.users.map(u=>u.id).includes(this.state.recieverId)){
            this.setState((prevState:any)=>{
                this.state.socket.emit('privateMessage',{rid:this.state.recieverId,sid:this.state.currUser.id,msg:this.state.msg})
                return{
                ...prevState,
                msg:'',
                chats:[
                    ...prevState.chats,
                    {sid:this.state.currUser.id,msg:this.state.msg,rid:this.state.recieverId}
                ]}
            })
        }else{
            alert("The User is Offline")
        }
       
   }
   onUserClick=(e:any)=>{
        this.setState({
            recieverId:e.target.value
        })
   }
    render(){
        let prevUsers:any=this.state.prevUsers.map((m:any,index:any)=>{
            if(m.id!==""){
                return(    
                    <li className="person" data-chat="person" key={index} >
                        <button className="userButton" onClick={this.onUserClick} value={m._id}>
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
        let renderUser:any=this.state.users.map((m:any,index:any)=>{
            if(m.id!==this.state.currUser.id && m.id!==""){
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
        let renderMsg:any=this.state.chats.map((m:any,index:any)=>{
            if(m.sid===this.state.recieverId && m.sid!==""){
                return(
                <li className="chat-right" key={index}>
                    <div className="user-details">
                        <figure>
                            <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin" />
                        </figure>
                        <div className="single-message">
                            <div className="chat-name">
                                <h5>{this.state.users.filter(u=>u.id===m.sid).map(m=>m.name)}</h5>
                                <time>08:55</time>
                            </div>
                            <p>
                            {m.msg}
                            </p>
                        </div>
                    </div>
				</li>)
            }else if(m.sid===this.state.currUser.id && m.sid!=="" && m.rid===this.state.recieverId){
                return(
                    <li className="chat-left" key={index}>
                        <div className="user-details">
                            <figure>
                                <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="Retail Admin" />
                            </figure>
                            <div className="single-message">
                                <div className="chat-name">
                                    <h5>{this.state.users.filter(u=>u.id===m.sid).map(m=>m.name)}</h5>
                                    <time>08:55</time>
                                </div>
                                <p>
                                {m.msg}
                                </p>
                            </div>
                        </div>
                    </li>)
            }
        })
       return(
           <div className="container-fluid">           
                <div className="row">
                    <div className="col-sm-4">
                        <SideBar logout={this.logout}currUser={this.state.currUser} users={renderUser} prevUsers={prevUsers}/>
                    </div>
                    <div className="col-sm-8">
                    {
                        this.state.recieverId!=="" && this.state.recieverId !== undefined
                        ?<Message defaultMsg={this.state.msg}
                        keyPress={this.handleKeyPress} msgs={renderMsg} 
                        rname={this.state.users.filter(u=>u.id===this.state.recieverId).map(m=>m.name)}
                        handleText={this.handleText}
                        submit={this.submit}/>
                        :<div>Select A Person a Text</div>
                    }
                    </div>
                </div>
            </div>
       )
   }
   
}

export default Chat;