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
    FlatList,
    Image,
    Divider, ScrollView,
} from "native-base";
import {ImageBackground, TouchableOpacity} from "react-native";

const ThemeContext = React.createContext();
const Tab = createBottomTabNavigator();

// SCREENS
// Афиша
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

    function Film({film_id, title, image}) {
        return (
            <Box textAlign="center" marginRight={6} width={260}>
                <TouchableOpacity onPress={() => navigation.navigate('Film', {film_id: film_id})}>
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
                    <ScrollView>
                        <VStack space={7} paddingX={6} paddingY={4}>
                            <Box width="100%">
                                <Heading>Премьеры</Heading>
                                <Divider my="4"/>
                                <FlatList
                                    data={films}
                                    marginTop={1}
                                    horizontal={true}
                                    renderItem={({item}) => (<Film film_id={item.kinopoiskId} title={item.nameRu} image={item.posterUrlPreview}/>)}
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
                                    renderItem={({item}) => (<Film film_id={item.kinopoiskId} title={item.nameRu} image={item.posterUrlPreview}/>)}
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
                                    renderItem={({item}) => (<Film film_id={item.kinopoiskId} title={item.nameRu} image={item.posterUrlPreview}/>)}
                                    keyExtractor={item => item.kinopoiskId.toString()}
                                />
                            </Box>
                        </VStack>
                    </ScrollView>
                );
            }}/>
            <Tab.Screen name="Film" component={FilmDetailsScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}

// Расписание
function ScheduleScreen({navigation}) {
    return (
        <Text>Settings!</Text>
    );
}

// Мои билеты
function MyTicketsScreen({navigation}) {
    return (
        <ToggleDarkMode/>
    );
}

// Информация о фильме
function FilmDetailsScreen({route, navigation}) {
    const [film, setFilm] = useState([]);
    // Примечание: пустой массив зависимостей [] означает, что этот useEffect будет запущен один раз
    useEffect(() => {
        fetch("https://kinopoiskapiunofficial.tech/api/v2.2/films/" + route.params.film_id, {
            headers: new Headers({
                'X-API-KEY': '2b9134aa-02ff-4744-82d3-5476cf0cc27c'
            }),
        })
            .then(res => res.json())
            .then(result => setFilm(result))
    }, [])
    return (
        <ScrollView>
            <Box style={{height: '300px', backgroundColor: 'rgb(0,0,0)'}}>
                <ImageBackground source={{uri: film.posterUrl}} alt="Обложка не доступна" style={{height: '100%', justifyContent: "flex-end"}} imageStyle={{opacity: 0.6}}>
                    <Heading style={{textAlign: 'center', color: '#fff', padding: 12}}>{film.nameRu}</Heading>
                </ImageBackground>
            </Box>
            <VStack space={4} padding={3}>
                <Text textAlign={"center"}>{film.description}</Text>
                <YoutubePlayer
                    height={300}
                    forceAndroidAutoplay={true}
                    videoId={youtube_parser("https://www.youtube.com/watch?v=UhJ_XIxKM2Q")}
                />
            </VStack>
            <Box style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text></Text>
                <Button onPress={() => navigation.goBack()}>Назад</Button>
            </Box>
        </ScrollView>
    );
}

// ROOT
export default function App() {
    const [theme, setTheme] = useState(DefaultTheme);

    return (
        <NativeBaseProvider>
            <ThemeContext.Provider value={{theme, setTheme}}>
                <NavigationContainer theme={theme}>
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

function youtube_parser(url) {
    let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    let match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}
