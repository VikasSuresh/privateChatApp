import React from "react";
import "../../Styles/Chat.css";
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
                    <input className="form-control" type="text" onChange={props.handleSearchText} placeholder="Search"/>
                    <div className="input-group-btn">
                        <button type="button" className="btn btn-info">
                            Search
                        </button>
                    </div>
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