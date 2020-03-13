const io = require('./index.js').io


const users=[]
module.exports=(socket)=>{
	socket.on('usersConnected',(data)=>{
		if(data!==null){
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
		const user=users.filter(m=>m.id===rid)
		io.to(user[0].socketid).emit('push', JSON.stringify({rid:rid,sid:sid,msg:msg}));
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
		io.emit('connectedUsers',users);
	})
}



