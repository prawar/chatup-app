import React from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'

import './messages.css'

class MessageList extends React.Component {
    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.clientHeight + 50 >= node.scrollHeight;
    }

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight
        }
    }
        
    render() {
        if (!this.props.currentRoomId) {
            return ( 
                <div className="message-list">
                    <div className="join-room">
                        &larr; Enter in a room!
                    </div>
                </div>
            )
        } 
        return (
            <div className="message-list">
                {this.props.messages.map((message, index) => {
                    return <Message key={message.user + message.text} user={message.user} text={message.text} /> 
                })}
            </div>
        )
    }
}

export default MessageList