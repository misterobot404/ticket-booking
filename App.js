import React from "react";
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome} from '@expo/vector-icons';
import {NativeBaseProvider, Image, Text} from "native-base";

import MyTicketsScreen from "./screens/MyTicketsScreen";
import PosterScreen from "./screens/PosterScreen";
import ScheduleScreen from "./screens/ScheduleScreen";

import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers'

const store = createStore(rootReducer)

// ROOT
export default function App() {
    const Tab = createBottomTabNavigator();

    return (
        <NativeBaseProvider>
            <Provider store={store}>
                <Text>{this.number}</Text>
                <NavigationContainer {/*theme={Store.colorMode}*/}>
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
                            options={{
                                tabBarIcon: ({color}) => <FontAwesome size={30} name="star" color={color}/>,
                                headerTitle: () => <Image style={{width: 120, height: 60}} source={require('./assets/logo.png')}/>,
                                headerTitleAlign: "center"
                            }}
                        />
                        <Tab.Screen
                            name="Мои билеты"
                            component={MyTicketsScreen}
                            options={{
                                tabBarIcon: ({color}) => <FontAwesome size={30} name="ticket" color={color}/>,
                                headerTitle: () => <Image style={{width: 120, height: 60}} source={require('./assets/logo.png')}/>,
                                headerTitleAlign: "center"
                            }}
                        />
                    </Tab.Navigator>
                </NavigationContainer>
            </Provider>
        </NativeBaseProvider>
    );
}



