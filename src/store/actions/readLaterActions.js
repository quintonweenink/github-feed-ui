export const PUT_READ_LATER_PENDING = 'PUT_READ_LATER_PENDING';
export const PUT_READ_LATER_SUCCESS = 'PUT_READ_LATER_SUCCESS';
export const PUT_READ_LATER_ERROR = 'PUT_READ_LATER_ERROR';

export const REMOVE_READ_LATER_PENDING = 'REMOVE_READ_LATER_PENDING';
export const REMOVE_READ_LATER_SUCCESS = 'REMOVE_READ_LATER_SUCCESS';
export const REMOVE_READ_LATER_ERROR = 'REMOVE_READ_LATER_ERROR';

export function putReadLaterPending() {
    return {
        type: PUT_READ_LATER_PENDING
    }
}
export function putReadLaterSuccess(items) {
    return {
        type: PUT_READ_LATER_SUCCESS,
        payload: items
    }
}
export function putReadLaterError(error) {
    return {
        type: PUT_READ_LATER_ERROR,
        error: error
    }
}

export function removeReadLaterPending() {
    return {
        type: REMOVE_READ_LATER_PENDING
    }
}
export function removeReadLaterSuccess(items) {
    return {
        type: REMOVE_READ_LATER_SUCCESS,
        payload: items
    }
}
export function removeReadLaterError(error) {
    return {
        type: REMOVE_READ_LATER_ERROR,
        error: error
    }
}