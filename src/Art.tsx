import type { Room } from "./story";
import { cast, type Character } from "./novel";
import { characterImages } from "./characters";
export function Portrait({person}:{person:Character}) {
  return <img className="character-portrait" src={characterImages[person]} alt={`Illustration av ${cast[person].name}`} decoding="async" draggable={false}/>;
}
export function Scene({
  room = "library",
  exterior = false,
}: {
  room?: Room;
  exterior?: boolean;
}) {
  return (
    <svg
      className="art"
      viewBox="0 0 1000 620"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wall" x2="0" y2="1">
          <stop stopColor="#182b3d" />
          <stop offset="1" stopColor="#393b38" />
        </linearGradient>
        <linearGradient id="floor" x2="0" y2="1">
          <stop stopColor="#342a24" />
          <stop offset="1" stopColor="#10151b" />
        </linearGradient>
        <radialGradient id="light">
          <stop stopColor="#efc779" stopOpacity=".45" />
          <stop offset="1" stopColor="#efc779" stopOpacity="0" />
        </radialGradient>
        <pattern id="rain" width="50" height="65" patternUnits="userSpaceOnUse">
          <path d="M24 0L8 35 M48 38L37 62" stroke="#a2b9cc" opacity=".18" />
        </pattern>
        <pattern
          id="books"
          width="91"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <rect width="91" height="100" fill="#141b23" />
          {[0, 15, 31, 49, 62, 77].map((x, i) => (
            <g key={x}>
              <rect
                x={x}
                y={8 + (i % 3) * 8}
                width={12 + (i % 2) * 3}
                height={79 - (i % 3) * 8}
                fill={["#695146", "#56605b", "#675c44"][i % 3]}
              />
              <path
                d={`M${x + 2} 26h8 M${x + 2} 70h8`}
                stroke="#baa276"
                opacity=".5"
              />
            </g>
          ))}
          <rect y="88" width="91" height="12" fill="#45362b" />
        </pattern>
      </defs>
      {exterior ? (
        <>
          <rect width="1000" height="620" fill="#102132" />
          <circle cx="742" cy="96" r="48" fill="#9aa9b0" opacity=".25" />
          {[30, 115, 880, 960].map((x) => (
            <path
              key={x}
              d={`M${x} 610V110 m0 30l-90 150 m90-95l65 120 m-65-40l-130 150 m130-70l110 110`}
              stroke="#0b151e"
              strokeWidth="18"
            />
          ))}
          <path
            d="M190 510V260L320 150 420 260V190L505 95 590 190V260L690 150 810 260V510Z"
            fill="#33383a"
            stroke="#647071"
            strokeWidth="3"
          />
          <path
            d="M155 260L320 128 427 260 M401 190L505 72 610 190 M583 260L690 128 845 260"
            fill="none"
            stroke="#141c24"
            strokeWidth="22"
          />
          {[245, 345, 455, 535, 645, 745].map((x, i) => (
            <g key={x}>
              <path
                d={`M${x} 340v-50q20-40 40 0v50z`}
                fill={i % 2 ? "#d0a768" : "#4a6474"}
              />
              <path
                d={`M${x + 20} 260v80 M${x} 308h40`}
                stroke="#252a2c"
                strokeWidth="4"
              />
              <rect x={x} y="375" width="40" height="65" fill="#74674d" />
            </g>
          ))}
          <path d="M465 510V420Q500 362 535 420V510" fill="#121b22" />
          <path d="M454 620L477 510H523L590 620" fill="#45515a" />
          <rect width="1000" height="620" fill="url(#rain)" className="rain" />
        </>
      ) : (
        <>
          <rect width="1000" height="620" fill="url(#wall)" />
          <path d="M0 427H1000V620H0Z" fill="url(#floor)" />
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={i}
              d={`M500 427L${i * 140 - 250} 620`}
              stroke="#817359"
              opacity=".14"
            />
          ))}
          <path d="M0 427H1000 M0 451H1000" stroke="#68533d" strokeWidth="8" />
          {[0, 170, 340, 510, 680, 850].map((x) => (
            <path
              key={x}
              d={`M${x} 0V425`}
              stroke="#b9a47a"
              opacity=".07"
              strokeWidth="3"
            />
          ))}
          {room === "library" ? (
            <>
              <rect
                x="25"
                y="72"
                width="385"
                height="354"
                fill="url(#books)"
                stroke="#5c4835"
                strokeWidth="15"
              />
              <path
                d="M685 285V111Q778 0 875 111V285Z"
                fill="#101f31"
                stroke="#635a43"
                strokeWidth="15"
              />
              <path
                d="M780 47V285 M690 160H872 M697 224H875"
                stroke="#5e624f"
                strokeWidth="7"
              />
              <path
                d="M693 221L775 212V285L692 291Z"
                fill="#57718a"
                opacity=".4"
              />
              <path
                d="M701 92L686 137 M734 120L712 185 M813 71L790 137 M849 179L830 237"
                stroke="#a2b9cc"
                opacity=".25"
              />
              <path d="M196 387L329 367 383 430 213 443Z" fill="#c7b587" />
              <path
                d="M222 396L310 382 M232 409L329 394"
                stroke="#736345"
                strokeWidth="3"
              />
              <path d="M475 370H795L832 413H444Z" fill="#74533a" />
              <path
                d="M470 414V531 M798 414V530"
                stroke="#32291f"
                strokeWidth="20"
              />
              <path
                d="M560 355Q605 340 649 355V383Q604 369 560 383Z"
                fill="#d5c394"
                stroke="#795e40"
                strokeWidth="2"
              />
              <path d="M605 351V375" stroke="#795e40" />
              <path
                d="M715 347V261 M676 280H753L736 232H692Z"
                stroke="#bd9d61"
                fill="#bfa368"
                strokeWidth="5"
              />
              <ellipse cx="718" cy="339" rx="150" ry="175" fill="url(#light)" />
              <path
                d="M258 538Q500 480 757 538L890 618H123Z"
                fill="#574446"
                opacity=".6"
              />
              <g transform="translate(444 461) rotate(-18)">
                <rect width="70" height="62" rx="8" fill="#79583b" />
                <circle cx="35" cy="29" r="24" fill="#c9b681" />
                <path
                  d="M35 12V30L48 34 M19 9L30 24 19 36 48 49"
                  stroke="#343c3d"
                  fill="none"
                  strokeWidth="2"
                />
              </g>
            </>
          ) : room === "hall" ? (
            <>
              <path
                d="M634 423V85Q759-5 884 85V423Z"
                fill="#3e322a"
                stroke="#71634b"
                strokeWidth="16"
              />
              <path
                d="M671 415V92Q759 25 847 92V415Z"
                fill="#242628"
                stroke="#63513c"
                strokeWidth="4"
              />
              <rect x="730" y="140" width="70" height="28" fill="#ae9667" />
              <text
                x="765"
                y="160"
                textAnchor="middle"
                fontSize="13"
                fill="#272b2b"
              >
                BIBLIOTEK
              </text>
              <circle cx="824" cy="281" r="8" fill="#b39561" />
              <rect
                x="131"
                y="127"
                width="287"
                height="190"
                fill="#67503a"
                stroke="#ae9164"
                strokeWidth="12"
              />
              {[165, 245, 325].map((x, i) => (
                <g key={x} transform={`rotate(${i * 5 - 5} ${x} 200)`}>
                  <rect x={x} y="156" width="68" height="116" fill="#cebc93" />
                  <path
                    d={`M${x + 12} 184h40 m-40 15h40 m-40 15h30 m-30 15h40`}
                    stroke="#786b52"
                    strokeWidth="3"
                  />
                </g>
              ))}
              <path d="M420 411H601V451H420Z" fill="#6b4a32" />
              <path
                d="M436 450V508 M587 450V508"
                stroke="#433329"
                strokeWidth="14"
              />
              <rect
                x="478"
                y="354"
                width="59"
                height="43"
                rx="6"
                fill="#202a2f"
              />
              <path
                d="M479 353Q507 326 537 354"
                stroke="#171e24"
                strokeWidth="12"
                fill="none"
              />
              <path
                d="M536 371Q568 391 535 420"
                stroke="#161d22"
                strokeWidth="4"
                fill="none"
              />
              <circle cx="510" cy="378" r="13" fill="#6b695b" />
              <ellipse cx="493" cy="138" rx="250" ry="210" fill="url(#light)" />
              <path d="M474 140H517L507 85H484Z" fill="#d7bc7d" />
              <path d="M496 0V86" stroke="#171e25" strokeWidth="4" />
            </>
          ) : (
            <>
              <rect
                x="60"
                y="95"
                width="238"
                height="214"
                fill="#897859"
                stroke="#4a3a2d"
                strokeWidth="15"
              />
              <path
                d="M78 225L145 154 209 183 274 116 M87 137L151 250 247 201"
                stroke="#504e3d"
                strokeWidth="3"
                fill="none"
              />
              <rect
                x="723"
                y="84"
                width="202"
                height="316"
                fill="url(#books)"
                stroke="#594536"
                strokeWidth="14"
              />
              <path d="M337 299H661L705 417H301Z" fill="#78553a" />
              <path
                d="M330 417V545 M672 417V545"
                stroke="#392c24"
                strokeWidth="25"
              />
              <rect
                x="471"
                y="319"
                width="123"
                height="73"
                fill="#d1bb88"
                transform="rotate(-8 532 354)"
              />
              <path
                d="M492 338H565 M492 352H554 M492 367H567"
                stroke="#766545"
                strokeWidth="3"
              />
              <path d="M340 267H402L389 218H353Z" fill="#d2b477" />
              <path d="M372 267V335" stroke="#c1a069" strokeWidth="5" />
              <ellipse cx="376" cy="280" rx="235" ry="224" fill="url(#light)" />
              <path
                d="M437 302V200Q496 157 555 200V302"
                fill="#403c37"
                stroke="#8a694a"
                strokeWidth="9"
              />
              <rect
                x="125"
                y="355"
                width="117"
                height="136"
                fill="#3a3029"
                stroke="#6d5139"
                strokeWidth="7"
              />
              <path
                d="M125 400H242 M125 445H242"
                stroke="#6d5139"
                strokeWidth="7"
              />
            </>
          )}
          <rect width="1000" height="620" fill="#08101b" opacity=".15" />
        </>
      )}
    </svg>
  );
}

