import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react';
import { generateGeneralWhatsAppUrl } from '../../utils/formatters';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('KING DAY ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
            {/* Brand Logo & Icon */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-8 h-8 text-brand-yellow" />
              <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 rounded-full text-white">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 font-display">
                {this.props.fallbackTitle || 'Something went unexpected'}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {this.props.fallbackMessage ||
                  'The page encountered a temporary display issue. KING DAY storefront is still online and all items can be browsed directly via WhatsApp.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-purple hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full text-xs shadow-md transition-all min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={() => {
                  this.handleReset();
                  window.location.href = '/';
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-full text-xs shadow transition-all min-h-[44px]"
              >
                <Home className="w-4 h-4" />
                <span>Go to Homepage</span>
              </button>
            </div>

            {/* WhatsApp Assistance */}
            <div className="pt-4 border-t border-gray-100">
              <a
                href={generateGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Need help? WhatsApp Helpline: +91 9495902904</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
