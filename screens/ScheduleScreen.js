import SeatsPicker from "./SeatsPickerScreen"
import React, {useEffect, useState} from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Badge, Box, Button, Divider, Fab, FlatList, Heading, HStack, Icon, Image, Radio, ScrollView, Text, VStack} from "native-base";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import {FontAwesome} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import {Spacer} from "native-base/src/components/primitives/Flex";

export default function ScheduleScreen({route, navigation}) {
    const Stack = createNativeStackNavigator();
    const [schedule, setSchedule] = useState(require('../data/schedule.json'));
    const [films, setFilms] = useState(require('../data/films.json'));
    const [day, setDay] = useState("0");
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
            <TouchableOpacity onPress={() => navigation.navigate('Места', {scheduleItem: item, filmItem: films.find((el) => el.kinopoiskId === item.kinopoiskId)})}>
                <HStack
                    marginX={3}
                    marginBottom={3}
                    padding={2}
                    _light={{backgroundColor: "rgb(235, 235, 235)"}}
                    _dark={{backgroundColor: "rgba(200, 200, 200, 0.3)"}}
                    rounded={"sm"}
                >
                    <Image source={{uri: films.find((el) => el.kinopoiskId === item.kinopoiskId).posterUrl}} alt="Обложка не доступна" height={100} width={100} rounded={"sm"}/>
                    <Text paddingX={3}>{films.find((el) => el.kinopoiskId === item.kinopoiskId).nameRu}</Text>
                    <VStack ml={"auto"}>
                        <Heading size={"sm"} textAlign={"right"}>{item.time}</Heading>
                        <Text fontSize={12} mt={"auto"}>{item.room === 0 ? "Малый зал" : "Большой зал"}</Text>
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
            <Stack.Screen name="Расписание" options={{headerShown: false}} component={() => {
                return (
                    <ScrollView>
                        <VStack space={4} paddingX={3} paddingY={4}>
                            <Radio.Group name="myRadioGroup" value={day} direction={"row"} onChange={nextValue => setDay(nextValue)}>
                                <HStack space={4}>
                                    <Radio value="0" size="sm">
                                        <Box textAlign={"center"}>
                                            <Box _light={{backgroundColor: "rgb(235, 235, 235)"}}
                                                 _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                                 justifyContent={"center"}
                                                 rounded={"2xl"}
                                                 padding={3}
                                            >
                                                <Heading size={"xs"}>{days[new Date().getDay()]}</Heading>
                                                <Heading size={"md"}>{new Date().getDate()}</Heading>
                                            </Box>
                                            <Text>Сегодня</Text>
                                        </Box>
                                    </Radio>
                                    <Radio value="1" size="sm">
                                        <Box textAlign={"center"}>
                                            <Box _light={{backgroundColor: "rgb(235, 235, 235)"}}
                                                 _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                                 justifyContent={"center"}
                                                 rounded={"2xl"}
                                                 padding={3}
                                            >
                                                <Heading size={"xs"}>{days[new Date().getDay() + 1]}</Heading>
                                                <Heading size={"md"}>{new Date().getDate() + 1}</Heading>
                                            </Box>
                                            <Text>Завтра</Text>
                                        </Box>
                                    </Radio>
                                    <Radio value="2" size="sm">
                                        <Box textAlign={"center"}>
                                            <Box _light={{backgroundColor: "rgb(235, 235, 235)"}}
                                                 _dark={{backgroundColor: "rgba(200, 200, 200, 0.6)"}}
                                                 justifyContent={"center"}
                                                 rounded={"2xl"}
                                                 padding={3}
                                            >
                                                <Heading size={"xs"}>{days[new Date().getDay() + 2]}</Heading>
                                                <Heading size={"md"}>{new Date().getDate() + 2}</Heading>
                                            </Box>
                                            <Text>Послезавтра</Text>
                                        </Box>
                                    </Radio>
                                </HStack>
                            </Radio.Group>

                            <FlatList data={scheduleTrue()} marginTop={2} renderItem={({item}) => <ScheduleItem item={item}/>}/>

                            {route.params?.film_id && useIsFocused() &&
                                <Fab style={{backgroundColor: "rgb(0, 122, 245)", width: 200, bottom: 70, left: '50%', transform: [{translateX: -100}]}}
                                     icon={<Icon color="white" as={<FontAwesome name="calendar"/>} size="sm"/>}
                                     label="Полное расписание" onPress={() => navigation.setParams({film_id: null})}/>}
                        </VStack>
                    </ScrollView>
                );
            }}/>
            <Stack.Screen name="Места" options={{headerShown: false}} component={SeatsPicker}/>
        </Stack.Navigator>
    );
}