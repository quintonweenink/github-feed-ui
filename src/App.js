import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchEvents } from './store/fetch/fetchEvents'
import { putReadLater } from './store/fetch/fetchReadLater'

import FeedItems from './components/feeditems';

class App extends Component {
  state = {
    filteredFeed: [],
    filteredReadLater: [],
    search: localStorage.getItem('githubSearch') ? localStorage.getItem('githubSearch') : '',
    username: localStorage.getItem('githubUsername') ? localStorage.getItem('githubUsername') : 'quintonweenink',
    hideFeed: false
  }

  componentDidMount() {
    this.props.fetchEvents(this.state.username)
    this.props.putReadLater([], this.state.username)
  }

  componentDidUpdate(prevProps) {
    if (this.props.events !== undefined && prevProps.events !== this.props.events) {
     this.filterFeed(this.state.search)
    }
  }

  filterFeed(searchValue) {
    searchValue = searchValue.toLowerCase()

    const filteredResult = this.props.events.filter((event) => {
      return event.repo.description.toLowerCase().search(searchValue) !== -1 ||
        event.repo.name.toLowerCase().search(searchValue) !== -1 ||
        event.payload.action.toLowerCase().search(searchValue) !== -1 ||
        event.created_at.toLowerCase().search(searchValue) !== -1;
    });

    const readLater = filteredResult.filter((event) => {
      return event.readLater
    })

    this.setState({
      filteredFeed: filteredResult,
      filteredReadLater: readLater
    })
  }

  searchChange = (e) => {
    localStorage.setItem('githubSearch', e.target.value);
    this.setState({search: e.target.value})
    this.filterFeed(e.target.value)
  }

  usernameChange = (e) => {
    this.setState({username: e.target.value})
  }

  refreshClick = (e) => {
    localStorage.setItem('githubUsername', this.state.username);
    this.props.fetchEvents(this.state.username);
    this.props.putReadLater([], this.state.username)
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
          <button onClick={this.refreshClick}>Update username</button>
          <p style={{ color: 'red  ' }}>{this.props.error}</p>
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
            : <center>...</center>}
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

const mapStateToProps = state => ({
  error: state.error,
  events: state.events,
  username: state.username,
  pending: state.pending
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEvents: fetchEvents,
  putReadLater: putReadLater
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
