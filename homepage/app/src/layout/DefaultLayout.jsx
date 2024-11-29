import PropTypes from "prop-types";
import Header from "../components/Header";

const DefaultLayout = ({ children }) => {
  DefaultLayout.propTypes = {
    children: PropTypes.object,
  };
  return (
    <div>
      <div className="flex h-screen">
        <Header />

        <main>
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DefaultLayout;
