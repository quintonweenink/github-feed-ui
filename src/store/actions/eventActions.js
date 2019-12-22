export const FETCH_PENDING = 'FETCH_PENDING';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';

export function fetchPending() {
    return {
        type: FETCH_PENDING
    }
}
export function fetchEventsSuccess(payload) {
    return {
        type: FETCH_EVENTS_SUCCESS,
        payload: payload
    }
}
export function fetchError(error) {
    return {
        type: FETCH_ERROR,
        error: error
    }
}