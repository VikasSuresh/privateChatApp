const io = require('./index.js').io
const Stomp=require('stompit');
const config=require('config');

const connectOptions = {
	  'host': 'b-1b0765e1-971b-403c-a003-742240f2bfc9-1.mq.ap-south-1.amazonaws.com',
	  'port': 61614,
	  'ssl':true,
	  'connectHeaders':{
	    'host': '/',
	    'login': `${process.env.login}`,
	    'passcode': `${process.env.password}`,
	    'heart-beat': '5000,5000'
	  }
	};
	
const client=Stomp.connect(connectOptions)

const users=[]
module.exports=(socket)=>{
	socket.on('usersConnected',(data)=>{
		if(data!==null){
			socket.join(data.id)
			let temp = users.map(m=>m.id)
			if (temp.includes(data.id)){
				users.forEach(element => {
					if(element.id===data.id && element.socketid!==socket.id){
						element.socketid=socket.id
					}
				});
				io.emit('connectedUsers',users);
			}else{
				data.socketid=socket.id
				users.push(data)
				io.emit('connectedUsers',users);
			}
		}
	})

	

	socket.on('privateMessage',({rid,sid,msg})=>{
		const subscribeHeaders = {
		    'destination': 'test',
		    'ack': 'client-individual'
		  };
		
		var sub=client.subscribe(subscribeHeaders, function(error, message) {
			
		    if (error) {
		      console.log('subscribe error ' + error.message);
		      return;
		    }
		    message.readString('utf-8', function(error, body) {
			  
		      if (error) {
		        console.log('read message error ' + error.message);
		        return;
			  }
			  socket.to(rid).to(sid).emit('push',body);
			  client.ack(message);
			  sub.unsubscribe();
		    });
		  });
		  
		  const sendHeaders = {
		    'destination': 'test',
		    'content-type': 'text/plain'
		  };
		  
		  const frame = client.send(sendHeaders);
		  frame.write(JSON.stringify({rid:rid,sid:sid,msg:msg}));
		  frame.end()

		
		// var subscription=client.subscribe('/queue/test',(msg)=>{
		// 	socket.to(rid).to(sid).emit('push',msg.body);
		// 	subscription.unsubscribe();
		// })
		// console.log(client)
		// client.send('/queue/test',{},JSON.stringify({rid:rid,sid:sid,msg:msg}))
	});
	
	socket.on('disconnect',()=>{
		users.forEach((element,index)=> {
			if(element.socketid===socket.id){
				users.splice(index,1);
			}
		});
	})
	socket.on('logout',({name,id})=>{
		users.forEach((element,index)=> {
			if(element.id===id){
				users.splice(index,1);
			}
		});
		client.disconnect();
		socket.leave(id)
		socket.to(id).emit('logouted');
		io.emit('connectedUsers',users);
	})
}



