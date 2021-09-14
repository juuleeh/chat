import React, { useEffect, useState } from "react";
import "./home.scss";
import { BiDice5 } from "react-icons/bi";
import cryptoRandomString from "crypto-random-string";

function Home({
    socket,
    setIsConnected,
    userName,
    setUserName,
    secretPhrase,
    setSecretPhrase,
    roomId,
    setRoomId
}) {

    useEffect(() => {
        socket.on("connected", () => {
            setIsConnected(true);
        });

        socket.on("error", (errorText) => {
            alert(errorText);
        })
    }, [socket]);

    function createRoom() {
        if(userName !== "" && secretPhrase !== "" && roomId !== "") {
            socket.emit("createRoom", { userName, roomId });
        }
        else {
            alert("Все поля должны быть заполнены!")
        }
    }

    function joinRoom() {
        if(userName !== "" && secretPhrase !== "" && roomId !== "") {
            socket.emit("joinRoom", { userName, roomId });
        }
        else {
            alert("Все поля должны быть заполнены!")
        }
    }

    function randomizeRoomId() {
        setRoomId(cryptoRandomString({length: 16, type: "url-safe" }));
    }

    return (
        <div className="home">
            <h1>Привет 🙏</h1>
            <input
                placeholder="Имя"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            ></input>
            <input
                placeholder="Секретное слово"
                value={secretPhrase}
                onChange={(e) => setSecretPhrase(e.target.value)}
            ></input>
            <div className="roomIdWrapper">
                <input
                    placeholder="Идентификатор комнаты"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                ></input>
                <button title="Случайный идентификатор" className="randomizeButton" onClick={randomizeRoomId}>
                    <BiDice5 className="icon"/>
                </button>
            </div>
            <div className="buttonsWrapper">
                <button onClick={createRoom}>Создать комнату</button>
                <button onClick={joinRoom} className="joinButton">Войти в комнату</button>
            </div>
        </div>
    );
}

export default Home;