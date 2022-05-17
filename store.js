import { configureStore } from '@reduxjs/toolkit'
import {DefaultTheme, DarkTheme} from '@react-navigation/native';

export default configureStore({
    reducer: {}
})


const store = observable({
    // 2b9134aa-02ff-4744-82d3-5476cf0cc27c
    // 197a2b18-9687-4ac0-a84a-21fc9fed5506
    API_KEY: '2b9134aa-02ff-4744-82d3-5476cf0cc27c',
    colorMode: DefaultTheme,
    number: 0
});

store.toggleColorMode = () => {
    this.colorMode = this.colorMode === DefaultTheme ? DarkTheme : DefaultTheme;
    console.log(this.colorMode);
}

store.incr = () => {
    this.number++;
}

export default store