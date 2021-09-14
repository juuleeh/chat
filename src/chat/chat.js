import React, { useEffect, useState, useRef } from "react";
import "./chat.scss";
import { FaFolder, FaCat } from "react-icons/fa";
import Lottie from "react-lottie";
import animationData from "../loading.json";
import { doEncrypt, doDecrypt } from "../aes.js";

function Chat({
    socket,
    setIsConnected,
    userName,
    secretPhrase,
    setSecretPhrase,
    roomId,
}) {

    const [userText, setUserText] = useState("");
    const [messages, setMessages] = useState([]);
    const [incomingMessage, setIncomingMessage] = useState("");
    const [decryptedMessage, setDecryptedMessage] = useState("");

    const defaultAnimationOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        socket.on("message", (data) => {
            if(data.type === "message") {
                setIncomingMessage(data.text);
                const message = doDecrypt(secretPhrase, data.text);
                setDecryptedMessage(message);
                let temp = messages;
                temp.push({
                    type: data.type,
                    userName: data.userName,
                    text: message,
                });
                setMessages([...temp]);
            }
            else if(data.type === "notification") {
                let temp = messages;
                temp.push({
                    type: data.type,
                    text: data.text,
                });
                setMessages([...temp]);
            }
        });

        return () => {
            socket.off("message");
        }
    }, [socket, secretPhrase]);

    const sendMessage = () => {
        if(userText !== "") {
            const message = doEncrypt(secretPhrase, userText);
            socket.emit("message", message);
            setUserText("");
        }
    }

    return (
        <div className="chatWrapper">
            <div className="chat">
                <div className="messages">
                    {messages.map((message) => {
                        if(message.type === "message") {
                            return (
                                <div className={"message" + (message.userName === userName ? " byYou" : "")}>
                                    <p>{message.text}</p>
                                    <span>{message.userName}</span>
                                </div>
                            )
                        } else if(message.type === "notification") {
                            return (
                                <div className="notification">
                                    <p>{message.text}</p>
                                </div>
                            )
                        }
                    })}
                    <div ref={messagesEndRef} />
                </div>
                <div className="send">
                    <input
                    placeholder="Сообщение"
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    onKeyPress={(e) => {
                        if(e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                    ></input>
                    <form action="/upload" method="post" enctype="multipart/form-data">
                        <input id="chooseFile" type="file" accept="image/*" />
                    </form>
                    <label for="chooseFile">
                        <FaFolder className="icon"/>
                    </label>
                    <button onClick={sendMessage}>
                        <FaCat className="icon"/>
                    </button>
                </div>
            </div>
            <div className="process">
                <div className="userName">
                    <h5>Имя</h5>
                    <input disabled
                    className="disabled"
                    value={userName}
                    ></input>
                </div>
                <div className="secretPhrase">
                    <h5>Секретное слово</h5>
                    <input
                    value={secretPhrase}
                    onChange={(e) => setSecretPhrase(e.target.value)}
                    ></input>
                </div>
                <div className="roomId">
                    <h5>Идентификатор комнаты</h5>
                    <input disabled
                    className="disabled"
                    value={roomId}
                    ></input>
                </div>
                <div className="incomingData">
                    <h5>Входящие данные</h5>
                    <input disabled
                    className="disabled"
                    value={incomingMessage}
                    ></input>
                </div>
                <Lottie
                    options={defaultAnimationOptions}
                    height={150}
                    width={150}
                />
                <div className="decryptedData">
                    <h5>Расшифрованные данные</h5>
                    <input disabled
                    className="disabled"
                    value={decryptedMessage}
                    ></input>
                </div>
            </div>
        </div>
    );
}

export default Chat;