import {Box, Button, Divider, Heading, HStack, Image, ScrollView, Text, useColorMode, VStack} from "native-base";
import React, {Component, useState} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {FlatList} from "react-native";

async function removeTicket(props) {
    props.props.props.deleteTicket(props.item);
}

class MyTicketsScreen extends Component {
    constructor(props) {super(props);}

    render() {
        function Tickets(props) {
            return (
                <Box>
                    {props.props.tickets.length === 0 && <Text>Забронируйте билеты в разделе «Расписание»</Text>}
                    <FlatList data={props.props.tickets} renderItem={({item}) => <Ticket props={props} item={item}/>}/>
                </Box>
            )
        }

        function Ticket(props) {
            const [scheduleItem, setScheduleItem] = useState(require('../data/schedule.json').find((el) => el.id === props.item.scheduleId));
            const [film, setFilms] = useState(require('../data/films.json').find((el) => el.kinopoiskId === props.item.kinopoiskId));

            return (
                <Box padding={2} marginBottom={3} _light={{backgroundColor: "rgb(235, 235, 235)"}} _dark={{backgroundColor: "rgba(200, 200, 200, 0.3)"}} rounded={"sm"}>
                    <HStack>
                        <Image source={{uri: film.posterUrl}} alt="Обложка не доступна" height={100} width={100} rounded={"sm"}/>
                        <Text paddingX={3} style={{flexShrink: 1}}>{film.nameRu}</Text>
                        <VStack ml={"auto"}>
                            <Heading size={"sm"} textAlign={"right"}>{scheduleItem.time}</Heading>
                            <Text fontSize={12} mt={"auto"} ml={"auto"}>{scheduleItem.price + "₽"}</Text>
                            <Text fontSize={12}>{scheduleItem.room === 0 ? "Малый зал" : "Большой зал"}</Text>
                        </VStack>
                    </HStack>
                    <Divider marginY={2}/>
                    <HStack alignItems="center" justifyContent="space-between">
                        <Button variant="outline" onPress={() => removeTicket(props)}>Отменить бронь</Button>
                        <Heading size={"xs"}>{"Код брони: " + props.item.code}</Heading>
                    </HStack>
                </Box>
            );
        }

        function UseColorMode(props) {
            const {toggleColorMode} = useColorMode();

            return (
                <Button variant="link" onPress={() => {
                    toggleColorMode();
                    props.props.toggle();
                }}>Переключить цветовой режим (beta)</Button>
            )
        }

        return (
            <ScrollView paddingX={6} paddingY={4}>
                <Heading>Мои билеты</Heading>
                <Text marginTop={2}>Билеты необходимо выкупить за 30 минут до начала сеанса!</Text>
                <Divider marginY={3}/>
                <Tickets props={this.props}/>
                <Heading marginTop={4}>Настройки</Heading>
                <Divider marginY={3}/>
                <UseColorMode props={this.props}/>
            </ScrollView>
        )
    }
}

function mapStateToProps(state) {
    return {
        theme: state.theme,
        tickets: state.tickets
    }
}

const toggle = () => {
    return {
        type: 'TOGGLE'
    }
}

const deleteTicket = (payload) => {
    return {
        type: 'DELETE_TICKET',
        payload
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({toggle: toggle, deleteTicket: deleteTicket}, dispatch)
}

connect(mapStateToProps, matchDispatchToProps)(removeTicket)

export default connect(mapStateToProps, matchDispatchToProps)(MyTicketsScreen)