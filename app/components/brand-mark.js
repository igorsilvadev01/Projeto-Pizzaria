export default function BrandMark({ className = "" }) {
  return (
    <svg
      className={`brand-mark ${className}`.trim()}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M16 1.8c1.2 5-1.1 7.6-3.8 10.5-2.4 2.7-4.8 5.5-4.8 9 0 5.1 3.8 8.9 8.6 8.9 4.9 0 8.6-3.8 8.6-8.8 0-3.9-2-6.8-4.4-9.6-.1 3.1-1.3 5.2-3.4 6.6.5-5.8-.6-11-4.8-16.6Z"
      />
      <path
        fill="var(--paper)"
        d="M16 19.1c-1.7 2.1-3.2 3.5-3.2 5.4a3.2 3.2 0 0 0 6.4 0c0-1.8-1.1-3.5-3.2-5.4Z"
      />
      <circle cx="16" cy="25" r="1.05" fill="var(--orange)" />
    </svg>
  );
}
