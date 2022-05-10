import React, {useEffect, useState} from "react";
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {FontAwesome} from '@expo/vector-icons';
import YoutubePlayer from "react-native-youtube-iframe";
import {
    Text,
    Link,
    HStack,
    Center,
    Heading,
    Switch,
    useColorMode,
    NativeBaseProvider,
    VStack,
    Box,
    Button,
    View,
    FlatList,
    Image,
    Container,
    Divider,
} from "native-base";
import {TouchableOpacity} from "react-native";

const ThemeContext = React.createContext();
const Tab = createBottomTabNavigator();

// SCREENS
function PosterScreen({navigation}) {
    const [films, setFilms] = useState([]);
    const Stack = createNativeStackNavigator();

    // Примечание: пустой массив зависимостей [] означает, что этот useEffect будет запущен один раз
    useEffect(() => {
        fetch("https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2022&month=MAY", {
            headers: new Headers({
                'X-API-KEY': '2b9134aa-02ff-4744-82d3-5476cf0cc27c'
            }),
        })
            .then(res => res.json())
            .then(
                (result) => setFilms(result.items),
            )
    }, [])

    function Film({title, image}) {
        return (
            <Box textAlign="center" marginRight={6} width={260}>
                <TouchableOpacity onPress={() => navigation.navigate('Film')}>
                    <Image source={{uri: image}} alt="Обложка не доступна" height={260} rounded={"md"}/>
                </TouchableOpacity>
                <Heading fontSize={"lg"} marginTop={2}>{title}</Heading>
            </Box>
        );
    }

    return (
        <Stack.Navigator>
            <Tab.Screen name="Main" options={{headerShown: false}} component={() => {
                return (
                    <VStack space={7} paddingX={6} paddingY={4}>
                        <Box width="100%">
                            <Heading>Премьеры</Heading>
                            <Divider my="4"/>
                            <FlatList
                                data={films}
                                marginTop={1}
                                horizontal={true}
                                renderItem={({item}) => (<Film title={item.nameRu} image={item.posterUrlPreview}/>)}
                                keyExtractor={item => item.kinopoiskId.toString()}
                            />
                        </Box>
                        <Box width="100%">
                            <Heading>Пушкинская карта</Heading>
                            <Divider my="4"/>
                            <FlatList
                                data={films.filter(film => film.countries.find(el => el.country === "Россия")).slice(5, 10)}
                                marginTop={1}
                                horizontal={true}
                                renderItem={({item}) => (<Film title={item.nameRu} image={item.posterUrlPreview}/>)}
                                keyExtractor={item => item.kinopoiskId.toString()}
                            />
                        </Box>
                        <Box width="100%">
                            <Heading>Детям</Heading>
                            <Divider my="4"/>
                            <FlatList
                                data={films.filter(film => film.genres.find(el => el.genre === "мультфильм"))}
                                marginTop={1}
                                horizontal={true}
                                renderItem={({item}) => (<Film title={item.nameRu} image={item.posterUrlPreview}/>)}
                                keyExtractor={item => item.kinopoiskId.toString()}
                            />
                        </Box>
                    </VStack>
                );
            }}/>
            <Tab.Screen name="Film" component={FilmDetailsScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

function ScheduleScreen({navigation}) {
    return (
        <Text>Settings!</Text>
    );
}

function MyTicketsScreen({navigation}) {
    return (
        <ToggleDarkMode/>
    );
}

function FilmDetailsScreen({navigation}) {
    return (
        <VStack space={2}>
            <YoutubePlayer
                height={300}
                forceAndroidAutoplay={true}
                videoId={youtube_parser("https://www.youtube.com/watch?v=UhJ_XIxKM2Q")}
            />
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Details Screen</Text>
                <Button onPress={() => navigation.goBack()}>Назад</Button>
            </View>
        </VStack>
    );
}

// ROOT
export default function App() {
    const [theme, setTheme] = useState(DefaultTheme);

    return (
        <NativeBaseProvider>
            <ThemeContext.Provider value={{theme, setTheme}}>
                <NavigationContainer theme={theme}>
                    <Tab.Navigator screenOptions={{tabBarStyle: {paddingBottom: 10, paddingTop: 10, height: 70}}}>
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
            </ThemeContext.Provider>
        </NativeBaseProvider>
    );
}

// Color Switch Component
function ToggleDarkMode() {
    const {colorMode, toggleColorMode} = useColorMode();
    const {setTheme, theme} = React.useContext(ThemeContext);
    return (
        <HStack space={2} alignItems="center">
            <Text>Dark</Text>
            <Switch
                isChecked={colorMode === "light"}
                onToggle={() => {
                    toggleColorMode();
                    setTheme(theme === DefaultTheme ? DarkTheme : DefaultTheme);
                }}
                aria-label={colorMode === "light" ? "switch to dark mode" : "switch to light mode"}
            />
            <Text>Light</Text>
            <Button>Кнопка</Button>
        </HStack>
    );
}

function youtube_parser(url){
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length==11)? match[7] : false;
}
