import React from 'react';
import { ChevronRightIcon } from './Icons';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse text-sm">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="inline-flex items-center">
                            {index > 0 && (
                                <ChevronRightIcon className="w-4 h-4 text-secondary-text mx-1" />
                            )}
                            {!isLast && item.onClick ? (
                                <button
                                    onClick={item.onClick}
                                    className="font-medium text-secondary-text hover:text-accent transition-colors"
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <span className={isLast ? "font-semibold text-primary-text" : "font-medium text-secondary-text"}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
