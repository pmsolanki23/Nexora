import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error for debugging/reporting
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-16 p-8 rounded-2xl bg-[#10151f] border border-[#aaff5a] shadow-lg text-center">
          <h2 className="text-3xl font-bold text-[#f8fafc] mb-4">
            Oops! Something went wrong.
          </h2>
          <p className="text-[#cbd5e1] mb-6">
            We apologize for the inconvenience. Our team has been notified.
          </p>

          <details
            className="bg-white p-4 rounded-lg border border-[#aaff5a]/40 shadow-inner text-left text-sm text-[#555] max-h-56 overflow-auto mb-6"
            open={false}
          >
            <summary className="cursor-pointer font-semibold mb-2">
              Error Details (click to expand)
            </summary>
            <pre className="whitespace-pre-wrap">
              {this.state.error?.toString()}
              {"\n"}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>

          <button
            onClick={this.resetError}
            className="px-6 py-3 bg-[#aaff5a] text-white font-semibold rounded-full shadow hover:bg-[#ff6f61] transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
