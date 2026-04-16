import { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  bestFor?: string;
  specs?: Record<string, string>;
  href?: string;
}

interface Props {
  products?: Product[];
  title?: string;
}

type SortKey = 'name' | 'price' | 'rating';

export default function ComparisonTable({ products = [], title = 'Compare Products' }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('rating');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...products].sort((a, b) => {
      const mul = sortAsc ? 1 : -1;
      if (sortKey === 'name') return mul * a.name.localeCompare(b.name);
      return mul * ((a[sortKey] ?? 0) - (b[sortKey] ?? 0));
    });
  }, [products, sortKey, sortAsc]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === 'name');
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-border overflow-hidden">
      <div className="bg-card px-4 py-3 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background-alt/50">
              {(['name', 'price', 'rating'] as SortKey[]).map((key) => (
                <th
                  key={key}
                  className="px-4 py-3 text-left font-medium text-foreground-muted cursor-pointer hover:text-foreground transition-colors select-none"
                  onClick={() => handleSort(key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-foreground-muted">Best For</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((product) => (
              <>
                <tr key={product.id} className="border-b border-border/50 hover:bg-card/50 transition-colors">
                  <td className="px-4 py-3">
                    {product.href ? (
                      <a href={product.href} className="font-medium text-foreground hover:text-primary transition-colors" rel="sponsored">
                        {product.name}
                      </a>
                    ) : (
                      <span className="font-medium text-foreground">{product.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">${product.price}</td>
                  <td className="px-4 py-3">
                    <span className="text-warning">{'★'.repeat(Math.round(product.rating))}</span>
                    <span className="text-foreground-muted ml-1">{product.rating}</span>
                    <span className="text-foreground-muted/60 ml-1">({product.reviewCount.toLocaleString()})</span>
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">{product.bestFor || '—'}</td>
                  <td className="px-4 py-3">
                    {product.specs && Object.keys(product.specs).length > 0 && (
                      <button
                        onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                        className="p-1 rounded hover:bg-white/5 transition-colors text-foreground-muted"
                        aria-label={expandedId === product.id ? 'Collapse specs' : 'Expand specs'}
                      >
                        {expandedId === product.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                  </td>
                </tr>
                {expandedId === product.id && product.specs && (
                  <tr key={`${product.id}-specs`}>
                    <td colSpan={5} className="px-4 py-3 bg-background-alt/30">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        {Object.entries(product.specs).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-foreground-muted">{key}: </span>
                            <span className="text-foreground font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
