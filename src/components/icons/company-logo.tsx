import { cn } from '@/lib/utils';

export function CompanyLogo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 100"
      className={cn('w-auto h-auto', className)}
      {...props}
    >
      <style>
        {`
          .logo-text-main { font-family: 'Arial', sans-serif; font-size: 28px; fill: white; font-weight: bold; letter-spacing: 2px; }
          .logo-text-sub { font-family: 'Arial', sans-serif; font-size: 14px; fill: #333; }
        `}
      </style>
      
      <g>
        {/* Blue Box with Main Text */}
        <rect x="50" y="5" width="200" height="40" fill="#0077c8" />
        <text x="150" y="32" textAnchor="middle" className="logo-text-main">
          A|L|I|R|U
        </text>

        {/* Subtitle Text */}
        <text x="150" y="60" textAnchor="middle" className="logo-text-sub">
          Refacciones para Remolques
        </text>

        {/* Trailer Silhouette */}
        <g fill="#000000" stroke="none">
          {/* Main flatbed */}
          <path d="M5 80 L295 80 L295 85 L5 85 Z" />
          <path d="M5 80 L15 75 L285 75 L295 80 Z" />
          
          {/* Vertical bars */}
          <path d="M20 75 L20 68 L25 68 L25 75 Z" />
          <path d="M45 75 L45 68 L50 68 L50 75 Z" />
          <path d="M70 75 L70 68 L75 68 L75 75 Z" />
          <path d="M95 75 L95 68 L100 68 L100 75 Z" />
          <path d="M120 75 L120 68 L125 68 L125 75 Z" />
          <path d="M145 75 L145 68 L150 68 L150 75 Z" />
          <path d="M170 75 L170 68 L175 68 L175 75 Z" />
          <path d="M225 75 L225 68 L230 68 L230 75 Z" />
          <path d="M250 75 L250 68 L255 68 L255 75 Z" />
          <path d="M275 75 L275 68 L280 68 L280 75 Z" />

          {/* Hitch */}
          <path d="M5 82.5 L-5 82.5 L-5 80 L0 80 Z" />
          
          {/* Wheel section */}
          <path d="M185 75 C 185 70, 190 70, 195 75 L220 75 C 225 70, 230 70, 230 75 Z" />
          
          {/* Wheels */}
          <circle cx="200" cy="90" r="7" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="200" cy="90" r="2" fill="black" />
          <circle cx="215" cy="90" r="7" fill="white" stroke="black" strokeWidth="2" />
          <circle cx="215" cy="90" r="2" fill="black" />
        </g>
      </g>
    </svg>
  );
}
