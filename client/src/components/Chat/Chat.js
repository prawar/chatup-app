import React from 'react'
import MessageList from './Messagelist/MessageList'
import SendMessageForm from './SendMessageForm/SendMessageForm'
import RoomList from './RoomList/RoomList'
import NewRoomForm from './NewRomForm/NewRoomForm'


import './chat.css';


import io from "socket.io-client";

import { Redirect } from "react-router-dom";

import store from 'store';
import axios from 'axios';

let socket;
const ENDPOINT = 'http://localhost:5000';

class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      currentRoomId: null,
      joinedRooms: [],
      messages: [],
      currentMessages: [],
      loggedIn : true
    }
    this.subscribeToRoom = this.subscribeToRoom.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.subscribeToRoom = this.subscribeToRoom.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }


  componentDidMount() {

    //Connection b/w server-socket and client-socket
    socket = io(ENDPOINT);
    //console.log(socket);

    

    const email = store.get('state').email
    axios.get('http://localhost:5000/api/v1/chatup/join/' + email)
      .then(res => {
        console.log(res.data.rooms);
        console.log(res.data.joinedrooms);

        const rooms = res.data.rooms;
        const joinedrooms = res.data.joinedrooms;

        let roomId;

        joinedrooms.forEach(element => {
          var result = rooms.find(obj => {
            return obj.name === element;
          })

          roomId = result._id.valueOf();

          let roomName = result.name;

          this.setState({
            joinedRooms: [...this.state.joinedRooms, {
              "id": roomId,
              "name": roomName,
              "notify" : 0
            }],
            currentRoomId : roomId
          })

          this.setState({
            messages: [...this.state.messages, {
              "roomId": roomId,
              "message": []
            }]
          })

          const Username = store.get('state').name;
          
          socket.emit('join', { Username, roomId }, (error) => {
            if (error) {
              alert(error);
            }
          });

        });
        this.subscribeToRoom(roomId)
      })

    socket.on('message', (data, callback) => {
      const { user, text, roomId } = data;

      if (roomId === this.state.currentRoomId) {
        this.setState({
          currentMessages: [...this.state.currentMessages, { "user": user, "text": text }]
        })
      } else {
        this.state.joinedRooms.forEach(element => {
          if(element.id === roomId){
            element.notify++;
            console.log(`${roomId} and ${element.notify}`)
          }
        });
        this.state.messages.forEach(element => {
          if (element.roomId === roomId) {
            element.message = [...element.message, { "user" : user, "text": text }];
          }
        });
      }

      //console.log(`${text} by ${user} get from server`);
    })
  }


  componentWillUnmount() {

    //Disconnect with server
    socket.emit('disconnect');
    socket.off();

  }



  sendMessage(text) {

    if (text) {
      const data = {
        message: text,
        user: store.get('state').name,
        roomId: this.state.currentRoomId

      }
      socket.emit('sendMessage', data);

      //console.log(`${text} sent to server`)

      /*
      this.setState({
        currentMessages: [...this.state.currentMessages, { "user": data.user, "text": text }]
      })
      */
    }

  }

  handleLogout(){
    store.remove('loggedIn');
    this.setState({
      loggedIn : false
    })
  }



  joinRoom(roomName) {

    const room = {
      name: roomName,
      emailId: store.get('state').email
    }

    axios.post(`http://localhost:5000/api/v1/chatup/join/joinroom`, room)
      .then(res => {
        //console.log(res.data);

        if (res.data.success === true) {


          const Username = store.get('state').name;
          const roomId = res.data.id;

          socket.emit('join', { Username, roomId }, (error) => {
            if (error) {
              alert(error);
            }
          });


          const id = res.data.id;

          this.setState({
            messages: [...this.state.messages, {
              "roomId": id,
              "message": []
            }]
          })


          this.setState({
            joinedRooms: [...this.state.joinedRooms, {
              "id": id,
              "name": roomName,
              "notify" : 0
            }]
          })


          this.subscribeToRoom(id);
          //console.log(this.state);
        }
        else {
          console.log(res);
          console.log('Error');
        }
      })

    //const res = await axios.post('http://localhost:5000/api/v1/chatup/chat/joinroom', room)


  }

  subscribeToRoom(roomId) {

    this.state.messages.forEach(element => {
      if (element.roomId === this.state.currentRoomId) {
        
        element.message = [...this.state.currentMessages];
      
      }

    });

    this.state.joinedRooms.forEach(element => {
      if(roomId === element.id){
        element.notify = 0;
      }
    });

    this.state.messages.forEach(element => {
      if (element.roomId === roomId) {
        this.setState({

          currentMessages: [...element.message],
          currentRoomId: roomId

        })
      }
    });

  }

  render() {
  
    if (!store.get('loggedIn') || !this.state.loggedIn) {
      return (<Redirect to='/' />)
    }

    //store.remove('loggedIn');

    return (
      <div className="chat">
        <RoomList
          logout={this.handleLogout}
          rooms={[...this.state.joinedRooms]}
          subscribeToRoom={this.subscribeToRoom}
          currentRoomId={this.state.currentRoomId} />
        <MessageList
          currentRoomId={this.state.currentRoomId}
          messages={this.state.currentMessages} />
        <NewRoomForm onSubmit={this.joinRoom.bind(this)} />
        <SendMessageForm
          sendMessage={this.sendMessage}
          disabled={!this.state.currentRoomId} />
      </div>
    );
  }
}

export default Chat