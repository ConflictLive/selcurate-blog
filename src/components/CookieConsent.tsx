import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setVisible(true);
    } else if (consent === 'accepted') {
      grantConsent();
    }
  }, []);

  const grantConsent = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    grantConsent();
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-4 sm:p-6 shadow-lg">
        <p className="text-sm text-foreground-muted mb-4">
          We use cookies for analytics to understand how visitors use our site.
          No personal data is sold or shared.{' '}
          <a href="/cookie-policy/" className="text-primary hover:text-primary-hover underline">
            Cookie Policy
          </a>
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm font-medium rounded-lg text-foreground-muted hover:text-foreground border border-border hover:border-border-hover transition-colors"
          >
            Reject
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
