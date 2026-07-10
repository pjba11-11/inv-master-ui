interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message = 'Something went wrong.', onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full"
      style={{ background: 'var(--error-bg)' }}
    >
      <svg className="h-6 w-6 text-error" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    </div>
    <div>
      <p className="text-sm font-medium text-text-primary">{message}</p>
      <p className="text-xs text-text-muted mt-1">Check your connection and try again.</p>
    </div>
    {onRetry && (
      <button
        onClick={onRetry}
        className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors px-4 py-2 rounded-lg hover:bg-primary-500/10"
      >
        Try again
      </button>
    )}
  </div>
);
