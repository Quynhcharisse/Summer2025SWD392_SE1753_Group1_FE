import { Footer, Header } from "@organisms";
import { themeClasses } from '@theme/colors';
import PropTypes from 'prop-types';

const MainTemplate = ({ children }) => {
  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.backgroundSurface} ${themeClasses.textPrimary}`}>
      <Header />
      <main className={`flex-1 container mx-auto p-4 ${themeClasses.backgroundSurface}`}>{children}</main>
      <Footer />
    </div>
  );
};

MainTemplate.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainTemplate;
