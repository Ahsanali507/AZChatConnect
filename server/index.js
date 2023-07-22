// import http from 'http';
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';
// import socketIO from 'socket.io';
const http=require('http');
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const socketIO=require('socket.io');

const app= express();
const PORT=5000||process.env.PORT;
const server=http.createServer(app);

const users=[{}];

const io=socketIO(server);

app.get('/',(req,res)=>{
    res.send('here');
})

//whenever io is open run following function in it
io.on("connection",(socket)=>{
    console.log("new connection");
    
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined`);
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined`});
        socket.emit('Welcome',{user:'Admin',message:`Welcome to chat ${users[socket.id]}`});
    })
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('leaves',{user:"Admin",message:`${users[socket.id]} has left`});
        console.log("this user left");
    })
})

server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})



