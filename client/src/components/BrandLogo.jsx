export default function BrandLogo({ className = "" }) {
  return (
    <span
      aria-label="Sirhindi Solution"
      className={`brand-wordmark inline-flex flex-col items-center justify-center ${className}`}
    >
      <span className="brand-name">SIRHINDI</span>
      <span className="brand-signal" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </span>
  );
}
