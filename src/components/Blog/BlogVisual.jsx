import { BookOpen, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';

const CATEGORY_STYLES = {
  'Islamic Names': { from: '#DBEAFE', to: '#BFDBFE', text: '#1D4ED8', icon: BookOpen },
  'Islamic Naming Guides': { from: '#DBEAFE', to: '#BAE6FD', text: '#0369A1', icon: BookOpen },
  'Baby Naming Guides': { from: '#EFF6FF', to: '#E0F2FE', text: '#2563EB', icon: Clock },
  'Baby Name Lists': { from: '#F1F5F9', to: '#DBEAFE', text: '#1E40AF', icon: TrendingUp },
  'Christian Names': { from: '#DBEAFE', to: '#C7D2FE', text: '#3730A3', icon: BookOpen },
  'Hindu Names': { from: '#FEF3C7', to: '#DBEAFE', text: '#B45309', icon: BookOpen },
  default: { from: '#EFF6FF', to: '#E0F2FE', text: '#2563EB', icon: ArrowUpRight }
};

export function getInitials(title = '') {
  return title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('') || 'NV';
}

export function getCategoryStyle(category = '') {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.default;
}

export function BlogVisual({ title, category, compact = false }) {
  const style = getCategoryStyle(category);
  const Icon = style.icon;

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${compact ? 'h-36' : 'h-56'}`}
      style={{
        background: `radial-gradient(circle at 18% 18%, rgba(255,255,255,0.95) 0 10%, transparent 11%), linear-gradient(135deg, ${style.from}, ${style.to})`
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.12) 1px, transparent 1px), linear-gradient(45deg, rgba(15,23,42,0.10) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute -right-8 -bottom-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
      <div className="relative flex h-full items-center justify-between px-5">
        <Icon className="h-8 w-8" style={{ color: style.text }} />
        <span className="text-6xl font-black tracking-tight opacity-25" style={{ color: style.text }}>
          {getInitials(title)}
        </span>
      </div>
    </div>
  );
}
