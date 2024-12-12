import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";

import DefaultLayout from "./layout/DefaultLayout";
import PageTitle from "./components/PageTitle";
import Products from "./pages/Product";
import Loader from "./common/Loader.jsx";

function App() {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoader(false), 1000);
  }, []);

  return loader ? (
    <Loader />
  ) : (
    <CartProvider>
      <DefaultLayout>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Super Shopping page" />
                <Products />
              </>
            }
          />
        </Routes>
      </DefaultLayout>
    </CartProvider>
  );
}

export default App;
