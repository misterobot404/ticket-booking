import {Button, Center, HStack, useColorMode} from "native-base";
import Store from '../store';

export default function MyTicketsScreen({navigation}) {
    return (
        <HStack space={2} alignItems="center">
            <UseColorMode/>
        </HStack>
    )
}

function UseColorMode() {
    const {toggleColorMode} = useColorMode();
    return <Center>
        <Button onPress={() => {
            toggleColorMode();
            Store.toggleColorMode();
            Store.incr();
        }}>Toggle Color Mode</Button>
    </Center>;
}