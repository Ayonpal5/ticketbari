import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-page"><h2>Something went wrong.</h2><p>Please refresh or try again later.</p></div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
