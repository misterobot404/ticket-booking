import {createNativeStackNavigator} from "@react-navigation/native-stack";
import React, {useEffect, useState} from "react";
import {Box, Divider, FlatList, Heading, Image, ScrollView, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import FilmDetailsScreen from "./FilmDetailsScreen";

export default function PosterScreen({navigation}) {
    const Stack = createNativeStackNavigator();
    const [films, setFilms] = useState([]);

    // Примечание: пустой массив зависимостей [] означает, что этот useEffect будет запущен один раз
    useEffect(() => setFilms(require('../data/films.json')), [])

    function Film({film_id, title, image, premiere_date}) {
        return (
            <Box marginRight={4} width={260}>
                <TouchableOpacity onPress={() => navigation.navigate('Фильм', {film_id: film_id, premiere_date: premiere_date})}>
                    <Image source={{uri: image}} alt="Обложка не доступна" height={260} rounded={"md"}/>
                </TouchableOpacity>
                <Heading fontSize={"lg"} style={{textAlign: 'center'}} marginTop={2}>{title}</Heading>
            </Box>
        );
    }

    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" options={{headerShown: false}} component={() => {
                return (
                    <ScrollView>
                        <VStack space={7} paddingX={6} paddingY={4}>
                            <Box width="100%" marginTop={1}>
                                <Heading>Премьеры</Heading>
                                <Divider my="4"/>
                                <FlatList
                                    data={films.slice().sort(() => Math.random() - 0.5)}
                                    marginTop={1}
                                    horizontal={true}
                                    renderItem={({item}) => (<Film film_id={item.kinopoiskId} premiere_date={item.premiereRu} title={item.nameRu} image={item.posterUrlPreview}/>)}
                                    keyExtractor={item => item.kinopoiskId.toString()}
                                />
                            </Box>
                            <Box width="100%">
                                <Heading>Пушкинская карта</Heading>
                                <Divider my="4"/>
                                <FlatList
                                    data={films.filter(film => film.countries.find(el => el.country === "Россия"))}
                                    marginTop={1}
                                    horizontal={true}
                                    renderItem={({item}) => (<Film film_id={item.kinopoiskId} premiere_date={item.premiereRu} title={item.nameRu} image={item.posterUrlPreview}/>)}
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
                                    renderItem={({item}) => (<Film film_id={item.kinopoiskId} premiere_date={item.premiereRu} title={item.nameRu} image={item.posterUrlPreview}/>)}
                                    keyExtractor={item => item.kinopoiskId.toString()}
                                />
                            </Box>
                            <Box width="100%">
                                <Heading>Ужасы</Heading>
                                <Divider my="4"/>
                                <FlatList
                                    data={films.filter(film => film.genres.find(el => el.genre === "ужасы"))}
                                    marginTop={1}
                                    horizontal={true}
                                    renderItem={({item}) => (<Film film_id={item.kinopoiskId} premiere_date={item.premiereRu} title={item.nameRu} image={item.posterUrlPreview}/>)}
                                    keyExtractor={item => item.kinopoiskId.toString()}
                                />
                            </Box>
                        </VStack>
                    </ScrollView>
                );
            }}/>
            <Stack.Screen name="Фильм" options={{headerShown: false}} component={FilmDetailsScreen}/>
        </Stack.Navigator>
    );
}
