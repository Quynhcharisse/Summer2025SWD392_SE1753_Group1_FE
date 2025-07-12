import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import BaseTemplate from './BaseTemplate';

const PageTemplate = ({ 
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  className = '',
  containerClassName = '',
  showHeader = false, // pass-through for opt-in
  showFooter = false, // pass-through for opt-in
  ...templateProps
}) => {  return (
    <BaseTemplate 
      {...templateProps} 
      className={className}
      showHeader={showHeader}
      showFooter={showFooter}
    >
      <div className={` ${containerClassName}`}>
        {/* Page Header */}        {(title || subtitle || breadcrumbs || actions) && (
          <div className="mb-6">
            {breadcrumbs && (
              <nav className="mb-4">
                {Array.isArray(breadcrumbs) ? (                  <ol className="flex items-center space-x-2 text-sm text-gray-600">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={`breadcrumb-${crumb.label}-${index}`} className="flex items-center">
                        {index > 0 && <span className="mx-2 text-gray-400">/</span>}{crumb.href ? (
                          <Link 
                            to={crumb.href} 
                            className="hover:text-blue-600 transition-colors"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="text-gray-900 font-medium">{crumb.label}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  breadcrumbs
                )}
              </nav>
            )}
            
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-lg text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
              
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </BaseTemplate>
  );
};

PageTemplate.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.node,
  actions: PropTypes.node,
  className: PropTypes.string,
  containerClassName: PropTypes.string
};

export default PageTemplate;
