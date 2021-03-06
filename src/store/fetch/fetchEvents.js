import { fetchPending, fetchEventsSuccess, fetchEventsError } from '../actions/eventActions';



async function addInitialDataAndReadMores(events, username) {
    const readMores = await fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${username}`)
        .then(res => res.json());
    const result = events.map((event, index) => {
        event.repo.description = 'No description';
        event.created_at = event.created_at.substring(0, 10);
        event.readLater = readMores.items.some((id) => id === event.id);
        event.payload.action = event.payload.action ? event.payload.action : '-';
        return event;
    });
    return result;
}

async function getAdditionalRepoDetails(events) {
    const repos = await Promise.all(events.map(event => {
        return fetch(event.repo.url)
            .then(res => res.json());
    }));
    const result = events.map((event, index) => {
        event.repo.description = repos[index].description ? repos[index].description : 'No description';
        event.repo.fetchedDetails = repos[index];
        return event;
    });
    return result;
}

export function fetchEvents(username) {
    return dispatch => {
        dispatch(fetchPending());
        if (!username || username === '') {
            dispatch(fetchEventsError('Username field is empty'))
            return
        }
        fetch(`https://api.github.com/users/${username}/received_events`)
            .then(res => res.json())
            .then(async function (res) {
                if (res.message) {
                    throw (res);
                }

                const events = await addInitialDataAndReadMores(res, username);
                dispatch(fetchEventsSuccess({ events: events, username }))

                const eventsExtra = await getAdditionalRepoDetails(events);
                dispatch(fetchEventsSuccess({ events: eventsExtra, username }));

                return eventsExtra;
            })
            .catch(error => {
                dispatch(fetchEventsError(error.message));
            })
        }
}