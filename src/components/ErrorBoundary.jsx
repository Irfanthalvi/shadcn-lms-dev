import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("🔴 ErrorBoundary caught:", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-8 shadow-xl space-y-6 text-center">
            {/* Icon */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertTriangle className="w-9 h-9" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                An unexpected error occurred in the application. This has been logged automatically.
              </p>
            </div>

            {/* Error Detail */}
            {this.state.error && (
              <div className="bg-muted/40 border border-border rounded-xl p-4 text-left">
                <p className="text-[11px] font-mono text-destructive/80 break-all line-clamp-4">
                  {this.state.error.message || String(this.state.error)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted/60 transition"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
