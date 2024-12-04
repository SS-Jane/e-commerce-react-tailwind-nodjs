import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cartItems } = useCart();
  return (
    <div className="text-primary">
      <button className="btn btn-outline text-primary">
        <FontAwesomeIcon icon={faCartShopping} />
        {cartItems.length}
        <span>pcs.</span>
      </button>
    </div>
  );
};

export default Cart;
