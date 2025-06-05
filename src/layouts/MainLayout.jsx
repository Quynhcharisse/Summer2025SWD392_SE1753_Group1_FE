import { Footer, Header } from "@organisms";
import { themeClasses } from '@theme/colors';
import PropTypes from 'prop-types';

export function MainLayout({ children }) {
  return (    <div className={`min-h-screen flex flex-col ${themeClasses.backgroundSurface} ${themeClasses.textPrimary}`}>
      <Header />
      <main className={`flex-1 container mx-auto p-4 ${themeClasses.backgroundSurface}`}>{children}</main>
      <Footer />
    </div>
  );
}

// Add prop types validation
MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
