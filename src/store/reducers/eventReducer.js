import {FETCH_PENDING, FETCH_EVENTS_SUCCESS, FETCH_ERROR} from '../actions/eventActions';
import {PUT_READ_LATER_SUCCESS, REMOVE_READ_LATER_SUCCESS } from '../actions/readLaterActions';

const initialState = {
    pending: false,
    events: [],
    username: '',
    error: null
}

export default function eventsReducer(state = initialState, action) {
    switch(action.type) {
        case FETCH_PENDING: 
            return {
                ...state,
                pending: true,
                error: null
            }
        case FETCH_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                pending: false,
                username: action.payload.username,
                events: action.payload.events
            }
        case PUT_READ_LATER_SUCCESS:
            const items = action.payload;
            console.log(items)
            const newEvents = state.events.map((event, index) => {
                items.forEach(item => {
                    if (event.id === item.id) {
                        event.readLater = true;
                    }
                })
                return event
            })
            return {
                ...state,
                pending: false,
                events: newEvents
            }
        case REMOVE_READ_LATER_SUCCESS:
            console.log(action.payload)
            const newEvents2 = state.events.map((event, index) => {
                action.payload.forEach(item => {
                    if (event.id === item.id) {
                        event.readLater = false;
                    }
                })
                return event
            })
            return {
                ...state,
                pending: false,
                events: newEvents2
            }
        default: 
            return state;
    }
}