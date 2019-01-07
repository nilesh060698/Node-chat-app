const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');
var app=express();
var server=http.createServer(app);
var io=socketIO(server);
const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;


app.use(express.static(publicPath));


io.on('connection',(socket)=>{

      console.log('new user connected');
      // socket.emit('newMsg',{
      // from:'aman',
      // text:'hey how are you  nilesh',
      // createdAT:123
      //
      //  });
       socket.on('createdMsg',(msg)=>{
          console.log('createdMsg',msg);
       io.emit('newMsg',{
         from:msg.from,
         text:msg.text,
         createdAt:new Date().getTime()

       })


       });




      socket.on('disconnect',()=>{
      console.log('user diconnected');





  })

});


server.listen(port,()=>{

  console.log(`server is up port ${port} `);

});
