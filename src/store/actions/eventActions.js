export const FETCH_PENDING = 'FETCH_PENDING';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_EVENTS_ERROR = 'FETCH_EVENTS_ERROR';

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
export function fetchEventsError(error) {
    return {
        type: FETCH_EVENTS_ERROR,
        error: error
    }
}
export function fetchError(error) {
    return {
        type: FETCH_ERROR,
        error: error
    }
}