import React from "react";
import { chakra, Text } from "@chakra-ui/react";
const CountDownTimer = ({ hoursMinSecs, setTimeLeft, calledFrom }) => {
    const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
    const [[hrs, mins, secs], setTime] = React.useState([
        hours,
        minutes,
        seconds,
    ]);

    const tick = () => {
        if (hrs === 0 && mins === 0 && secs === 0) setTimeLeft(0);
        else if (mins === 0 && secs === 0) {
            setTime([hrs - 1, 59, 59]);
        } else if (secs === 0) {
            setTime([hrs, mins - 1, 59]);
        } else {
            setTime([hrs, mins, secs - 1]);
        }
    };

    React.useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    });
    if (calledFrom == "options") {
        return (
            <Text display="inline" fontSize="lg">{`${hrs
                .toString()
                .padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs
                .toString()
                .padStart(2, "0")}`}</Text>
        );
    }
    return (
        <chakra.h3
            textAlign="center"
            fontSize={{ base: "2xl", md: "4xl" }}
            color="gray.800"
            fontWeight="600"
        >
            {`${hrs.toString().padStart(2, "0")}:${mins
                .toString()
                .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`}
        </chakra.h3>
    );
};

export default CountDownTimer;
