import { cn } from '../../utils/cn';

export function Card({ children, className = '', glass = false, ...props }) {
  return (
    <div
      className={cn(
        glass ? 'glass-card' : 'card',
        'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={cn(className)}>{children}</div>;
}
