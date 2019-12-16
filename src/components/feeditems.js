import React, { Component } from 'react'

class FeedItems extends Component {

  readLater = (feedItem) => {
    if (feedItem.readLater === false) {
      fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${this.props.username}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([feedItem.id])
      })
        .then(res => res.json())
        .then(res => console.log(res))
      feedItem.readLater = true
    } else {
      fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${this.props.username}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([feedItem.id])
      })
        .then(res => res.json())
        .then(res => console.log(res))
      feedItem.readLater = false
    }
    this.props.handler(feedItem)
  }

  render() {
    return (
      <div>
        <h3>{!this.props.feedItems || this.props.feedItems.length < 1 ? <center>No Items</center> : ""}</h3>
        {this.props.feedItems.map((feedItem) => (
          <div style={{ padding: '1vmin' }} key={feedItem.id}>
            <div >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img style={{ borderRadius: '1vmin', height: '5vmin', marginRight: '2vmin' }} src={feedItem.actor.avatar_url} alt='avatar'></img>
                <span style={{ fontWeight: 'bold' }}>
                  {feedItem.actor.login}
                </span>
                <span style={{ margin: '1vmin' }}>
                  {feedItem.payload.action}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {feedItem.repo.name}
                </span>
              </div>
              <div style={{ borderRadius: '1vmin', margin: '1vmin', padding: '1vmin', border: 'solid', borderWidth: '1px', borderColor: 'grey' }}>
                <button style={{ float: 'right' }} onClick={() => this.readLater(feedItem)}>
                  {feedItem.readLater ? 'Forget' : 'Remember'}
                </button>
                <h3 style={{ margin: '1vmin' }}>{feedItem.repo.name} - {feedItem.created_at.substring(0, 10)}</h3>
                <h4 style={{ margin: '1vmin' }}>{feedItem.repo.description}</h4>

              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
};

export default FeedItems