import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />

            <div className="ml-64">
                {/* Header */}
                {(title || subtitle) && (
                    <div className="bg-white border-b border-secondary-200 sticky top-0 z-10 shadow-sm">
                        <div className="px-8 py-6">
                            {title && <h1 className="text-3xl font-bold text-secondary-900">{title}</h1>}
                            {subtitle && <p className="text-secondary-600 mt-1">{subtitle}</p>}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
