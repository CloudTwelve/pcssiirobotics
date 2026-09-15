import React from 'react';

export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Keep the app from crashing completely while still logging diagnostics.
    // eslint-disable-next-line no-console
    console.error('Application render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="page-hero not-found">
          <p className="eyebrow">System recovery</p>
          <h1>Something went wrong</h1>
          <p>The app recovered into safe mode. Reload to continue.</p>
          <button className="button primary" type="button" onClick={this.handleReload}>Reload site</button>
        </section>
      );
    }

    return this.props.children;
  }
}
