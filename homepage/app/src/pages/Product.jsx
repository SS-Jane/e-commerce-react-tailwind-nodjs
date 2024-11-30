import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import Loader from "../common/Loader.jsx";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => setLoader(false), 1000);
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/product/list");
      if (res.data.results !== undefined) {
        setProducts(res.data.results);
      }
    } catch (error) {
      Swal.fire({
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const showImage = (item) => {
    if (item.img !== "") {
      return (
        <img
          alt="Product-image"
          className="h-full w-full object-cover"
          src={config.apiPath + "/uploads/" + item.img}
        />
      );
    } else {
      return (
        <img
          alt="default-image"
          className="h-full w-full object-cover"
          src={config.apiPath + "/uploads/default-image.png"}
        />
      );
    }
  };

  return  (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Products</h1>
        
        {loader ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                    {showImage(item)}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                    {item.name}
                  </h2>
                  <p className="text-xl font-bold text-primary">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </p>
                  <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
