interface LoadingScreenProps { readonly message: string }
export function LoadingScreen({ message }: LoadingScreenProps) {
  return <main className="status-screen"><span className="loader" /><p>{message}</p></main>;
}

interface ErrorScreenProps { readonly title: string; readonly message: string; readonly actionLabel: string; onAction: () => void }
export function ErrorScreen({ title, message, actionLabel, onAction }: ErrorScreenProps) {
  return <main className="status-screen"><div className="error-mark">!</div><h1>{title}</h1><p>{message}</p><button className="primary" onClick={onAction}>{actionLabel}</button></main>;
}
