import { RollStatus } from '@/types/warehouse';

interface StatusBadgeProps {
  status: RollStatus;
  className?: string;
}

const statusConfig: Record<RollStatus, { label: string; className: string }> = {
  ACTIVE: { label: 'Aktyvus', className: 'status-active' },
  RESERVED: { label: 'Rezervuotas', className: 'status-reserved' },
  CONSUMED: { label: 'Sunaudotas', className: 'status-consumed' },
};

const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.className} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
