interface EmptyStateProps { readonly message: string }
export function EmptyState({ message }: EmptyStateProps) {
  return <div className="empty"><span aria-hidden="true">♪</span><p>{message}</p></div>;
}
