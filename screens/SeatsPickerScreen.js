import React, {Component} from 'react';
import {
    Easing,
    TouchableOpacity,
    Animated,
    Dimensions,
    FlatList,
    Text,
    StyleSheet,
} from 'react-native';

import {Badge, Box, Button, Fab, Heading, HStack, Icon, Modal, ScrollView, VStack} from "native-base";
import {FontAwesome} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const ROOMS = [
    {
        ROWS: 5,
        COLS: 5,
        gradient: 15
    },
    {
        ROWS: 12,
        COLS: 12,
        gradient: 35
    },
]
const TIMING = 600
const TEXT_HEIGHT = 20
const {width} = Dimensions.get('window')

class App extends Component {
    constructor(props) {
        super(props);

        const styles = StyleSheet.create({
            item: {
                width: width / ROOMS[props.route.params.scheduleItem.room].COLS,
                height: width / ROOMS[props.route.params.scheduleItem.room].COLS,
                alignItems: 'center',
                justifyContent: 'center'
            },
            itemText: {
                color: 'white',
                fontWeight: '600'
            }
        });

        const selected_room = props.route.params.scheduleItem.room;

        let seats = [];
        let seatsAnimation = [];

        for (let i = 0; i < ROOMS[selected_room].ROWS + ROOMS[selected_room].COLS - 1; i++) {
            seatsAnimation.push(i);
        }

        Array(ROOMS[selected_room].ROWS * ROOMS[selected_room].COLS).join(' ').split(' ').map((_, i) => {
            const currentIndex = i % ROOMS[selected_room].COLS + Math.floor(i / ROOMS[selected_room].COLS) % ROOMS[selected_room].ROWS;
            const currentItem = {
                label: (i % ROOMS[selected_room].COLS + 1 < 10 ? '0' : null) + ((i % ROOMS[selected_room].COLS + 1)),
                s: currentIndex,
                key: i,
                animated: new Animated.Value(1)
            };

            seats.push(currentItem);
        });

        const selectionAnimation = new Animated.Value(0);

        this.animatedValue = [];
        seatsAnimation.forEach(value => {
            this.animatedValue[value] = new Animated.Value(0);
        });

        this.state = {
            finished: false,
            showModal: false,
            showModalDone: false,
            selectedItems: [],
            scheduleItem: props.route.params.scheduleItem,
            film: props.route.params.filmItem,
            seats: seats,
            seatsAnimation: seatsAnimation,
            selected_room: selected_room,
            styles: styles,
            selectionAnimation: selectionAnimation,
            navigation: props.navigation
        };
    }

