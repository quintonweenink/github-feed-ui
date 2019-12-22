import {putReadLaterPending, putReadLaterSuccess, putReadLaterError, 
    removeReadLaterPending, removeReadLaterSuccess, removeReadLaterError} from '../actions/readLaterActions';

export function putReadLater(items, username) {
    return dispatch => {
        dispatch(putReadLaterPending());
        if(!username || username === '') {
            dispatch(putReadLaterError('Username field is empty'))
            return
        }
        fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${username}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(items)
      })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch(putReadLaterSuccess(items));
            return res;
        })
        .catch(error => {
            dispatch(putReadLaterError(error));
        })
    }
}

export function removeReadLater(items, username) {
    return dispatch => {
        dispatch(removeReadLaterPending());
        fetch(`https://github-feed-quintonweenink.herokuapp.com/read-later/${username}`, {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(items)
      })
        .then(res => res.json())
        .then(res => {
            if(res.error) {
                throw(res.error);
            }
            dispatch(removeReadLaterSuccess(items));
            return res;
        })
        .catch(error => {
            dispatch(removeReadLaterError(error));
        })
    }
}