type IconProps = { className?: string };

export function DoodleHeritage({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 21V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M12 9c-3 0-5-2-5-5 3 0 5 2 5 5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M12 9c3 0 5-2 5-5-3 0-5 2-5 5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M12 15c-2.4 0-4-1.4-4-3.6 2.4 0 4 1.4 4 3.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M12 15c2.4 0 4-1.4 4-3.6-2.4 0-4 1.4-4 3.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleMinimal({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" />
    </svg>
  );
}

export function DoodleFloral({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="7" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="17" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="7" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function DoodleModern({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 3l5 9-5 9-5-9 5-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7 12h10" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function DoodleAllure({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" fill="currentColor" />
    </svg>
  );
}

export function DoodleCustomize({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 20l1-4.2L15.8 5l3.2 3.2L8.2 19 4 20Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M13.6 6.6l3.2 3.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