    animate = () => {
        const animations = this.state.seatsAnimation.map(item => {
            return Animated.timing(this.animatedValue[item], {
                toValue: this.state.finished ? 0 : 1,
                duration: TIMING
            });
        });
        Animated.sequence([
            Animated.stagger(TIMING * 0.15, animations)
        ]).start(() => {
            this.setState({
                finished: !this.state.finished,
                selectedItems: []
            });

            // this.selectionAnimation.setValue(0);
            Animated.timing(this.state.selectionAnimation, {
                toValue: 0,
                duration: 1000,
                easing: Easing.elastic(1.3)
            }).start();
        });
    };
    renderItem = ({item}) => {
        const i = item.key;
        const scale = this.animatedValue[item.s].interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1]
        });
        const {selectedItems} = this.state;
        const isSelected = selectedItems.includes(item.key);
        const isBlocked = this.state.scheduleItem.broken.includes(item.key);
        const itemPressScale = item.animated.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1]
        });

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    if (isBlocked) return;

                    const selected = isSelected
                        ? selectedItems.filter(i => i !== item.key)
                        : [...selectedItems, item.key];

                    item.animated.setValue(0);
                    this.setState({selectedItems: selected}, () => {
                            Animated.parallel([
                                Animated.timing(this.state.selectionAnimation, {
                                    toValue: -TEXT_HEIGHT * selected.length,
                                    duration: 500,
                                    easing: Easing.elastic(1.3)
                                }),
                                Animated.timing(item.animated, {
                                    toValue: 1,
                                    duration: 200
                                })
                            ]).start();
                        }
                    );
                }}
                style={{opacity: 1 - parseInt(item.s) / ROOMS[this.state.selected_room].gradient}}>
                <Animated.View style={{
                    transform: [
                        {
                            scale: item.animated
                        }
                    ]
                }}>
                    <Animated.View style={[{
                        backgroundColor: isSelected ? '#5AD1FF' : (isBlocked ? '#5C596D' : '#3493FF')
                    },
                        this.state.styles.item,
                        {
                            transform: [
                                {
                                    scale
                                }
                            ]
                        }
                    ]}>
                        <Animated.Text style={[this.state.styles.itemText]}>
                            {item.label}
                        </Animated.Text>
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
        );
    };
    async booking() {
        try {
            const ticket = {
                id: Math.floor(Math.random() * (99999 - 1) + 1),
                scheduleId: this.state.scheduleItem.id,
                kinopoiskId: this.state.film.kinopoiskId,
                places: this.state.selectedItems,
                code: Math.floor(Math.random() * (999999 - 100000) + 100000)
            };
            this.props.addTicket(ticket);
        } catch (e) {}
    }

    render() {
        return (
            <ScrollView>
                <VStack space={2}>
                    <Box _light={{backgroundColor: "rgb(225, 225, 225)"}}
                         _dark={{backgroundColor: "rgba(158, 158, 158, 0.3)"}}
                         paddingY={4}
                         marginTop={2}
                         marginX={2}
                         rounded={"lg"}>
                        <Heading size={"sm"} style={{textAlign: 'center'}}>ЭКРАН</Heading>
                    </Box>
                    <HStack space={"2"} padding={2} marginBottom={1} justifyContent={"center"}>
                        <HStack alignItems={"center"}>
                            <Box width={4} height={4} backgroundColor={"#3493FF"} rounded={"full"}/>
                            <Text> - доступно </Text>
                        </HStack>
                        <HStack alignItems={"center"}>
                            <Box width={4} height={4} backgroundColor={"#5C596D"} rounded={"full"}/>
                            <Text> - не доступно </Text>
                        </HStack>
                        <HStack alignItems={"center"}>
                            <Box width={4} height={4} backgroundColor={"#5AD1FF"} rounded={"full"}/>
                            <Text> - выбрано </Text>
                        </HStack>
                    </HStack>
                    <Box style={{alignItems: 'center'}}>
                        <FlatList
                            numColumns={ROOMS[this.state.selected_room].COLS}
                            extraData={this.state.selectedItems}
                            data={this.state.seats}
                            style={{flexGrow: 1, flexShrink: 1}}
                            renderItem={this.renderItem}
                        />
                        <FlatList
                            data={this.state.selectedItems}
                            horizontal={true}
                            renderItem={(item) =>
                                <Box marginTop={4} marginX={1}>
                                    <Badge _light={{backgroundColor: "rgb(230, 230, 230)"}} paddingX={2}>
                                        {"Ряд: " + (Math.floor(item.item / ROOMS[this.state.selected_room].COLS) + 1) + ", Место: " + (item.item % ROOMS[this.state.selected_room].COLS + 1)}
                                    </Badge>
                                </Box>
                            }
                        />
                        <Button isDisabled={this.state.selectedItems.length === 0}
                                style={{backgroundColor: "rgb(0, 122, 245)", display: this.state.selectedItems.length === 0 ? "none" : "flex"}}
                                leftIcon={<Icon color="white" as={<FontAwesome name="ticket"/>} size="lg"/>}
                                onPress={() => this.setState({showModal: true})}
                                paddingX={6}
                                marginTop={4}
                                rounded={"3xl"}
                        >
                            Забронировать
                        </Button>
                        <Modal isOpen={this.state.showModal} onClose={() => this.setState({showModal: false})} size="lg">
                            <Modal.Content maxWidth="350">
                                <Modal.CloseButton/>
                                <Modal.Header>Бронирование билетов</Modal.Header>
                                <Modal.Body>
                                    <VStack space={3}>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text fontWeight="medium">Фильм</Text>
                                            <Text color="blueGray.400">{this.state.film.nameRu}</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text fontWeight="medium">Дата</Text>
                                            <Text color="blueGray.400">{new Date().getDate() + this.state.scheduleItem.day + "." + new Date().getMonth()}</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text fontWeight="medium">Время</Text>
                                            <Text color="blueGray.400">{this.state.scheduleItem.time}</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text fontWeight="medium">Зал</Text>
                                            <Text color="green.500">{this.state.scheduleItem.room === 0 ? "Малый зал" : "Большой зал"}</Text>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text fontWeight="medium">Места</Text>
                                            <Box>
                                                <FlatList
                                                    data={this.state.selectedItems}
                                                    renderItem={(item) =>
                                                        <Box marginTop={2} maxWidth={100}>
                                                            <Badge _light={{backgroundColor: "rgb(230, 230, 230)"}}>
                                                                {"Ряд: " + (Math.floor(item.item / ROOMS[this.state.selected_room].COLS) + 1) + ", Место: " + (item.item % ROOMS[this.state.selected_room].COLS + 1)}
                                                            </Badge>
                                                        </Box>
                                                    }
                                                />
                                            </Box>
                                        </HStack>
                                        <HStack alignItems="center" justifyContent="space-between">
                                            <Text fontWeight="medium">Цена</Text>
                                            <Text color="green.500">{this.state.scheduleItem.price + "₽"}</Text>
                                        </HStack>
                                    </VStack>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button flex="1" onPress={() => this.booking().then(() => this.setState({showModal: false, showModalDone: true}))}>
                                        Подтвердить
                                    </Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                        <Modal isOpen={this.state.showModalDone} onClose={() => this.setState({showModalDone: false})} size="lg">
                            <Modal.Content maxWidth="300">
                                <Modal.CloseButton/>
                                <Modal.Header>Билеты забронированы</Modal.Header>
                                <Modal.Body>
                                    <VStack space={3}>
                                        <Text>Все забронированные билеты отображаются в разделе «Мои билеты».</Text>
                                    </VStack>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button flex="1" onPress={() => {
                                        this.setState({showModalDone: false});
                                        this.state.navigation.goBack();
                                    }}>
                                        Продолжить
                                    </Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                    </Box>
                </VStack>
            </ScrollView>
        );
    }
}

function mapStateToProps(state) {
    return {
        tickets: state.tickets
    }
}

const addTicket = (payload) => {
    return {
        type: 'ADD_TICKET',
        payload
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({addTicket: addTicket}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
