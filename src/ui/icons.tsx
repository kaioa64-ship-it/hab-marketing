import React from 'react';

export type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const base = (props: IconProps) => ({
  width: props.size ?? 16,
  height: props.size ?? 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: props.strokeWidth ?? 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: props.className,
  'aria-hidden': true,
});

export const IconGrid: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </svg>
);

export const IconMegaphone: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1Z" />
    <path d="M16 8.5a6 6 0 0 1 0 7" />
    <path d="M19 6a10 10 0 0 1 0 12" />
  </svg>
);

export const IconPoster: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 7h8M8 11h5" />
    <path d="M8 17h8" />
  </svg>
);

export const IconCarousel: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <rect x="7" y="4" width="10" height="16" rx="2" />
    <path d="M3 7v14M21 7v14" opacity=".55" />
  </svg>
);

export const IconUsers: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1" />
    <path d="M17.5 14.5a5.5 5.5 0 0 1 3 5" />
  </svg>
);

export const IconSettings: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
  </svg>
);

export const IconShield: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const IconSparkles: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M12 3.5 13.7 9l5.3 1.7-5.3 1.8L12 18l-1.7-5.5L5 10.7 10.3 9 12 3.5Z" />
    <path d="M19 3v3M20.5 4.5h-3M5 17v3M6.5 18.5h-3" opacity=".65" />
  </svg>
);

export const IconHelp: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.6 9a2.5 2.5 0 1 1 3.9 2.1c-.9.6-1.5 1.1-1.5 2.4" />
    <path d="M12 17h.01" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const IconMenu: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconClose: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

export const IconDownload: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
);

export const IconPrint: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M7 8V3h10v5" />
    <rect x="4" y="8" width="16" height="8" rx="2" />
    <path d="M7 16h10v5H7z" />
  </svg>
);

export const IconShare: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <circle cx="18" cy="5" r="2.6" />
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="18" cy="19" r="2.6" />
    <path d="m8.3 10.8 7.4-4.4M8.3 13.2l7.4 4.4" />
  </svg>
);

export const IconBuilding: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" />
    <path d="M15 9h3a2 2 0 0 1 2 2v10" />
    <path d="M8 7h3M8 11h3M8 15h3M3 21h18" />
  </svg>
);

export const IconInfo: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

export const IconPalette: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M12 3a9 9 0 0 0 0 18h1.4a2 2 0 0 0 1.4-3.4 2 2 0 0 1 1.4-3.4H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3Z" />
    <circle cx="7.8" cy="10" r=".9" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="6.9" r=".9" fill="currentColor" stroke="none" />
    <circle cx="15" cy="7.6" r=".9" fill="currentColor" stroke="none" />
  </svg>
);

export const IconLink: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M10 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7L11.3 6.5" />
    <path d="M14 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.3-1.3" />
  </svg>
);

export const IconLock: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <rect x="4.5" y="10" width="15" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const IconEye: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const IconArrowUpRight: React.FC<IconProps> = (p) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const GabaritoLogoSvg: React.FC<{ className?: string; variant?: 'on-dark' | 'on-light' }> = ({
  className = 'h-10 w-auto',
  variant = 'on-light',
}) => {
  const isDark = variant === 'on-dark';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 64" fill="none" className={className} aria-label="Gabarito Pro">
      <rect x="4" y="4" width="56" height="56" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <path d="M12 20V12H20" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 12H52V20" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 44V52H20" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 52H52V44" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 24H25C22.7909 24 21 25.7909 21 28V36C21 38.2091 22.7909 40 25 40H39V32H31" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="42" cy="22" r="3" fill="#10B981" />
      <text x="74" y="25" fill={isDark ? '#94A3B8' : '#64748B'} fontFamily="system-ui, -apple-system, sans-serif" fontSize="11" fontWeight="800" letterSpacing="3">PLATAFORMA</text>
      <text x="72" y="49" fill={isDark ? '#FFFFFF' : '#0F172A'} fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="900" letterSpacing="-0.5">GABARITO</text>
      <rect x="224" y="31" width="44" height="20" rx="4" fill="#FACC15" />
      <text x="230" y="45" fill="#0F172A" fontFamily="monospace" fontSize="12" fontWeight="900">PRO</text>
    </svg>
  );
};

export const GabaritoIconSvg: React.FC<{ className?: string; size?: number }> = ({ className = 'h-8 w-8', size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    style={size ? { width: size, height: size } : undefined}
    aria-label="Gabarito Pro"
  >
    <rect x="4" y="4" width="56" height="56" rx="12" fill="#0F172A" stroke="#334155" strokeWidth="2" />
    <path d="M12 20V12H20" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
    <path d="M44 12H52V20" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 44V52H20" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
    <path d="M44 52H52V44" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
    <path d="M38 24H25C22.7909 24 21 25.7909 21 28V36C21 38.2091 22.7909 40 25 40H39V32H31" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="42" cy="22" r="3" fill="#10B981" />
  </svg>
);

