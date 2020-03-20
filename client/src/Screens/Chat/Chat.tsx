import React from "react";
import io from "socket.io-client";
import SideBar from "../../Components/SideBar";
import Message from "../../Components/Message";
import jwt from "jsonwebtoken";
import Axios from "axios";

class Chat extends React.Component<any,any>{
   state={
    search:'',
    notify:[
        {id:'',notify:false},
    ],
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
        _id:'',
        name:''
    }],
    recieverId:'',
    msg:'',
    chats:[{
        rid:'',
        sid:'',
        msg:'',
        time:'',
    }],
    socket:io.connect(process.env.REACT_APP_API||'http://localhost:8000')
   }
   componentWillUnmount(){
    this.state.socket.close()
   }
   componentDidMount(){
        const {socket}=this.state;
        var retrievedObject:any = localStorage.getItem('token') //cookie.get('token')
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
            const {sid,msg,rid,time}:any=JSON.parse(data)
            if(sid!==this.state.recieverId && !(this.state.notify.filter(m=>m.id!=="").map(m=>m.id).includes(sid))){
                this.setState((prevState:any)=>({
                    ...prevState,
                    notify:[
                        ...prevState.notify,
                        {
                            id:sid,
                            notify:true
                        }
                    ],
                    chats:[
                        ...prevState.chats,
                        {sid:sid,msg:msg,rid:rid,time:time}
                    ]
                }),()=>{
                    this.settingPrevUsers(sid)
                })
            }else if(sid!==this.state.recieverId && this.state.notify.filter(m=>m.id!=="").map(m=>m.id).includes(sid)){
                this.setState((prevState:any)=>({
                    ...prevState,
                    notify:prevState.notify.map((n:any)=>n.id===sid?Object.assign(n,{notify:true}):n),
                    chats:[
                        ...prevState.chats,
                        {sid:sid,msg:msg,rid:rid,time:time}
                    ]
                }),()=>{
                    this.settingPrevUsers(sid)
                })
            }
            else{
                this.setState((prevState:any)=>({
                    ...prevState,
                    chats:[
                        ...prevState.chats,
                        {sid:sid,msg:msg,rid:rid,time:time}
                    ]
                }),()=>{
                    this.settingPrevUsers(sid)
                })
            }
        })
        socket.on('connectedUsers',(users:any)=>{
            this.setState((prevState:any)=>{
                socket.emit('getOfflineMessage')
                return{users:users}
            })
        })
        socket.on('disconnect',()=>{ 
            window.location.reload()
        })
        this.setState({
            socket
        })
   }
   settingPrevUsers=(id:any)=>{
    if(!(this.state.prevUsers.map(pu=>pu._id).includes(id)) && id!==this.state.currUser.id){
        this.setState((prevState:any)=>({
            ...prevState,
            prevUsers:[
                ...prevState.prevUsers,
                this.state.users.filter(u=>u.id===id).map(u=>{return{_id:u.id,name:u.name}})[0]
                ]
            }))
        }
   }
   logout=()=>{
       this.setState(()=>{
            this.state.socket.emit('logout',this.state.currUser); 
            localStorage.removeItem('token')
            //cookie.remove('token');
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
   handleSearchText=(e:any)=>{
        this.setState({
            search:e.target.value
        })
   }

   handleKeyPress=(e:any)=>{
        if(e.key==="Enter"){this.submit(e)}
   }
   submit=(e:any)=>{
       e.preventDefault();
        var time=`${new Date().getHours()}:${new Date().getMinutes()}`
        this.setState((prevState:any)=>{
            this.state.socket.emit('privateMessage',{rid:this.state.recieverId,sid:this.state.currUser.id,msg:this.state.msg,time:time})
            return{
            ...prevState,
            msg:'',
            chats:[
                ...prevState.chats,
                {sid:this.state.currUser.id,msg:this.state.msg,rid:this.state.recieverId,time:time}
            ]}
        },()=>{
            this.settingPrevUsers(this.state.recieverId)
        })
   }
   onUserClick=(e:any)=>{
        if(this.state.notify.filter(n=>n.id===e.target.value).length!==0){
            var x=this.state.notify
            x.forEach(element => {
                if(element.id===e.target.value){
                    element.notify=false
                }
            });
            this.setState({
                notify:x,
                recieverId:e.target.value
            })
        }else{
            this.setState({
                recieverId:e.target.value
            })
        }
   }
    render(){
        let regex=new RegExp(`^${this.state.search}`,'i')
        let prevUsers:any=this.state.prevUsers.map((m:any,index:any)=>{
            if(this.state.search===""){
                if(m._id!==""){
                    return(    
                        <li className="person" data-chat="person" key={index} >
                            <button className="userButton" onClick={this.onUserClick} value={m._id}>
                            <div className="user">
                                <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="User" />
                                <span className={
                                    this.state.users.map(u=>u.id).includes(m._id)?"status online":"status offline"
                                }></span>
                            </div>
                            <p className="name-time">
                                <span className="name">{m.name}</span>  
                                <span className="notification">{
                                    this.state.notify.filter(n=>n.id===m._id).length!==0
                                    ?this.state.notify.filter(n=>n.id===m._id)[0].notify===true?<img src="https://img.icons8.com/android/18/000000/appointment-reminders.png"alt="notfication" />:""
                                    :""
                                }</span>                          
                            </p>                        
                            </button>
                        </li> 
                    )
                }
            }else{
                if(m._id!=="" && regex.test(m.name)){
                    return(    
                        <li className="person" data-chat="person" key={index} >
                            <button className="userButton" onClick={this.onUserClick} value={m._id}>
                            <div className="user">
                                <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="User" />
                                <span className={
                                    this.state.users.map(u=>u.id).includes(m._id)?"status online":"status offline"
                                }></span>
                            </div>
                            <p className="name-time">
                                <span className="name">{m.name}</span>  
                                <span className="notification">{
                                    this.state.notify.filter(n=>n.id===m._id).length!==0
                                    ?this.state.notify.filter(n=>n.id===m._id)[0].notify===true?<img src="https://img.icons8.com/android/18/000000/appointment-reminders.png"alt="notfication" />:""
                                    :""
                                }</span>                          
                            </p>                        
                            </button>
                        </li> 
                    )
                }
            }
            
        })
        let renderUser:any=this.state.users.map((m:any,index:any)=>{
            if(this.state.search===""){
                if(m.id!==this.state.currUser.id && m.id!=="" && !(this.state.prevUsers.map(u=>u._id).includes(m.id))){
                    return (    
                        <li className="person" data-chat="person" key={index} >
                            <button className="userButton" onClick={this.onUserClick} value={m.id}>
                            <div className="user">
                                <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="User" />
                                <span className="status online"></span>
                            </div>
                            <p className="name-time">
                                <span className="name">{m.name}</span>        
                                <span className="notification">{
                                    this.state.notify.filter(n=>n.id===m.id).length!==0
                                    ?this.state.notify.filter(n=>n.id===m.id)[0].notify===true?<img src="https://img.icons8.com/android/18/000000/appointment-reminders.png"alt="notfication" />:""
                                    :""
                                }</span>                    
                            </p>                        
                            </button>
                        </li> 
                    )
                }
            }else{
                if(m.id!==this.state.currUser.id && m.id!=="" && !(this.state.prevUsers.map(u=>u._id).includes(m.id)) && regex.test(m.name) ){
                    return (    
                        <li className="person" data-chat="person" key={index} >
                            <button className="userButton" onClick={this.onUserClick} value={m.id}>
                            <div className="user">
                                <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="User" />
                                <span className="status online"></span>
                            </div>
                            <p className="name-time">
                                <span className="name">{m.name}</span>
                                <span className="notification">{
                                    this.state.notify.filter(n=>n.id===m.id).length!==0
                                    ?this.state.notify.filter(n=>n.id===m.id)[0].notify===true?<img src="https://img.icons8.com/android/18/000000/appointment-reminders.png"alt="notfication" />:""
                                    :""
                                }</span>                       
                            </p>                        
                            </button>
                        </li> 
                    )
                }
            }
        })

        let renderMsg:any=this.state.chats.map((m:any,index:any)=>{
            if(m.sid===this.state.recieverId && m.sid!==""){
                return(
                <li className="chat-right" key={index}>
                    <div className="user-details">
                        <figure>
                            <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="User" />
                        </figure>
                        <div className="single-message">
                            <div className="chat-name">
                                <h5>{this.state.prevUsers.filter(u=>u._id===m.sid).map(m=>m.name)}</h5>
                                <time>{m.time}</time>
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
                                <img src="https://www.bootdey.com/img/Content/avatar/avatar3.png" alt="User" />
                            </figure>
                            <div className="single-message">
                                <div className="chat-name">
                                    <h5>{this.state.users.filter(u=>u.id===m.sid).map(m=>m.name)}</h5>
                                    <time>{m.time}</time>
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
                        <SideBar logout={this.logout} currUser={this.state.currUser} handleSearchText={this.handleSearchText} prevUsers={prevUsers} renderUser={renderUser}/>
                    </div>
                    <div className="col-sm-8">
                    {
                        this.state.recieverId!=="" && this.state.recieverId !== undefined
                        ?<Message defaultMsg={this.state.msg}
                        keyPress={this.handleKeyPress} msgs={renderMsg} 
                        rname={
                            this.state.users.filter(u=>u.id===this.state.recieverId).map(m=>m.name)[0]!==undefined
                            ?
                            this.state.users.filter(u=>u.id===this.state.recieverId).map(m=>m.name)
                            :
                            this.state.prevUsers.filter(u=>u._id===this.state.recieverId).map(m=>m.name)
                        }
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