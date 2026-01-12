import { useEffect } from "react";
import { deck } from "../data/deck";


export default function Card({ pick = 0 , zIndex }) {

    let offset = zIndex * 50

    return (
       <>

        <div 
            style={{
                zIndex,
                transform: `translateX(${offset}px)`
            }}
            className="absolute bg-white text-black rounded-lg border-2 border-black flex flex-col
                w-20 h-28 
                sm:w-25 sm:h-40 
                md:w-28 md:h-42 
                lg:w-32 lg:h-48 
                xl:w-36 xl:h-50 
                2xl:w-40 2xl:h-54 2xl:px-4 2xl:py-2
            ">
            <div className="flex items-start">
                <span className="font-bold text-sm px-2">{deck[pick]}</span>
                {(pick >= 0 && pick <= 12) && <span className="font-bold text-red-600">♥</span>}
                {(pick >= 13 && pick <= 25) && <span className="font-bold text-red-600">♦</span>}
                {(pick >= 26 && pick <= 38) && <span className="font-bold">♠</span>}
                {(pick >= 39 && pick <= 51) && <span className="font-bold">♣</span>}
            </div>
            {(pick===11) && <img src="/jimbo.png" alt="Jimbo" className="w-15 h-20 rounded-lg mt-4 self-center"/> }

        </div>
        
       </>
    );
}