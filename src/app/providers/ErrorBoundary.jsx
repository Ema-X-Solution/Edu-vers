import React from 'react';
import Button from '@/shared/ui/Button';

/**
 * ErrorBoundary — catches any render-time JS errors in the subtree
 * and shows a friendly fallback UI instead of a blank white screen.
 *
 * Must be a class component (React's API requirement).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to an error tracking service (Sentry, etc.) in production
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-app p-8 text-center">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 max-w-md w-full shadow-sm">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-dark-blue mb-2">Something went wrong</h2>
            <p className="text-gray-text text-sm mb-6">
              An unexpected error occurred. Please try refreshing the page or contact support
              if the problem persists.
            </p>
            {import.meta.env.DEV && (
              <pre className="text-left text-xs bg-red-50 text-red-700 p-4 rounded-lg mb-6 overflow-auto max-h-32 border border-red-100">
                {this.state.error?.toString()}
              </pre>
            )}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" size="sm" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button size="sm" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
