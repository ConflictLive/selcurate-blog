import { useState, type FormEvent } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const form = new FormData();
      form.append('email', email);

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center">
        <p className="text-lg font-semibold text-success mb-1">You're in!</p>
        <p className="text-sm text-foreground-muted">
          Check your inbox for a confirmation email.
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-primary via-accent to-primary animate-gradient overflow-hidden">
      <div className="rounded-2xl bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Get the weekly roundup
        </h3>
        <p className="text-sm text-foreground-muted mb-4">
          Top picks, price drops, and data-backed insights. No spam.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg bg-background border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-foreground-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
          {/* Honeypot — hidden from humans, bots fill it */}
          <input
            type="text"
            name="website"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {status === 'error' && (
          <p className="mt-2 text-sm text-danger">Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
