import { Component, type ReactNode } from "react";

/** A failed optional download must not unmount the active, unsaved editor. */
export default class FeatureBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <p className="error" role="alert">
          This view could not load. Your writing is still open. Return to Write;
          once recovery is saved, reconnect and reload to try again.
        </p>
      );
    return this.props.children;
  }
}
