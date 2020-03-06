const io = require('./index.js').io

const users=[]
module.exports=(socket)=>{
	socket.on('usersConnected',(data)=>{
		data.socketid=socket.id
		users.push(data)
		io.emit('connectedUsers',users);
	})
	socket.on('privateMessage',({rid,sid,msg})=>{
		const user=users.filter(m=>m.id===rid)
		io.to(user[0].socketid).emit('push', JSON.stringify({sid:sid,msg:msg}));
	});
	
	socket.on('disconnect',()=>{
		const user=users.filter(m=>m.socketid===socket.id)
		users.splice(users.indexOf(user),1)
		io.emit('connectedUsers',users);
	})
	
}



