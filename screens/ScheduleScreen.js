import {Box, Heading, VStack} from "native-base";
import SeatsPicker from "./SeatsPickerScreen"


export default function ScheduleScreen({navigation}) {
    return (
        <VStack space={2}>
            <Box _light={{backgroundColor: "rgb(225, 225, 225)"}}
                 _dark={{backgroundColor: "rgba(158, 158, 158, 0.3)"}}
                 paddingY={4}
                 marginTop={3}
                 marginX={2}
                 rounded={"lg"}>
                <Heading size={"sm"} style={{textAlign: 'center'}}>ЭКРАН</Heading>
            </Box>
            <SeatsPicker/>
        </VStack>
    );
}