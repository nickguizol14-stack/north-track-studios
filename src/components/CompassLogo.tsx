export function CompassLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer ring */}
      <circle cx="50" cy="50" r="47" stroke="#c8a84e" strokeWidth="1.5" opacity="0.6" />
      <circle cx="50" cy="50" r="42" stroke="#c8a84e" strokeWidth="0.5" opacity="0.3" />

      {/* Cardinal tick marks */}
      {[0, 90, 180, 270].map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="6"
          x2="50"
          y2="14"
          stroke="#c8a84e"
          strokeWidth="1.5"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}

      {/* Minor tick marks */}
      {[45, 135, 225, 315].map((angle) => (
        <line
          key={angle}
          x1="50"
          y1="8"
          x2="50"
          y2="12"
          stroke="#c8a84e"
          strokeWidth="0.75"
          opacity="0.5"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}

      {/* North pointer — gold */}
      <polygon points="50,16 44,50 50,44 56,50" fill="#c8a84e" />

      {/* South pointer — dark */}
      <polygon points="50,84 44,50 50,56 56,50" fill="#3a3a3a" />

      {/* East pointer — muted gold */}
      <polygon points="84,50 50,44 56,50 50,56" fill="#a08535" opacity="0.5" />

      {/* West pointer — muted dark */}
      <polygon points="16,50 50,44 44,50 50,56" fill="#3a3a3a" opacity="0.5" />

      {/* Center dot */}
      <circle cx="50" cy="50" r="3" fill="#c8a84e" />
      <circle cx="50" cy="50" r="1.5" fill="#0a0a0a" />

      {/* N label */}
      <text
        x="50"
        y="30"
        textAnchor="middle"
        fill="#c8a84e"
        fontSize="7"
        fontFamily="monospace"
        fontWeight="bold"
      >
        N
      </text>
    </svg>
  );
}

export function CompassLogoLarge({ className = "" }: { className?: string }) {
  return (
    <svg
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer decorative rings */}
      <circle cx="160" cy="160" r="155" stroke="#c8a84e" strokeWidth="0.5" opacity="0.15" />
      <circle cx="160" cy="160" r="148" stroke="#c8a84e" strokeWidth="1" opacity="0.25" />
      <circle cx="160" cy="160" r="140" stroke="#c8a84e" strokeWidth="0.5" opacity="0.15" />

      {/* Rotating ring with dashes */}
      <circle
        cx="160"
        cy="160"
        r="135"
        stroke="#c8a84e"
        strokeWidth="0.5"
        strokeDasharray="4 8"
        opacity="0.3"
        className="compass-ring"
        style={{ transformOrigin: "160px 160px" }}
      />

      {/* Degree marks — every 10 degrees */}
      {Array.from({ length: 36 }, (_, i) => i * 10).map((angle) => (
        <line
          key={angle}
          x1="160"
          y1={angle % 90 === 0 ? "18" : angle % 30 === 0 ? "22" : "26"}
          x2="160"
          y2="32"
          stroke="#c8a84e"
          strokeWidth={angle % 90 === 0 ? "1.5" : "0.5"}
          opacity={angle % 90 === 0 ? "0.8" : "0.3"}
          transform={`rotate(${angle} 160 160)`}
        />
      ))}

      {/* Cardinal labels */}
      {(
        [
          { letter: "N", angle: 0 },
          { letter: "E", angle: 90 },
          { letter: "S", angle: 180 },
          { letter: "W", angle: 270 },
        ] as const
      ).map(({ letter, angle }) => (
        <text
          key={letter}
          x="160"
          y="50"
          textAnchor="middle"
          fill={letter === "N" ? "#c8a84e" : "#6b6b6b"}
          fontSize={letter === "N" ? "14" : "10"}
          fontFamily="monospace"
          fontWeight={letter === "N" ? "bold" : "normal"}
          transform={`rotate(${angle} 160 160)`}
        >
          {letter}
        </text>
      ))}

      {/* Inner geometric frame */}
      <rect
        x="90"
        y="90"
        width="140"
        height="140"
        stroke="#c8a84e"
        strokeWidth="0.5"
        opacity="0.1"
        fill="none"
        transform="rotate(45 160 160)"
      />

      {/* North pointer — gold, sharp */}
      <polygon points="160,55 148,160 160,145 172,160" fill="#c8a84e" />

      {/* South pointer */}
      <polygon points="160,265 148,160 160,175 172,160" fill="#2a2a2a" />

      {/* East pointer */}
      <polygon points="265,160 160,148 175,160 160,172" fill="#a08535" opacity="0.4" />

      {/* West pointer */}
      <polygon points="55,160 160,148 145,160 160,172" fill="#2a2a2a" opacity="0.4" />

      {/* Center mechanism */}
      <circle cx="160" cy="160" r="8" fill="#c8a84e" opacity="0.9" />
      <circle cx="160" cy="160" r="4" fill="#0a0a0a" />
      <circle cx="160" cy="160" r="2" fill="#c8a84e" opacity="0.6" />

      {/* Glow effect */}
      <circle cx="160" cy="160" r="60" fill="url(#centerGlow)" className="pulse-glow" />
      <defs>
        <radialGradient id="centerGlow">
          <stop offset="0%" stopColor="#c8a84e" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#c8a84e" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
