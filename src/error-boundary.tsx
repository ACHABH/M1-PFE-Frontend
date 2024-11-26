import type { ChildrenProps } from "./types";
import { Component, ErrorInfo } from "react";

type State = {
  error: Error | null;
  errorInfo: ErrorInfo | null;
};

export default class ErrorBoundary extends Component<ChildrenProps, State> {
  constructor(props: ChildrenProps) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
  }

  render() {
    if (!this.state.error && !this.state.errorInfo) return this.props.children;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeContent: "center",
        }}
      >
        <pre>{JSON.stringify(this.state)}</pre>
      </div>
    );
  }
}
