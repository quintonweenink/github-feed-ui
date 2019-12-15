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
        <center><h1>Feed Items</h1></center>
        {this.props.feedItems.map((feedItem) => (
          <div className='card' key={feedItem.id}>
            <div className='card-body'>
              <h2 className='card-title'>{feedItem.actor.login}</h2>
              <h2 className='card-subtitle mb-2 text-muted'>{feedItem.repo.name}</h2>
              <h3 className='card-text'>{feedItem.created_at}</h3>
              <h3 className='card-text'>{feedItem.repo.description}</h3>
              <img className='avatar' src={feedItem.actor.avatar_url} alt='avatar'></img>
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