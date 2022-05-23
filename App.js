import React from "react";
import {Image, NativeBaseProvider} from "native-base";
import {connect, Provider} from 'react-redux'
import {bindActionCreators, createStore} from "redux"
import Store from './store'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import PosterScreen from "./screens/PosterScreen";
import {FontAwesome} from "@expo/vector-icons";
import ScheduleScreen from "./screens/ScheduleScreen";
import MyTicketsScreen from "./screens/MyTicketsScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';

const store = createStore(Store)

export default function App() {
    return (
        <NativeBaseProvider>
            <Provider store={store}>
                <NavigationCont/>
            </Provider>
        </NativeBaseProvider>
    );
}

class Navigation extends React.Component {
    async componentDidMount() {
        let tickets = await AsyncStorage.getItem('@tickets');
        this.props.setTicketsList(tickets !== null ? JSON.parse(tickets) : [])
    }

    render() {
        const Tab = createBottomTabNavigator();

        return (
            <NavigationContainer theme={this.props.theme}>
                <Tab.Navigator screenOptions={{tabBarStyle: {paddingBottom: 5, paddingTop: 5, height: 60}}}>
                    <Tab.Screen
                        name="Афиша"
                        component={PosterScreen}
                        options={{
                            tabBarIcon: ({color}) => <FontAwesome size={30} name="film" color={color}/>,
                            headerTitle: () => <Image style={{width: 120, height: 60}} source={require('./assets/logo.png')}/>,
                            headerTitleAlign: "center"
                        }}
                    />
                    <Tab.Screen
                        name="Расписание"
                        component={ScheduleScreen}
                        initialParams={{ film_id: null }}
                        options={{
                            tabBarIcon: ({color}) => <FontAwesome size={30} name="star" color={color}/>,
                            headerTitle: () => <Image style={{width: 120, height: 60}} source={require('./assets/logo.png')}/>,
                            headerTitleAlign: "center",
                        }}
                    />
                    <Tab.Screen
                        name="Мои билеты"
                        component={() => <MyTicketsScreen/>}
                        options={{
                            tabBarIcon: ({color}) => <FontAwesome size={30} name="ticket" color={color}/>,
                            headerTitle: () => <Image style={{width: 120, height: 60}} source={require('./assets/logo.png')}/>,
                            headerTitleAlign: "center"
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme
    }
}

const setTicketsList = (payload) => {
    return {
        type: 'SET_TICKETS_LIST',
        payload
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({setTicketsList: setTicketsList}, dispatch)
}

const NavigationCont = connect(mapStateToProps, matchDispatchToProps)(Navigation);



