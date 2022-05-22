import React, {Component} from 'react';
import {
    Easing,
    TouchableOpacity,
    Animated,
    Dimensions,
    FlatList,
    Text,
    View,
    StyleSheet,
} from 'react-native';

import {Box, Button, Heading, HStack, Icon, VStack} from "native-base";
import {FontAwesome} from "@expo/vector-icons";

export default class App extends Component {
    constructor(props) {
        super(props);

        const {width, height} = Dimensions.get('window');

        const selected_room = 0;
        const disabledItems = [1, 5, 10];
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

        const TIMING = 600;
        const TEXT_HEIGHT = 20;

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

        this.state = {
            finished: false,
            selectedItems: [],
            scheduleItem: props.route.params.scheduleItem,
            film: props.route.params.filmItem,
        };

        this.selectionAnimation = new Animated.Value(0);

        this.animatedValue = [];
        seatsAnimation.forEach(value => {
            this.animatedValue[value] = new Animated.Value(0);
        });
    }

    animate = () => {
        const animations = seatsAnimation.map(item => {
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
            Animated.timing(this.selectionAnimation, {
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
        const isBlocked = disabledItems.includes(item.key);
        const itemPressScale = item.animated.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0, 1]
        });

        return (
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                    const selected = isSelected
                        ? selectedItems.filter(i => i !== item.key)
                        : [...selectedItems, item.key];

                    item.animated.setValue(0);
                    this.setState({selectedItems: selected}, () => {
                            Animated.parallel([
                                Animated.timing(this.selectionAnimation, {
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
                    console.log(selectedItems);
                }}
                style={{opacity: 1 - parseInt(item.s) / ROOMS[selected_room].gradient}}>
                <Animated.View
                    style={{
                        transform: [
                            {
                                scale: item.animated
                            }
                        ]
                    }}>
                    <Animated.View
                        style={[{
                            backgroundColor: isSelected ? '#5AD1FF' : (isBlocked ? '#5C596D' : '#3493FF')
                        },
                            styles.item,
                            {
                                transform: [
                                    {
                                        scale
                                    }
                                ]
                            }
                        ]}>
                        <Animated.Text style={[styles.itemText]}>
                            {item.label}
                        </Animated.Text>
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
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
                        numColumns={ROOMS[selected_room].COLS}
                        extraData={this.state.selectedItems}
                        data={seats}
                        style={{flexGrow: 1, flexShrink: 1}}
                        renderItem={this.renderItem}
                    />
                    <HStack justifyContent={"space-between"} width={"100%"} marginTop={3} paddingX={3} style={{alignItems: "center"}}>
                        <VStack style={{flexShrink: 1}} space={1}>
                            <Text>Фильм: {this.state.film.nameRu}</Text>
                            <Text>Дата: 16 мая</Text>
                            <Text>Время: 18:20</Text>
                            <HStack>
                                <Text>Выбрано мест:</Text>
                                <View style={{height: TEXT_HEIGHT, overflow: 'hidden', backgroundColor: 'transparent'}}>
                                    <Animated.View style={{
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        transform: [
                                            {
                                                translateY: this.selectionAnimation
                                            }
                                        ]
                                    }}>
                                        {Array(ROOMS[selected_room].ROWS * ROOMS[selected_room].COLS + 1).join(' ').split(' ').map((_, i) => {
                                            return (
                                                <View
                                                    key={i}
                                                    style={{
                                                        height: TEXT_HEIGHT,
                                                        width: TEXT_HEIGHT,
                                                        marginRight: 4,
                                                        alignItems: 'flex-end',
                                                        justifyContent: 'center'
                                                    }}>
                                                    <Text style={[styles.text]}>
                                                        {i}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </Animated.View>
                                </View>
                            </HStack>
                            <Text>
                                Итого: 600 ₽
                            </Text>
                        </VStack>
                        <Button colorScheme={"blue"} rounded={"lg"} endIcon={<Icon as={FontAwesome} name="ticket" size={"lg"}/>}>
                            Забронировать
                        </Button>
                    </HStack>
                </Box>
            </VStack>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        width: width / ROOMS[selected_room].COLS,
        height: width / ROOMS[selected_room].COLS,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemText: {
        color: 'white',
        fontWeight: '600'
    }
});
