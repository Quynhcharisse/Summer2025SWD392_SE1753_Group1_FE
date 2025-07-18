import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@atoms';

/**
 * ErrorBoundary - A React error boundary component for catching and handling errors
 * 
 * Features:
 * - Catches JavaScript errors anywhere in the child component tree
 * - Logs error information for debugging
 * - Displays a fallback UI with error details
 * - Provides recovery actions (refresh, navigate home)
 * - Multiple display variants
 */
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
    // Log error information
//     console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { 
        variant = 'default',
        title = 'Oops! Something went wrong',
        message = 'We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.',
        showErrorDetails = false,
        showRetryButton = true,
        showRefreshButton = true,
        showHomeButton = true,
        className = ''
      } = this.props;

      const variantClasses = {
        default: 'bg-white border border-red-200',
        minimal: 'bg-red-50 border border-red-200',
        full: 'bg-gradient-to-br from-red-50 to-red-100 border border-red-200'
      };

      return (
        <div className={`rounded-lg p-8 text-center max-w-2xl mx-auto my-8 ${variantClasses[variant]} ${className}`}>
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {title}
          </h2>

          {/* Error Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Error Details (Development) */}
          {showErrorDetails && this.state.error && process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Error Details:</h3>
              <pre className="text-xs text-gray-600 overflow-auto max-h-32">
                {this.state.error.toString()}
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center flex-wrap">
            {showRetryButton && (
              <Button
                variant="primary"
                size="md"
                onClick={this.handleRetry}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            
            {showRefreshButton && (
              <Button
                variant="outline"
                size="md"
                onClick={this.handleRefresh}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            )}
            
            {showHomeButton && (
              <Button
                variant="outline"
                size="md"
                onClick={this.handleGoHome}
                className="flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  /** Child components to wrap */
  children: PropTypes.node.isRequired,
  /** Visual variant of the error display */
  variant: PropTypes.oneOf(['default', 'minimal', 'full']),
  /** Title to display when error occurs */
  title: PropTypes.string,
  /** Message to display when error occurs */
  message: PropTypes.string,
  /** Whether to show technical error details (development only) */
  showErrorDetails: PropTypes.bool,
  /** Whether to show retry button */
  showRetryButton: PropTypes.bool,
  /** Whether to show refresh page button */
  showRefreshButton: PropTypes.bool,
  /** Whether to show go home button */
  showHomeButton: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Callback function called when error occurs */
  onError: PropTypes.func
};

export default ErrorBoundary;
