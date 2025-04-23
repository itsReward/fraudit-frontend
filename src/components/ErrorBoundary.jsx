import React from 'react';
import Alert from '../components/common/Alert';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Error caught by boundary:", error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="p-4">
                    <Alert
                        variant="danger"
                        title="Something went wrong"
                        dismissible={false}
                    >
                        <div>
                            <p>An error occurred while loading this page. Please try refreshing or contact support if the problem persists.</p>
                            {this.state.error && (
                                <details className="mt-2 text-sm">
                                    <summary>Technical details (for support)</summary>
                                    <p className="mt-1">{this.state.error.toString()}</p>
                                    <pre className="mt-2 p-2 bg-secondary-100 rounded overflow-auto text-xs">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                                </details>
                            )}
                            <div className="mt-4">
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 mr-2"
                                >
                                    Go to Dashboard
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-secondary-200 text-secondary-800 px-4 py-2 rounded hover:bg-secondary-300"
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </Alert>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;