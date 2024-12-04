import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useCart } from "../../context/CartContext";
import MyModal from "../MyModal";
import { useEffect, useState } from "react";

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const [sumQty, setSumQty] = useState(0);
  const [sumPrice, setSumPrice] = useState(0);

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
        <div className="text-center text-white text-lg">
        {sumQty} items in total. Total cost: {sumPrice.toFixed(2)} THB.
        </div>
      </MyModal>
    </div>
  );
};

export default Cart;
