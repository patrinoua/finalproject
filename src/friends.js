import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {receiveFriends, removeFriend, acceptFriend, denyFriend} from './actions'

class Friends extends React.Component {
  componentDidMount() {
    this.props.dispatch(receiveFriends())
  }

  friendFormat(friend, type) {
    var pic = friend.profilepic || 'user.png'
    if (type === 'exists') {
      return (
        <div key={friend.id} className="friendBox">
          <img
            src="x.png"
            alt="x"
            className="icons removeFriendIcon"
            onClick={() => {
              this.props.dispatch(removeFriend(friend.id))
            }}
          />

          <Link to={`user/${friend.id}`} className="friendBoxPic">
            <img src={pic} alt="pic" />
          </Link>
          <div className="existingFriendBoxText">
            {friend.first} {friend.last}
          </div>
        </div>
      )
    } else {
      return (
        <div key={friend.id} className="pendingPerson">
          <Link to={`user/${friend.id}`}>
            <img className="pendingPic" src={pic} alt="pic" />
          </Link>
          <div className="pendingName">
            {friend.first} {friend.last}
          </div>
          {/*<div className="inARow">*/}
          <div className="pendingAcceptButtons inARow">
            <div
              className="pendingAccept"
              onClick={() => {
                this.props.dispatch(acceptFriend(friend.id))
              }}
            >
              Accept
              <img src="tick.png" className="icons" alt="tick" />
            </div>
            <div
              className="pendingAccept"
              onClick={() => {
                this.props.dispatch(denyFriend(friend.id))
              }}
            >
              Deny
              <img src="x.png" className="icons" alt="x" />
            </div>
          </div>
        </div>
      )
    }
  }
  render() {
    const {friends} = this.props
    if (!friends) {
      return null
    }
    const existingFriends = this.props.existingFriends.map(existing => {
      return this.friendFormat(existing, 'exists')
    })

    const pendingFriends = this.props.pendingFriends.map(pending => {
      return this.friendFormat(pending, 'pending')
    })

    return (
      <div className="componentContainer">
        <div className="friendsComponent">
          <h1> Pending Friends </h1>
          <div className="pendingFriends">
            <div className="pendingFriendsList">{pendingFriends}</div>
          </div>

          <h1> Friends </h1>
          <div className="existingFriends">
            <div className="existingList">{existingFriends}</div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    friends: state.friends && state.friends.filter(friends => friends),
    existingFriends:
      state.friends && state.friends.filter(friends => friends.status === 3),
    pendingFriends:
      state.friends && state.friends.filter(friends => friends.status === 1)
  }
}

export default connect(mapStateToProps)(Friends)
