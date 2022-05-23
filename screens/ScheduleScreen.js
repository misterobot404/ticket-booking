import SeatsPicker from "./SeatsPickerScreen"
import React, {useState} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Box, Divider, Fab, FlatList, Heading, HStack, Icon, Image, Radio, ScrollView, Text, VStack} from "native-base";
import {useFocusEffect, useIsFocused, useNavigation} from "@react-navigation/native";
import {FontAwesome} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";

const Stack = createNativeStackNavigator();

export default function ScheduleScreen({route, navigation}) {
    const [schedule, setSchedule] = useState(require('../data/schedule.json'));
    const [films, setFilms] = useState(require('../data/films.json'));
    const [day, setDay] = useState("0");
    const nav = useNavigation();

    const days = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
    ];

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            return () => {
                // Do something when the screen is unfocused
                navigation.setParams({film_id: null}) // reset parametr that you need
            };
        }, []),
    );

    function ScheduleItem({item}) {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('Места', {navigation: nav, title: films.find((el) => el.kinopoiskId === item.kinopoiskId).nameRu,scheduleItem: item, filmItem: films.find((el) => el.kinopoiskId === item.kinopoiskId)})}>
                <HStack
                    marginBottom={4}
                    padding={2}
                    _light={{backgroundColor: "rgb(235, 235, 235)"}}
                    _dark={{backgroundColor: "rgba(200, 200, 200, 0.3)"}}
                    rounded={"sm"}
                >
                    <Image source={{uri: films.find((el) => el.kinopoiskId === item.kinopoiskId).posterUrl}} alt="Обложка не доступна" height={100} width={100} rounded={"sm"}/>
                    <Text paddingX={3} style={{flexShrink: 1}}>{films.find((el) => el.kinopoiskId === item.kinopoiskId).nameRu}</Text>
                    <VStack ml={"auto"}>
                        <Heading size={"sm"} textAlign={"right"}>{item.time}</Heading>
                        <Text fontSize={12} mt={"auto"} ml={"auto"}>{item.price + "₽"}</Text>
                        <Text fontSize={12}>{item.room === 0 ? "Малый зал" : "Большой зал"}</Text>
                    </VStack>

                </HStack>
            </TouchableOpacity>
        );
    }

    function scheduleTrue() {
        return schedule.filter(el => el.day == day && (route.params?.film_id ? route.params?.film_id === el.kinopoiskId : true));
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" options={{headerShown: false}} component={() => {
                return (
                    <ScrollView>
                        <VStack space={4} paddingTop={7} paddingX={4}>
                            <Radio.Group name="myRadioGroup" value={day} direction={"row"} onChange={nextValue => setDay(nextValue)}>
                                <ScrollView horizontal={true}>
                                    <HStack space={5}>
                                        <Radio value="0" size="sm">
                                            <Box style={{textAlign: 'center'}}>
                                                <Box _light={{backgroundColor: "rgb(225, 225, 225)"}}
                                                     _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                                     justifyContent={"center"}
                                                     rounded={"2xl"}
                                                     padding={3}
                                                >
                                                    <Heading textAlign={"center"} size={"xs"}>{days[new Date().getDay()]}</Heading>
                                                    <Heading textAlign={"center"} mt={1} size={"md"}>{new Date().getDate()}</Heading>
                                                </Box>
                                                <Text textAlign={"center"}>Сегодня</Text>
                                            </Box>
                                        </Radio>
                                        <Radio value="1" size="sm">
                                            <Box textAlign={"center"}>
                                                <Box _light={{backgroundColor: "rgb(225, 225, 225)"}}
                                                     _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                                     justifyContent={"center"}
                                                     rounded={"2xl"}
                                                     padding={3}
                                                >
                                                    <Heading textAlign={"center"} size={"xs"}>{days[new Date().getDay() + 1]}</Heading>
                                                    <Heading textAlign={"center"} mt={1} size={"md"}>{new Date().getDate() + 1}</Heading>
                                                </Box>
                                                <Text textAlign={"center"}>Завтра</Text>
                                            </Box>
                                        </Radio>
                                        <Radio value="2" size="sm">
                                            <Box style={{textAlign: 'center'}}>
                                                <Box _light={{backgroundColor: "rgb(230, 230, 230)"}}
                                                     _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                                     justifyContent={"center"}
                                                     rounded={"2xl"}
                                                     padding={3}
                                                >
                                                    <Heading textAlign={"center"} size={"xs"}>{days[new Date().getDay() + 2]}</Heading>
                                                    <Heading textAlign={"center"} mt={1} size={"md"}>{new Date().getDate() + 2}</Heading>
                                                </Box>
                                                <Text textAlign={"center"}>Послезавтра</Text>
                                            </Box>
                                        </Radio>
                                    </HStack>
                                </ScrollView>
                            </Radio.Group>

                            <Divider/>

                            <FlatList data={scheduleTrue()} renderItem={({item}) => <ScheduleItem item={item}/>}/>

                            {route.params?.film_id && useIsFocused() &&
                                <Fab style={{backgroundColor: "rgb(0, 122, 245)", width: 200, bottom: 70, left: '50%', transform: [{translateX: -100}]}}
                                     icon={<Icon color="white" as={<FontAwesome name="calendar"/>} size="sm"/>}
                                     label="Полное расписание" onPress={() => navigation.setParams({film_id: null})}/>}
                        </VStack>
                    </ScrollView>
                );
            }}/>
            <Stack.Screen name="Места" options={({ route }) => ({ title: route.params.title })} component={SeatsPicker}/>
        </Stack.Navigator>
    );
}
