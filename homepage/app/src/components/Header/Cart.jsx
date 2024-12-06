import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "../../context/CartContext";
import MyModal from "../MyModal";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import config from "../../../config";
import Swal from "sweetalert2";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const [sumQty, setSumQty] = useState(0);
  const [sumPrice, setSumPrice] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [payDate, setPayDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [payTime, setPayTime] = useState("");

  useEffect(() => {
    computePriceAndQty();
  }, [cartItems]);

  const computePriceAndQty = () => {
    let sumQty = 0;
    let sumPrice = 0;

    cartItems.forEach((item) => {
      sumQty++;
      sumPrice +=
        typeof item.price === "number" ? item.price : parseFloat(item.price);
    });
    setSumPrice(sumPrice);
    setSumQty(sumQty);
  };

  const handleSave = async () => {
    try {
      const payload = {
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        payDate: payDate,
        payTime: payTime,
        cartItems: cartItems,
      };

      const res = await axios.post(config.apiPath + "/api/sale/save", payload);

      if (res.data.message === "success") {
        localStorage.removeItem("cartItems");

        Swal.fire({
          target: document.getElementById("modalCart"),
          title: "Save data",
          text: "Saved your data",
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        target: document.getElementById("modalCart"),
        title: "error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="text-primary">
      <button
        className="btn btn-outline text-primary"
        onClick={() => {
          document.getElementById("modalCart").showModal();
        }}
      >
        <FontAwesomeIcon icon={faCartShopping} />
        {cartItems.length}
        <span>pcs.</span>
      </button>

      <MyModal id="modalCart" title="My Cart">
        <table className="table table-zebra mt-3">
          <thead>
            <tr className="bg-primary text-white">
              <th className="text-lg">Name</th>
              <th className="text-end text-lg">Price(THB)</th>
              <th className="text-end text-lg">Qty.</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="text-lg">{item.name}</td>
                    <td className="text-end text-lg">
                      {typeof item.price === "number"
                        ? item.price.toFixed(2)
                        : item.price}
                    </td>
                    <td className="text-end text-lg">1</td>
                    <td className="text-center">
                      <button
                        onClick={(e) => removeFromCart(item.id)}
                        className="btn bg-red-500 text-white hover:bg-red-400"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              // <tr><td>havedata</td></tr>
              <tr>
                <td>Your cart is empty</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="container-sum text-center bg-gray-800 text-white py-4 rounded-lg shadow-md">
          <p className="text-xl font-semibold">
            {sumQty} items in total. Total cost: {sumPrice.toFixed(2)} THB.
          </p>
        </div>
        <div className="mt-3">
          <div className="alert alert-info">
            <div>Pleas transfer to :</div>
            <div>SCB Mr.ทวีสิน 000-999-5555</div>
          </div>
        </div>
        <div className="container-customer bg-gray-800 mt-6 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Customer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-white">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block font-medium text-white">Phone</label>
              <input
                type="number"
                placeholder="Enter phone number"
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium text-white">Address</label>
              <input
                type="text"
                placeholder="Enter address"
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block font-medium text-white">
                Transaction Date
              </label>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block font-medium text-white">
                Transaction Time
              </label>
              <input
                type="time"
                onChange={(e) => setPayTime(e.target.value)}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
          <div className="text-right mt-6">
            <button
              onClick={handleSave}
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faCheck} />
              Confirm
            </button>
          </div>
        </div>
      </MyModal>
    </div>
  );
};

export default Cart;
