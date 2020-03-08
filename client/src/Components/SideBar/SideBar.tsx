import React from "react";
import "../../Styles/Chat.css";

const SideBar =(props:any)=>(  
        <div className="users-container">
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
            <ul className="users">
                {props.users}
            </ul>
      </div>
)
export default SideBar;