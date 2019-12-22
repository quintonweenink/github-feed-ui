import { fetchPending, fetchEventsSuccess, fetchError } from '../actions/eventActions';

export function fetchEvents(username) {
    return dispatch => {
        dispatch(fetchPending());
        if (!username || username === '') {
            dispatch(fetchError('Username field is empty'))
            return
        }
        fetch(`https://api.github.com/users/${username}/received_events`)
            .then(res => res.json())
            .then(async function (res) {
                if (res.message) {
                    throw (res);
                }
                const events = res             

                const readMores = await fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${username}`)
                    .then(res => res.json())

                const result = events.map((event, index) => {
                    event.repo.description = 'No description'
                    event.created_at = event.created_at.substring(0, 10);
                    event.readLater = readMores.items.some((id) => id === event.id)
                    event.payload.action = event.payload.action ? event.payload.action : '-'
                    return event
                })

                dispatch(fetchEventsSuccess({ events: result, username }))

                const repos = await Promise.all(events.map(event => {
                    return fetch(event.repo.url)
                        .then(res => res.json())
                }))

                const resultExtra = events.map((event, index) => {
                    event.repo.description = repos[index].description ? repos[index].description : 'No description'
                    event.repo.fetchedDetails = repos[index]
                    return event
                })

                dispatch(fetchEventsSuccess({ events: resultExtra, username }));
                return res;
            })
            .catch(error => {
                dispatch(fetchError(error.message));
            })
    }
}