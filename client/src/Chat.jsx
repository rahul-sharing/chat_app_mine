import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'
import EmojiPicker from 'emoji-picker-react';

const Chat = ({ socket, userName, room }) => {
    const [currentMessage, setCurrentMessage] = useState("")
    const [messageList, setMessageList] = useState([])
    const [showEmoji, setShowEmoji] = useState(false)


    const sendmessage = async () => {
        if (currentMessage !== "") {
            const messgageData = {
                room: room,
                author: userName,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            await socket.emit("send_message", messgageData)
            setMessageList((list) => [...list, messgageData])
            setCurrentMessage("")

        }
    }


    useEffect(() => {
        socket.on("recieved_message", (data) => {
            setMessageList((list) => [...list, data])
        })
    }, [socket])




    return (
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className='message-container'>

                    {messageList.map((messageContent) => {
                        return (
                            <div className="message" id={userName == messageContent.author ? "you" : "other"}>
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>
                                    <div className="message-meta">
                                        <p id='time'> {messageContent.time} </p>
                                        <p id='author'> {messageContent.author} </p>

                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text" placeholder='hey...' value={currentMessage} onChange={(e) => { setCurrentMessage(e.target.value) }} onKeyPress={(event) => {
                    event.key === "Enter" && sendmessage()
                }}

                />
                <button onClick={()=>{setShowEmoji(!showEmoji)}}>&#128515;</button>
                <button onClick={sendmessage}>&#9658;</button>
            </div>
                {
                    showEmoji && (
                        <EmojiPicker height={500} width={350} onEmojiClick={(emoji)=>{setCurrentMessage(currentMessage + " " + emoji.emoji)}} />
                    )
                }
        </div>
    )
}

export default Chat