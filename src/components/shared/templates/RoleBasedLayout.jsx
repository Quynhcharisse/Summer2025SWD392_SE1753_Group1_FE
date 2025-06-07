import PropTypes from 'prop-types';
import { Footer, Header } from '@organisms';
import { themeClasses } from '@theme/colors';

const RoleBasedLayout = ({ children }) => {
  // This is a placeholder for future role-based layout logic
  // You can add role-based header/footer/sidebar here if needed
  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.backgroundSurface} ${themeClasses.textPrimary}`}>
      <Header />
      <main className={`flex-1 container mx-auto p-4 ${themeClasses.backgroundSurface}`}>{children}</main>
      <Footer />
    </div>
  );
};

RoleBasedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoleBasedLayout;
