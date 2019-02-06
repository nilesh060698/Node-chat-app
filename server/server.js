const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');
var app=express();
var server=http.createServer(app);
var moment=require('moment');
var io=socketIO(server);
const {isRealString}=require('../public/validation');
const {Users}=require('../public/users');
var users=new Users();

const publicPath=path.join(__dirname,'../public');
const port=process.env.PORT || 3000;



app.use(express.static(publicPath));



io.on('connection',(socket)=>{

      console.log('new user connected');





       socket.on('createdMsg',(msg)=>{
          console.log('createdMsg',msg);
          var user=users.getUser(socket.id);
          if(user){
            io.to(user.room).emit('newMsg',{

              from:user.name,
              text:msg.text,
              createdAt:moment().valueOf()


            });

          }

     // callback();

       });



       socket.on('join',(params , callback)=>{
         if(!isRealString(params.name)||!isRealString(params.room))
         {
           callback("name and room required");
         }

         socket.join(params.room);
         users.removeUser(socket.id);
          users.addUser(socket.id,params.name,params.room)
          io.to(params.room).emit('updateUserList',users.getUserList(params.room));

         socket.broadcast.to(params.room).emit('newMsg',{

             joined:`${params.name} just joined`
         });
         callback();


       });

        socket.on('createdLocation',(coords)=>{
          // io.emit('newMsg',{
          //     latitude:coords.latitude,
          //     longitude:coords.longitude,
          //     createdAt:moment().valueOf()
          //
          // });
          var user=users.getUser(socket.id);
          if(user){
            io.to(user.room).emit('newMsg',{

              from:user.name,
              latitude:coords.latitude,
              longitude:coords.longitude,
              createdAt:moment().valueOf(),



            });

          }






      });



       socket.on('disconnect',()=>{
       console.log('user diconnected');
       var user=users.removeUser(socket.id);
       if(user){
         io.to(user.room).emit('updateUserList',users.getUserList(user.room));
         io.to(user.room).emit('newMsg',{
           left:`${user.name} has left`
         });
       }





     });
       });










server.listen(port,()=>{

app.listen(port,()=>{


app.listen(port,()=>{


  console.log(`server is up port ${port} `);

});
