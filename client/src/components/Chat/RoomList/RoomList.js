import React from 'react'

import ExitToApp from '@material-ui/icons/ExitToApp';

import './roomlist.css'

class RoomList extends React.Component {

    render() {
        const orderedRooms = [...this.props.rooms].sort((a, b) => a.id > b.id);
        return (
            <div className="rooms-list">
                <div className="logout">
                    <ExitToApp onClick={this.props.logout} className="logout-btn">Logout</ExitToApp>
                    <h4 className="logout-txt">Logout</h4>
                </div>
                <h3>Your rooms:</h3>
                <ul>
                    {orderedRooms.map((room, i) => {
                        const active = this.props.currentRoomId === room.id ? 'active' : '';
                        return (
                            <li key={room.notify+room.name} className={'room ' + active}>
                                <a onClick={() => this.props.subscribeToRoom(room.id)}>
                                    # {room.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div >
        )
    }
}

export default RoomList