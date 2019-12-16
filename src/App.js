import React, { Component } from 'react';
import './App.css';

import FeedItems from './components/feeditems';

class App extends Component {
  state = {
    feed: [],
    filteredFeed: [],
    filteredReadLater: [],
    search: localStorage.getItem('githubSearch') ? localStorage.getItem('githubSearch') : '',
    username: localStorage.getItem('githubUsername') ? localStorage.getItem('githubUsername') : 'quintonweenink',
    errorMessage: '',
    hideFeed: false
  }

  constructor(props) {
    super(props)

    this.handler = this.handler.bind(this)
  }

  componentDidMount() {
    this.setup()
  }

  async setup() {
    try {
      const events = await fetch(`https://api.github.com/users/${this.state.username}/received_events`)
        .then(res => {
          if (!res.ok) {
            throw new Error(res.status)
          }
          return res
        })
        .then(res => res.json())
        .catch(error => {
          const message = error.message === '404' ? 'Github username not found' : 'API rate limit exceeded'
          this.setState({ errorMessage: message })
        })

      await fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${this.state.username}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify([])
      })
        .then(createRes => createRes.json())
        .then(createRes => console.log(createRes))

      const readMores = await fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${this.state.username}`)
        .then(res => res.json())

      const repos = await Promise.all(events.map(event => {
        return fetch(event.repo.url)
          .then(res => res.json())
      }))

      const result = events.map((event, index) => {
        event.repo.description = repos[index].description ? repos[index].description : 'No description'
        event.repo.fetchedDetails = repos[index]
        event.readLater = readMores.items.some((id) => id === event.id)
        event.payload.action = event.payload.action ? event.payload.action : '-'
        return event
      })

      const readLater = result.filter((event, index) => {
        return event.readLater
      })

      this.setState({
        feed: result,
        filteredFeed: result,
        filteredReadLater: readLater
      })

      this.filterFeed(this.state.search)
    } catch (error) {
      console.log(error)
    }
  }

  handler(feedItem) {
    const result = this.state.feed

    result.forEach((event, index) => {
      if (event.id === feedItem.id) {
        result[index] = feedItem
      }
    })

    this.setState({
      feed: result
    })

    this.filterFeed(this.state.search)
  }

  filterFeed(searchValue) {
    const filteredResult = this.state.feed.filter((event) => {
      return event.repo.description.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
        event.repo.name.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
        event.payload.action.toLowerCase().search(searchValue.toLowerCase()) !== -1 ||
        event.created_at.substring(0, 10).toLowerCase().search(searchValue.toLowerCase()) !== -1;
    });

    const readLater = filteredResult.filter((event) => {
      return event.readLater
    })

    this.setState({
      search: searchValue,
      filteredFeed: filteredResult,
      filteredReadLater: readLater
    })
  }

  searchChange = (e) => {
    localStorage.setItem('githubSearch', e.target.value);
    this.filterFeed(e.target.value)
  }

  usernameChange = (e) => {
    this.setState({ errorMessage: '' })
    localStorage.setItem('githubUsername', e.target.value);
    this.setState({
      username: e.target.value
    })
  }

  refreshClick = (e) => {
    this.setState({
      feed: [],
      filteredFeed: [],
      filteredReadLater: []
    })
    this.setup()
  }

  feedButtonClick = (e) => {
    this.setState({
      hideFeed: !this.state.hideFeed
    })
  }

  render() {
    return (
      <div>
        <div style={{ padding: '2vmin' }}>
          Github username: <input type="text" lable='Username' placeholder="Username" onChange={this.usernameChange} value={this.state.username} />
          <button onClick={this.refreshClick}>
            Update username
          </button>
          <p style={{ color: 'red  ' }}>{this.state.errorMessage}</p>
          Search: <input type="text" lable='Search' placeholder="Search" onChange={this.searchChange} value={this.state.search} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div>
          <button style={{ float: 'right', padding: '1vmin', marginRight: '2vmin' }} onClick={this.feedButtonClick}>
              {this.state.hideFeed ? 'Show feed' : 'Hide feed'}
              </button>
            <center>
            
              <h2>Latest github events</h2>
            </center>
            { !this.state.hideFeed ?
            <FeedItems feedItems={this.state.filteredFeed} username={this.state.username} handler={this.handler} />
            : <center>...</center>
            }
          </div>
          <div>
            <center><h2>Remembered events</h2></center>
            <FeedItems feedItems={this.state.filteredReadLater} username={this.state.username} handler={this.handler} />
          </div>
        </div>
      </div >
    )
  }
}

export default App;
