import React from 'react';
import { LinkedinIcon } from './Icons';

const Footer: React.FC = () => {
    return (
        <footer className="w-full mt-12 py-6 border-t border-border-color text-center text-secondary-text text-sm">
            <p>This website is for educational purposes only. It does not track users and contains no ads.</p>
            <div className="mt-2 flex items-center justify-center space-x-2">
                <span>
                    Developed by <span className="font-semibold text-primary-text">Velmurugan Ramasamy - Software Engineer</span>
                </span>
                <a 
                    href="https://www.linkedin.com/in/velmurugan-ramasamy-53741725b/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="Velmurugan Ramasamy's LinkedIn Profile"
                    className="text-secondary-text hover:text-accent transition-colors"
                >
                    <LinkedinIcon className="w-5 h-5" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
