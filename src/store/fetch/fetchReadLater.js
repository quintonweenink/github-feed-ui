import { putReadLaterSuccess, removeReadLaterSuccess} from '../actions/readLaterActions';

import {
    fetchError, fetchPending
} from '../actions/eventActions';

export function putReadLater(items, username) {
    return dispatch => {
        dispatch(fetchPending());
        if (!username || username === '') {
            dispatch(fetchError('Username field is empty'))
            return
        }
        fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${username}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(items.map((item) => item.id))
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(putReadLaterSuccess(items));
                return res;
            })
            .catch(error => {
                dispatch(fetchError(error));
            })
    }
}

export function removeReadLater(items, username) {
    return dispatch => {
        dispatch(fetchPending());
        fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${username}`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(items.map((item) => item.id))
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) {
                    throw (res.error);
                }
                dispatch(removeReadLaterSuccess(items));
                return res;
            })
            .catch(error => {
                dispatch(fetchError(error));
            })
    }
}