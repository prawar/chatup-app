import React from 'react'

import Send from '@material-ui/icons/Send';

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

import './sendmessageform.css'

class SendMessageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            message: '',
            showEmojis: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            message: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.sendMessage(this.state.message);
        this.setState({
            message: ''
        })
    }

    showEmojis = e => {
        this.setState(
            {
                showEmojis: true
            },
            () => document.addEventListener("click", this.closeMenu)
        );
    };

    closeMenu = e => {
        console.log(this.emojiPicker);
        if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
            this.setState(
                {
                    showEmojis: false
                },
                () => document.removeEventListener("click", this.closeMenu)
            );
        }
    };

    addEmoji = e => {
        let sym = e.unified.split('-')
        let codesArray = []
        sym.forEach(el => codesArray.push('0x' + el))
        let emoji = String.fromCodePoint(...codesArray)
        this.setState({
            message: this.state.message + emoji
        })
    }

    render() {
        return (

            <form className="send-message-form" onSubmit={this.handleSubmit}>
                {this.state.showEmojis ? (
                    <span style={styles.emojiPicker} ref={el => (this.emojiPicker = el)}>
                        <Picker
                            onSelect={this.addEmoji}
                            emojiTooltip={true}
                            title="weChat"
                        />
                    </span>
                ) : (
                        <p style={styles.getEmojiButton} onClick={this.showEmojis}>
                            {String.fromCodePoint(0x1f60a)}
                        </p>
                    )}

                <input
                    placeholder="Type message and hit ENTER"
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.message}
                    disabled={this.props.disabled} />
                <Send onClick={this.handleSubmit} className="sendBtn"></Send>

            </form>

        )
    }
}

export default SendMessageForm


const styles = {
    getEmojiButton: {
        cssFloat: "right",
        border: "none",
        cursor: "pointer",
    },
    emojiPicker: {
        position: "absolute",
        bottom: 10,
        right: 0,
        cssFloat: "right",
        marginLeft: "200px"
    }
};

/*
const customEmojis = [
    {
        name: "Octocat",
        short_names: ["octocat"],
        text: "",
        emoticons: [],
        keywords: ["github"],
        imageUrl: "https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7"
    }
];
*/