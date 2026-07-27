"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Visas istället för innehållet om renderingen kraschar. */
  fallback?: ReactNode;
};

type State = { failed: boolean };

/**
 * Fångar fel från dekorativ WebGL-rendering.
 *
 * En trasig 3D-scen ska aldrig kunna släcka sidan runt omkring — utan en
 * gräns här bubblar ett fel från Canvas upp till Next.js felgräns, som byter
 * ut hela trädet mot "Application error". Scenen är enbart dekor, så vi
 * loggar felet och låter resten av sidan stå kvar.
 */
export class CanvasBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Dekorativ scen kunde inte renderas:", error, info);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
