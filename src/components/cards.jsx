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
            className="absolute hover:-translate-y-2 hover:-translate-x-0.5 transition-transform duration-150 bg-white text-black rounded-lg border-2 border-black flex flex-col justify-between
                w-20 h-28 
                sm:w-25 sm:h-40 
                md:w-28 md:h-42 
                lg:w-32 lg:h-48 
                xl:w-36 xl:h-50 
                2xl:w-40 2xl:h-54 2xl:px-4 2xl:py-2
                
            ">
            <div className="flex p-1 text-xs lg:text-lg">
                <span className="font-bold mr-1">{deck[pick]}</span>
                {(pick >= 0 && pick <= 12) && <span className="font-bold text-red-600">♥</span>}
                {(pick >= 13 && pick <= 25) && <span className="font-bold text-red-600">♦</span>}
                {(pick >= 26 && pick <= 38) && <span className="font-bold">♠</span>}
                {(pick >= 39 && pick <= 51) && <span className="font-bold">♣</span>}
            </div>
            {(pick===11) && <img src="/jimbo.png" alt="Jimbo" className="w-12 h-12 sm:h-20 sm:h sm:w-15 lg:h-25 lg:w-22 rounded-lg mt-4 self-center"/> }

            <div className="flex self-end rotate-180 p-1 text-xs lg:text-lg">
                <span className="font-bold mr-1">{deck[pick]}</span>
                {(pick >= 0 && pick <= 12) && <span className="font-bold text-red-600">♥</span>}
                {(pick >= 13 && pick <= 25) && <span className="font-bold text-red-600">♦</span>}
                {(pick >= 26 && pick <= 38) && <span className="font-bold">♠</span>}
                {(pick >= 39 && pick <= 51) && <span className="font-bold">♣</span>}
            </div>

        </div>
        
       </>
    );
}