import { useEffect } from "react";


export default function Card(pick) {

    const deck = [
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,
        'A' , 'K' , `Q` , `J` , `10` , `9` , `8` , `7` , `6` , `5` , `4` , `3` , `2` ,   
    ]

    // 0-12 heart, 13-25 diamond , 26-38 spade, 39-51 club

    let house = ''
    pick = 15


    if(pick <= 12 && pick >= 0){
        house = 'heart'
    }
    else if(pick <=13 && pick <= 25){
        house = 'diamond'

    }
    else if(pick <=26 && pick <= 38){
        house = 'spades'

    }
    else if(pick <=39 && pick <= 51){
        house = 'club'

    }
    else{
        house = 'unknown of an error'
    }

    return (
       <>
        <h2>in card {deck[pick]} of {house} </h2>
       </>
    );
}