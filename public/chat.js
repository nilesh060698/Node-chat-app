



    var socket=io();



       function shouldScroll(){


        var clientHeight=$("#messages").prop('clientHeight');
        var scrollTop=$("#messages").prop('scrollTop');
        var elementHeight=$("#messages").prop('scrollHeight');
        var newMessage=$("#messages").children('li:last-child')
        // console.log(newMessage);
        var lastMessageHeight=newMessage.prev().innerHeight();
        var newMessageHeight=newMessage.innerHeight();


        // console.log(scrollTop);
        // console.log(elementHeight);
        // console.log(clientHeight);
        // console.log(lastMessageHeight);
        // console.log(newMessageHeight);
        if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>elementHeight)
        {
          $("#messages").scrollTop(elementHeight+30);
          // console.log(scrollTop);
          // console.log(elementHeight);
          // console.log(clientHeight);
          // console.log(lastMessageHeight);
          // console.log(newMessageHeight);
        }

         }


  $(function(){








    $("#message-chat").submit(function(e){

      e.preventDefault();

      if($("[name=message]").val()!='')
      {

     socket.emit('createdMsg',{
       from:"User",
       text:$("[name=message]").val(),
     });



     }
     //
     // $("#message-chat").reset();
     document.getElementById('chat-text').value='';


    });

    $("#location").click(function(){
      if(!navigator.geolocation){
        console.log("browser does not support location");
      }

      navigator.geolocation.getCurrentPosition(function(position){
      console.log(position.coords.latitude);
       socket.emit('createdLocation',{
         latitude:position.coords.latitude,
          longitude:position.coords.longitude
       });
    },function(){
      console.log("unable to fetch");
    });




    });









  });













  socket.on('connect',()=>{

   console.log("connected ton server");
    var params=jQuery.deparam(window.location.search);
   socket.emit('join',params,function(err){
     if(err)
     {
       alert(err);
       window.location.href='/';
       console.log(err);
     }
     else {

       console.log("no error");

     }

   });






  });



  socket.on('disconnect',()=>{
  console.log("server disconnected");

  });
 socket.on('updateUserList',function(users){
   console.log('Users list',users);
   var ol=jQuery('<ol></ol>');
     users.forEach(function(user){
     ol.append(jQuery('<li></li>').text(user));

   });
   $('#users').html(ol);

 });






  socket.on('newMsg',(msg)=>{
    console.log('newMsg',msg);
    var formattedTime=moment(msg.createdAt).format('h:mm a')
    if(msg.joined){
      var li=$(`<li style='margin-bottom:20px;'><i>${msg.joined}</i></li>`);
      $("#messages").append(li);



    }
    if(msg.left){
      var li=$(`<li style='margin-bottom:20px;'><i>${msg.left}</i></li>`);
      $("#messages").append(li);



    }

    if(msg.from && msg.text)
    {
          var li=$("<li style='margin-bottom:20px;'></li>");
          li.html(`<h4 style='font-weight:bold;'>${msg.from}
          <i style='color:grey;'>${formattedTime}</i><br>
          </h4><li style='margin-left:20px; margin-top:5px;'> ${msg.text}</li>`);
          $("#messages").append(li);
          shouldScroll();
    }

     if(msg.longitude)
     {
            var li=$('<li></li>');
            var a=$(`<a target='_blank' style='margin-bottom:40px;'>${formattedTime}</br>${msg.from}'s cuurent location</a>`)
            a.attr('href',`http://google.com/maps?q=${msg.latitude},${msg.longitude}`);
            li.append(a);
            $("#messages").append(li);

      }



  });
