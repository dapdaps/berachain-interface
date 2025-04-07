import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 可以自定义错误UI
      return this.props.fallback || (
        <div className="error-boundary-fallback">
          <h2>出现了一些问题</h2>
          <details>
            <summary>查看错误详情</summary>
            <p>{this.state.error?.toString()}</p>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;