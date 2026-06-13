'use client';

// global-error replaces the root layout when it throws, so it ships its own
// <html>/<body> and uses inline styles (the global stylesheet may not be loaded).
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body
                style={{
                    margin: 0,
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f7f6f3',
                    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
                    color: '#1a1a1a',
                    padding: '24px',
                }}
            >
                <div style={{ maxWidth: 480, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: '0 0 12px' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#6b6b6b', lineHeight: 1.6, margin: '0 0 28px' }}>
                        A critical error occurred. Please try again.
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            background: '#B89B5E',
                            color: '#fff',
                            border: 'none',
                            padding: '14px 28px',
                            borderRadius: 16,
                            fontSize: 13,
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
