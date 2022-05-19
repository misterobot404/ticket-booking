import { combineReducers } from 'redux'
import {DefaultTheme, DarkTheme} from "@react-navigation/native";

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

})
