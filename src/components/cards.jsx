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
            className="absolute bg-white text-black rounded-lg border-2 border-black flex flex-col w-25 min-w-25 h-40 py-2 px-2 m-10 sm:w-50 sm:min-w-50 sm:h-80">
            <div>
                <span className=" font-bold  text -x1 mr-1 sm:text-4xl sm:mr-2 ">{deck[pick]}</span>
                {(pick >= 0 && pick <= 12) && <span className="font-bold sm:text-4xl text-red-600">♥</span>}
                {(pick >= 13 && pick <= 25) && <span className="font-bold sm:text-4xl text-red-600">♦</span>}
                {(pick >= 26 && pick <= 38) && <span className="font-bold sm:text-4xl">♠</span>}
                {(pick >= 39 && pick <= 51) && <span className="font-bold sm:text-4xl">♣</span>}
            </div>
            {(pick===11) && <img src="/jimbo.png" alt="Jimbo" className="w-15 h-20 rounded-lg mt-4 self-center"/> }

        </div>
        
       </>
    );
}