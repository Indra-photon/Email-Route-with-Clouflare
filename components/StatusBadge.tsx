"use client";

interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'waiting' | 'resolved';
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const badges = {
    open: {
      icon: '🆕',
      label: 'Open',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    },
    in_progress: {
      icon: '🔄',
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    waiting: {
      icon: '⏸️',
      label: 'Waiting',
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    },
    resolved: {
      icon: '✅',
      label: 'Resolved',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    }
  };

  const badge = badges[status] || badges.open;
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${badge.className} ${sizeClass}`}>
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  );
}
