import React from "react";
import "../../Styles/Chat.css";
const Message=(props:any)=>(        
    <div className="content-wrapper">        
		<div className="selected-user">
			<span>To: <span className="name">Emily Russell</span></span>
		</div>
		<div className="chat-container">
			<ul className="chat-box chatContainerScroll">
				{props.msgs}
			</ul>
		</div>
		<div className="form-group mt-3 mb-0" >
			<form>
				<div className="input-group">
                    <input className="form-control" onChange={props.handleText} placeholder="Search"/>
                    <div className="input-group-btn">
                        <button type="button" onClick={props.submit} className="btn btn-primary">
                            Send
                        </button>
                    </div>
                </div>			
			</form>	
		</div>
	</div>
)

export default Message;
