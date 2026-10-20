import { useLayoutEffect, useRef, useState } from "react";
import { deck } from "../data/deck";

const suits = ['♥', '♦', '♠', '♣']

export const cardSize = 'w-20 h-28 sm:w-25 sm:h-40 md:w-28 md:h-42 lg:w-32 lg:h-48 xl:w-36 xl:h-50 2xl:w-40 2xl:h-54'

export function CardBack({ className = '', style }) {
    return (
        <div style={style} className={`absolute bg-red-800 rounded-lg border-2 border-black ${className}`}>
            <div className="absolute inset-1.5 rounded border-2 border-red-300/50" />
        </div>
    )
}

// written straight to CSS vars so mouse moves don't re-render
function tilt(e) {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty('--ry', `${x * 30}deg`)
    e.currentTarget.style.setProperty('--rx', `${-y * 30}deg`)
}

function resetTilt(e) {
    e.currentTarget.style.setProperty('--rx', '0deg')
    e.currentTarget.style.setProperty('--ry', '0deg')
}

export default function Card({ pick = 0 , zIndex, hidden = false, dealDelay = 0 }) {

    let offset = zIndex * 50
    const ref = useRef(null)
    // a card dealt face-down (the hole card) shouldn't flip on the way out of the deck
    const [dealtFaceDown] = useState(hidden)

    // fly out of the on-screen deck. Web Animations rather than CSS keyframes: a CSS
    // animation would start before this measurement and never see the offset
    useLayoutEffect(() => {
        const deckEl = document.getElementById('deck')
        if (!deckEl || matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const d = deckEl.getBoundingClientRect()
        const c = ref.current.getBoundingClientRect()
        const dx = d.left + d.width / 2 - (c.left + c.width / 2)
        const dy = d.top + d.height / 2 - (c.top + c.height / 2)
        const anim = ref.current.animate(
            [
                { translate: `${dx}px ${dy}px`, rotate: `y ${dealtFaceDown ? 0 : 180}deg` },
                { translate: '0px 0px', rotate: 'y 0deg' }
            ],
            { duration: 600, delay: dealDelay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
        )
        return () => anim.cancel()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps -- deal once, on mount

    const corner = (
        <>
            <span className="font-bold mr-1">{deck[pick]}</span>
            <span className={`font-bold ${pick < 26 ? 'text-red-600' : ''}`}>{suits[Math.floor(pick / 13)]}</span>
        </>
    )

    return (
        <div
            aria-label={hidden ? 'face-down card' : undefined}
            onPointerMove={tilt}
            onPointerLeave={resetTilt}
            style={{
                zIndex,
                transform: `translateX(${offset}px)`
            }}
            className={`absolute hover:-translate-y-3 hover:scale-110 transition-[translate,scale] duration-150 ${cardSize}`}>
            {/* deal animates this inner element: flipping the outer one would mirror its translateX fan-out offset */}
            <div
                ref={ref}
                className="relative w-full h-full animate-sway transform-3d transition-transform duration-400 ease-[cubic-bezier(0.2,1.3,0.4,1)]"
                style={{
                    animationDelay: `${-zIndex * 0.7}s`,
                    transform: `perspective(600px) rotateX(var(--rx, 0deg)) rotateY(calc(var(--ry, 0deg) + ${hidden ? 180 : 0}deg))`
                }}>

                <div aria-hidden={hidden} className="absolute inset-0 backface-hidden bg-white text-black rounded-lg border-2 border-black flex flex-col justify-between 2xl:px-4 2xl:py-2">
                    <div className="flex p-1 text-xs lg:text-lg">{corner}</div>

                    {/* K♥ (was index 11 before J/Q/K were reordered) */}
                    {(pick===12) && <img src="/jimbo.png" alt="Jimbo" className="w-12 h-12 sm:h-20 sm:w-15 lg:h-25 lg:w-22 rounded-lg mt-4 self-center"/> }

                    <div className="flex self-end rotate-180 p-1 text-xs lg:text-lg">{corner}</div>
                </div>

                <CardBack className="inset-0 backface-hidden rotate-y-180" />
            </div>
        </div>
    );
}
