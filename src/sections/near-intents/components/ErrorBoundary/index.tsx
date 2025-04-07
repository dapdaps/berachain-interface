import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  componentStack: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      componentStack: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 保存组件堆栈信息到状态
    this.setState({
      componentStack: errorInfo.componentStack
    });
    
    // 记录到控制台
    console.error('错误边界捕获到错误:', error);
    console.error('组件堆栈:', errorInfo.componentStack);
    
    // 可以发送到错误跟踪服务
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary-fallback" style={{ 
          padding: '20px', 
          margin: '10px', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          backgroundColor: '#f8d7da',
          color: '#721c24'
        }}>
          <h2>出现了一些问题</h2>
          <details>
            <summary>查看错误详情</summary>
            <p><strong>错误:</strong> {this.state.error?.toString()}</p>
            <p><strong>组件堆栈:</strong></p>
            <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
              {this.state.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;