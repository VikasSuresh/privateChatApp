import React from "react";
import "../../Styles/Chat.css";
const SideBar =(props:any)=>(
        <div className="users-container">
            <div>
                Hi {props.currUser.name}
                <button className="btn-link" onClick ={props.logout}style={{float:"right",marginRight:"10px"}}>
                    Logout
                </button>
            </div>
            <div className="chat-search-box">
                <div>
                    <input className="form-control" type="text" onChange={props.handleSearchText} placeholder="Search"/>
                </div>
            </div>
            <div>
                <ul className="users">
                    {props.prevUsers}
                </ul>
            </div>
            <div>
                <ul className="users">
                    {props.renderUser}
                </ul>
            </div>
      </div>
)  
export default SideBar;