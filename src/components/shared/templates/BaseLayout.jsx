import React from 'react';
import PropTypes from 'prop-types';
import { Header, Footer } from '@organisms';

const BaseLayout = ({ 
  children,
  showHeader = false,
  showFooter = false,
  headerProps = {},
  footerProps = {},
  className = ''
}) => {
  return (
    <div className={`min-h-screen flex flex-col theme-aware-bg theme-aware-text ${className}`}>
      {showHeader && <Header {...headerProps} />}
      <main className="flex-1 w-full theme-aware-bg">{children}</main>
      {showFooter && <Footer {...footerProps} />}
    </div>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showHeader: PropTypes.bool,
  showFooter: PropTypes.bool,
  headerProps: PropTypes.object,
  footerProps: PropTypes.object,
  className: PropTypes.string
};

export default BaseLayout;
