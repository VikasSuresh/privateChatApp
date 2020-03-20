const io = require('./index.js').io
const Stomp=require('stompit');
const userMessage=require('./models/userMessage')
const offlineMessage=require('./models/offlineMessage')

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

	var manager = new Stomp.ConnectFailover([connectOptions], {
		'maxReconnects': 10 
	  });

const users=[]
var id,sent
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
				id=data.id
				sent=false
			}
		}
	})
	function sendOfflineMessage(id){
		offlineMessage.findById(id)
			.then(data=>{
				if(data!==null && data.chats.length!==0){
					if(sent===false){
						data.chats.forEach(async d => {
							await privateMessage(d.rid,d.sid,d.msg,d.time)
						});
						data.chats=[]
						data.save()
							.catch(err=>console.log(err))
						}
						sent=true
					}		
			})
	}
	socket.on('getOfflineMessage',()=>{
		sendOfflineMessage(id)
	})

	function privateMessage(rid,sid,msg,time){
		if(rid!=="" &&sid!=="" &&msg!==""){
			manager.connect((err,client,reconnect)=>{
				if(err) throw new Error(err);
				client.on('error',(err)=>{
					reconnect();
				})
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
						userMessage.updateOne({_id:rid},{$push:{chats:JSON.parse(body)}},{upsert:true})
							.then(()=>{
								socket.to(rid).emit('push',body);
							})
							.catch(err=>console.log(err))
						client.ack(message);
						sub.unsubscribe();
						client.disconnect();
					});
				  });
				  
				  const sendHeaders = {
					'destination': 'test',
					'content-type': 'text/plain'
				  };
				  
				  const frame = client.send(sendHeaders);
				  frame.write(JSON.stringify({rid:rid,sid:sid,msg:msg,time:time}));
				  frame.end()
			})
		}
	}	

	socket.on('privateMessage',({rid,sid,msg,time})=>{
		userMessage.updateOne({_id:sid},{$push:{chats:{rid:rid,sid:sid,msg:msg,time:time}}},{upsert:true})
			.then(()=>socket.to(sid).emit('push',JSON.stringify({rid:rid,sid:sid,msg:msg,time:time})))
			.catch(err=>console.log(err))
		if(users.map(m=>m.id).includes(rid)){
			privateMessage(rid,sid,msg,time)
		}else{
			offlineMessage.updateOne({_id:rid},{$push:{chats:{rid:rid,sid:sid,msg:msg,time:time}}},{upsert:true})
				.catch(err=>console.log(err))
		}
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
		socket.leave(id)
		socket.to(id).emit('logouted');
		io.emit('connectedUsers',users);
	})
}



