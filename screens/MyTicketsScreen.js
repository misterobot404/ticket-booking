import {Box, Button, Center, Heading, HStack, useColorMode} from "native-base";
import React, {Component, useState} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from "react";

const toggle = () => {
    return {
        type: 'TOGGLE'
    }
}

class MyTicketsScreen extends Component {
    render() {
        return (
            <HStack space={4} alignItems="center">
                <UseColorMode props={this.props}/>
                <Counter/>
            </HStack>
        )
    }
}

function Counter() {
    const [count, setCount] = useState(0);

    useEffect(async () => {
        try {
            /*const jsonValue = await AsyncStorage.getItem('@storage_Key')
            return jsonValue != null ? JSON.parse(jsonValue) : null;*/

            const value = await AsyncStorage.getItem('@storage_Key')
            if (value !== null) {
                setCount(Number(value));
            }
        } catch (e) {
            // error reading value
        }
    }, [])

    const storeData = async (value) => {
        try {
            // const jsonValue = JSON.stringify(value)

            await AsyncStorage.setItem('@storage_Key', String(value))
        } catch (e) {
            console.log(e);
        }
    }

    function set() {
        setCount(count+1);
        storeData(count + 1).then(()  => console.log("Промис выполнен"));
    }

    return (
        <Box>
            <Heading>{count}</Heading>
            <Button onPress={() => set()}>
                Прибавить
            </Button>
        </Box>
    )
}

function UseColorMode(props) {
    const {toggleColorMode} = useColorMode();

    return <Center>
        <Button onPress={() => {
            toggleColorMode();
            props.props.toggle();
        }}>Toggle Color Mode</Button>
    </Center>;
}

function mapStateToProps(state) {
    return {
        theme: state.theme
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({toggle: toggle}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(MyTicketsScreen)