import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    const { children } = this.props;
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      
      try {
        // Check if it's our custom Firestore error
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = `Database Error: ${parsed.error} during ${parsed.operationType} operation.`;
            if (parsed.error.includes('insufficient permissions')) {
              errorMessage = "You don't have permission to perform this action. Please make sure you are signed in correctly.";
            }
          }
        }
      } catch (e) {
        // Not a JSON error, use default or raw message
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-6">
          <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-2xl max-w-lg w-full text-center">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
            <p className="text-black/60 mb-10 leading-relaxed font-medium">
              {errorMessage}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all"
            >
              <RefreshCcw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
