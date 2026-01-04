import { useEffect } from "react";
import { deck } from "../data/deck";


export default function Card({ pick = 0 }) {

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

        <div className="w-50 h-80 py-8 px-6 m-10 bg-white text-black rounded-lg border-2 border-black ">
            <span className=" font-bold text-2xl mr-3">{deck[pick]}</span>
            {(house=== 'heart')&& <span className="font-bold text-2xl">♥</span>}
            {(house=== 'diamond')&& <span className="font-bold text-2xl">♦</span>}
            {(house=== 'spades')&& <span className="font-bold text-2xl">♠</span>}
            {(house=== 'club')&& <span className="font-bold text-2xl">♣</span>}
        </div>
        
       </>
    );
}