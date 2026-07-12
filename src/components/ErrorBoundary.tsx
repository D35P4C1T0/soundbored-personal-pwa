import { Component, ReactNode } from 'react';

interface Props { readonly children: ReactNode }
interface State { readonly failed: boolean }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { failed: false };
  public static getDerivedStateFromError(): State { return { failed: true }; }
  public componentDidCatch(error: Error): void { console.error('Unhandled UI error', error); }
  public render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return <main className="status-screen"><div className="error-mark">!</div><h1>Something went wrong</h1><p>Reload the app to start fresh.</p><button className="primary" onClick={() => window.location.reload()}>Reload</button></main>;
  }
}
