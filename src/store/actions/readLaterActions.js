
export const PUT_READ_LATER_SUCCESS = 'PUT_READ_LATER_SUCCESS';
export const REMOVE_READ_LATER_SUCCESS = 'REMOVE_READ_LATER_SUCCESS';

export function putReadLaterSuccess(items) {
    return {
        type: PUT_READ_LATER_SUCCESS,
        payload: items
    }
}
export function removeReadLaterSuccess(items) {
    return {
        type: REMOVE_READ_LATER_SUCCESS,
        payload: items
    }
}