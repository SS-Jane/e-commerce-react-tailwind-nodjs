import PropTypes from "prop-types";
import Header from "../components/Header";
const DefaultLayout = ({ children }) => {
  DefaultLayout.propTypes = {
    children: PropTypes.node,
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default DefaultLayout;