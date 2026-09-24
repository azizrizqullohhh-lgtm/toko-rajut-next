'use client';

export default function PrintButton({ label = 'Cetak', className = '' }) {
  return (
    <button
      type="button"
      className={`btn btn-outline no-print ${className}`.trim()}
      onClick={() => window.print()}
    >
      🖨️ {label}
    </button>
  );
}
