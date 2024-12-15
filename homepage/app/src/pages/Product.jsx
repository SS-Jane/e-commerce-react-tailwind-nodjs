import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";
import Loader from "../common/Loader.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => setLoader(false), 1000);
  }, []);

  const fetchData = async (page = 1) => {
    try {
      const res = await axios.get(
        config.apiPath + `/product/list?page=${page}&pageSize=20`
      );
      if (res.data.results !== undefined) {
        setProducts(res.data.results);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.currentPage);
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

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  const handleAddToCart = (item) => {
    addToCart(item);
    Swal.fire({
      title: "Success!!",
      text: "Item added to cart",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  const handlePageChange = (page) => {
    fetchData(page);
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {loader ? (
        <div className="col-span-full flex justify-center items-center min-h-[400px]">
          <Loader />
        </div>
      ) : (
        <>
          {products.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <figure className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                  {showImage(item)}
                </figure>
              </div>
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {item.name}
                </h2>
                <p className="text-lg font-bold text-primary">
                  $
                  {typeof item.price === "number"
                    ? item.price.toFixed(2)
                    : item.price}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pagination col-span-full flex justify-center mt-6">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 mx-1 border rounded-md ${
                  currentPage === index + 1
                    ? "bg-primary text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
