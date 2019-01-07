
  var socket=io();
  socket.on('connect',()=>{

   console.log("connected ton server");
   // socket.emit('createdMsg',{
   //     from:'Aman',
   //     text:'hi aman how are you',
   //     createdAt:123
   // });



  });



  socket.on('disconnect',()=>{
  console.log("server disconnected");

  });

  socket.on('newMsg',(msg)=>{
    console.log('newMsg',msg);

  });
