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
        <h2>{!this.props.feedItems || this.props.feedItems.length < 1 ? "No Items" : ""}</h2>
        {this.props.feedItems.map((feedItem) => (
          <div style={{ padding: '1vmin' }} key={feedItem.id}>
            <div style={{ borderBottomStyle: 'solid', borderWidth: '1px', borderColor: 'grey' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img style={{ borderRadius: '1vmin', height: '5vmin', marginRight: '2vmin' }} src={feedItem.actor.avatar_url} alt='avatar'></img>
                <span style={{ fontWeight: 'bold' }}>
                  {feedItem.actor.login}
                </span>
                <span style={{ margin: '1vmin' }}>
                  {' ' + (feedItem.payload.action ? feedItem.payload.action : '-') + ' '}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  {feedItem.repo.name}
                </span>
              </div>
              <h3 className='card-subtitle mb-2 text-muted'>{feedItem.repo.name}</h3>
              <h3 className='card-text'>{feedItem.created_at}</h3>
              <h3 className='card-text'>{feedItem.repo.description}</h3>
              <button onClick={() => this.readLater(feedItem)}>
                {feedItem.readLater ? "Ready to read later" : "Read Later"}
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }
};

export default FeedItems