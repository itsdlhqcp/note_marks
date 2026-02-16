interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizes = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-lg" },
  lg: { icon: 48, text: "text-2xl" },
};

export default function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Bookmark body */}
        <path
          d="M6 2h14l6 6v20l-13-8-13 8V2z"
          fill="currentColor"
        />
        {/* Marker highlight - visible in both themes */}
        <path
          d="M8 11h10v1.5H8V11zm0 3.5h6v1.5H8v-1.5z"
          className="fill-zinc-400 dark:fill-zinc-500"
        />
      </svg>
      {showText && (
        <span className={`font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 ${textSize}`}>
          Note Marks
        </span>
      )}
    </div>
  );
}
