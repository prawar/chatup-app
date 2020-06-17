import React from 'react'

import store from 'store';

import ReactEmoji from 'react-emoji';

class Message extends React.Component {

    constructor() {
        super()
        this.state = {
            isSentByCurrentUser : false
        }
    }

    componentDidMount() {
        const username = store.get('state').name;

        console.log(`${this.props.user} ===  ${username}`)

        if (this.props.user === username ) {
            
            this.setState({
                isSentByCurrentUser : true
            })
        }
    }


    componentWillReceiveProps(){
        const username = store.get('state').name;

        console.log(`${this.props.user} ===  ${username}`)

        if (this.props.user === username ) {
            
            this.setState({
                isSentByCurrentUser : true
            })
        }
    }

    componentWillUnmount(){
        this.setState({
            isSentByCurrentUser : false
        })
    }

    render() {

        return (
            this.state.isSentByCurrentUser
                ? (
                    <div className=" messageContainer justifyEnd">
                        <p className="message-username sentText pr-10">{this.props.user}</p>
                        <div className="messageBox backgroundBlue">
                            <p className="messageText colorWhite">{ReactEmoji.emojify(this.props.text)}</p>
                        </div>
                    </div>
                )
                : (
                    <div className=" messageContainer justifyStart">
                        <div className="messageBox backgroundLight">
                            <p className="messageText colorDark">{ReactEmoji.emojify(this.props.text)}</p>
                        </div>
                        <p className="message-username sentText pl-10 ">{this.props.user}</p>
                    </div>
                )

        )
    }
}

export default Message