// Ported from the SquadLogo concept — a controller silhouette with a
// crescent moon and a star spark, both colored by a gradient.
export default function Logo({ size = 40 }) {
  return (
    <div className="logo-badge" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <linearGradient id="controllerGrad" x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F59E0B" />
            <stop offset="0.5" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="moonGrad" x1="28" y1="4" x2="44" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE68A" />
            <stop offset="1" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* Crescent moon */}
        <path
          d="M38 6C33 8 29.5 13 29.5 19C29.5 25 33 30 38 32C32 32.5 26.5 28 26.5 20C26.5 12 32 6.5 38 6Z"
          fill="url(#moonGrad)"
          opacity="0.9"
        />
        {/* Star spark */}
        <path d="M41 4L42 7L45 8L42 9L41 12L40 9L37 8L40 7L41 4Z" fill="#FFFBEB" />
        {/* Controller body */}
        <path
          d="M12 18C7.5 18 4 21.5 4 26C4 30.5 7 38 12.5 38C15.5 38 17.5 35 20 33H28C30.5 33 32.5 38 35.5 38C41 38 44 30.5 44 26C44 21.5 40.5 18 36 18H12Z"
          fill="url(#controllerGrad)"
        />
        {/* D-pad */}
        <rect x="11" y="24" width="6" height="2" rx="1" fill="#18181B" opacity="0.7" />
        <rect x="13" y="22" width="2" height="6" rx="1" fill="#18181B" opacity="0.7" />
        {/* Action buttons */}
        <circle cx="34" cy="23" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="37" cy="25" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="31" cy="25" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="34" cy="27" r="1.5" fill="#FFFFFF" opacity="0.9" />
        <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" opacity="0.8" />
      </svg>
    </div>
  )
}
