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
    Alert
} from 'react-native';
import Constants from 'expo-constants';
import {Box, Button, HStack, Icon, VStack} from "native-base";
import {FontAwesome} from "@expo/vector-icons";

const {width, height} = Dimensions.get('window');
const ROWS = 6;
const COLS = 5;
const TIMING = 600;
const TEXT_HEIGHT = 20;
let seats = [];
let seatsAnimation = [];

for (let i = 0; i < ROWS + COLS - 1; i++) {
    seatsAnimation.push(i);
}

Array(ROWS * COLS).join(' ').split(' ').map((_, i) => {
    const currentIndex = i % COLS + Math.floor(i / COLS) % ROWS;
    const currentItem = {
        label: i + 1 < 10 ? '0' + (i + 1) : i + 1,
        s: currentIndex,
        key: i,
        animated: new Animated.Value(1)
    };

    seats.push(currentItem);
});

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            selectedItems: []
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
                    this.setState(
                        {
                            selectedItems: selected
                        },
                        () => {
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
                }}
                style={{
                    opacity: 1 - parseInt(item.s) / 15
                }}>
                <Animated.View
                    style={{
                        transform: [
                            {
                                scale: item.animated
                            }
                        ]
                    }}>
                    <Animated.View
                        style={[
                            {
                                backgroundColor: isSelected ? '#8EF0E7' : '#3493FF'
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
            <Box style={{alignItems: 'center'}}>
                <FlatList
                    numColumns={COLS}
                    extraData={this.state.selectedItems}
                    data={seats}
                    style={{flexGrow: 1, flexShrink: 1}}
                    renderItem={this.renderItem}
                />
                <HStack justifyContent={"space-between"} width={"100%"} marginTop={3} paddingX={3} style={{alignItems: "center"}}>
                    <VStack style={{flexShrink: 1}} space={1}>
                        <Text _dark={{color: "rgb(250, 250, 250)"}}>Дата: 16 мая</Text>
                        <Text _dark={{color: "rgb(250, 250, 250)"}}>Время: 18:20</Text>
                        <Text _dark={{color: "rgb(250, 250, 250)"}}>Фильм: Суворов</Text>
                        <HStack>
                            <Text _dark={{color: "rgb(250, 250, 250)"}}>Выбрано мест:</Text>
                            <View _dark={{color: "rgb(250, 250, 250)"}} style={{height: TEXT_HEIGHT, overflow: 'hidden', backgroundColor: 'transparent'}}>
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
                                    {Array(ROWS * COLS + 1).join(' ').split(' ').map((_, i) => {
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
                        <Text _dark={{color: "rgb(250, 250, 250)"}}>
                            Итого: 600 ₽
                        </Text>
                    </VStack>
                    <Button colorScheme={"blue"} rounded={"lg"} endIcon={<Icon as={FontAwesome} name="ticket" size={"lg"}/>}>
                        Забронировать
                    </Button>
                </HStack>
            </Box>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        width: width / COLS,
        height: width / COLS,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemText: {
        color: 'white',
        fontWeight: '700'
    }
});