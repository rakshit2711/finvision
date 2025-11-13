import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

const Card = ({ children, className, title, subtitle, action }: CardProps) => {
  return (
    <div className={clsx(
      'bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm',
      className
    )}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-start">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
