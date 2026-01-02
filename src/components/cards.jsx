import { useEffect } from "react";


export default function Card({ pick = 0 }) {

    const deck = [
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,   
    ]

    // 0-12 heart, 13-25 diamond , 26-38 spade, 39-51 club

    let house = ''

    if (pick >= 0 && pick <= 12) {
        house = 'heart'
    } else if (pick >= 13 && pick <= 25) {
        house = 'diamond'
    } else if (pick >= 26 && pick <= 38) {
        house = 'spades'
    } else if (pick >= 39 && pick <= 51) {
        house = 'club'
    } else {
        house = 'unknown'
    }

    return (
       <>
        <h1>{deck[pick] ?? 'unknown'} of {house} </h1>
       </>
    );
}