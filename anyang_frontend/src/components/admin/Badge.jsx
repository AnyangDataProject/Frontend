import { TONE_CLASSES, TONE_RING_CLASSES, TONE_DOT_CLASSES } from './toneClasses';

export default function Badge({ tone = 'neutral', dot = false, icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${TONE_CLASSES[tone]} ${TONE_RING_CLASSES[tone]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT_CLASSES[tone]}`} />}
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
