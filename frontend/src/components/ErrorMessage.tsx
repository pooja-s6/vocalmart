export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="btn secondary" type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
