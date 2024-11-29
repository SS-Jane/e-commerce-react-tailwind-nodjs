import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../config";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.apiPath + "/product/list");
      if (res.data.result !== undefined) {
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
          className="w-30"
          src={config.apiPath + "/uploads/" + item.img}
        />
      );
    } else {
      return (
        <img
          alt="default-image"
          className="w-30"
          src={config.apiPath + "/uploads/default-image.png"}
        />
      );
    }
  };

  return (
    <>
      <div>
        <div>Our products111</div>
        <div className="flex flex-col">
          {products.length > 0 ? 
            products.map((item) => {
              <div
                key={item.id}
                className="card card-compact bg-base-100 w-96 shadow-xl"
              >
                <figure>{showImage(item)}</figure>
                <div className="card-body">
                  <h2 className="card-title">{item.name}</h2>
                  <div>{item.price}</div>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>;
            })
           : (
            <></>
          )}
          
        </div>
      </div>
    </>
  );
}
