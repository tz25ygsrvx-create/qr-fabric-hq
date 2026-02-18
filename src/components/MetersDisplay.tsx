interface MetersDisplayProps {
  meters: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
};

const MetersDisplay = ({ meters, label, size = 'md' }: MetersDisplayProps) => {
  return (
    <div className="flex flex-col">
      {label && <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>}
      <span className={`font-mono font-bold ${sizeClasses[size]}`}>
        {meters.toFixed(2)} <span className="text-muted-foreground text-sm font-normal">m</span>
      </span>
    </div>
  );
};

export default MetersDisplay;
