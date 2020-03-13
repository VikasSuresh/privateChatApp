import React from "react";
import "../../Styles/Chat.css";
import { Link } from "react-router-dom";


const SideBar =(props:any)=>(
        <div className="users-container">
            <div>
                Hi {props.currUser.name}
                <button onClick ={props.logout}style={{float:"right",marginRight:"10px"}}>
                    Logout
                </button>
            </div>
            <div className="chat-search-box">
                <div className="input-group">
                    <input className="form-control" placeholder="Search"/>
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-info">
                            Search
                        </button>
                    </div>
                </div>
            </div>
            <div>
                Online :
                <ul className="users">
                    {props.users}
                </ul>
            </div>
            <div>
                Previous Chats:
                <ul className="users">
                    {props.prevUsers}
                </ul>
            </div>
            
      </div>
)  
export default SideBar;