import {combineReducers} from 'redux'
import {DefaultTheme, DarkTheme} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const tickets = (state = [], action) => {
    switch (action.type) {
        case 'SET_TICKETS_LIST':
            return action.payload;
        case 'ADD_TICKET':
            state.push(action.payload);
            AsyncStorage.setItem('@tickets', JSON.stringify(state));
            return state;
        case 'DELETE_TICKET':
            console.log(action.payload);
            state = state.filter((ticket) => ticket.id !== action.payload.id);
            console.log(state);
            AsyncStorage.setItem('@tickets', JSON.stringify(state));
            return state;
        default:
            return state
    }
}

const theme = (state = DefaultTheme, action) => {
    switch (action.type) {
        case 'TOGGLE':
            return state === DefaultTheme ? DarkTheme : DefaultTheme
        default:
            return state
    }
}

export default combineReducers({
    theme,
    tickets
})
