import Home from "./home/home";
import Chat from "./chat/chat";
import './App.scss';
import io from "socket.io-client";
import React, { useState } from "react";
const socket = io("localhost:8000");

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [secretPhrase, setSecretPhrase] = useState("");
  const [roomId, setRoomId] = useState("");

  return (
    <div className="App">
        {isConnected
        ? 
        <Chat
        socket={socket}
        setIsConnected={setIsConnected}
        userName={userName}
        secretPhrase={secretPhrase}
        setSecretPhrase={setSecretPhrase}
        roomId={roomId}
        />
        :
        <Home
        socket={socket}
        setIsConnected={setIsConnected}
        userName={userName}
        setUserName={setUserName}
        secretPhrase={secretPhrase}
        setSecretPhrase={setSecretPhrase}
        roomId={roomId}
        setRoomId={setRoomId}
        />}
    </div>
  );
}

export default App;
