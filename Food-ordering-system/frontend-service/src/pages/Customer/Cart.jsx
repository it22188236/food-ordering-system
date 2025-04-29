import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../styles/Cart.css";

const Cart = () => {
  const [carts, setCarts] = useState([]);
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5021/api/cart`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          setCarts([result.data]);
          console.log(result.data);
        } else {
          toast.error("Error to fetching data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCart();
  }, []);

  // const total = carts
  //   .reduce((sum, item) => sum + item.price * item.quantity, 0)
  //   .toFixed(2);

  const removeItem = async (cartID) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5021/api/cart/${cartID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Cart is deleted.");
        console.log(result);
      } else {
        toast.error("Error to delete cart");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5021/api/order/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryAddress }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // toast.success("Order confirmed!");
        // setShowAddressInput(false);
        // setDeliveryAddress("");
        redirectToPayHere(result);
        console.log('Order result:',result);
      } else {
        toast.error("Checkout failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }
  };

  const redirectToPayHere = (order) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://www.payhere.lk/pay/checkout"; // PayHere endpoint
  
    const fields = {
      merchant_id: "YOUR_MERCHANT_ID",        // Replace with your PayHere Merchant ID
      return_url: "http://localhost:5173/payment-success", // After success
      cancel_url: "http://localhost:5173/payment-cancel",  // After cancel
      notify_url: "http://localhost:5041/api/payment/ipn", // IPN callback (your backend)
  
      order_id: order._id,
      // items: "Food Order",
      amount: order.totalPrice,
      currency: "LKR",
  
      email: order.email,
      phone: order.phone,
      address: order.deliveryAddress,
      city: "Colombo",
      country: "Sri Lanka",
    };
  
    for (const key in fields) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    }
  
    document.body.appendChild(form);
    form.submit();
  };
  
  

  // const checkOutOrder = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch("http://localhost:5021/api/order/checkout", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       toast.success("You order placed.");
  //       console.log(result);
  //     } else {
  //       toast.error("Order placed unsuccessful.");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div>
      <div className="cart-container">
        <h2 className="cart-title">🛒 Your Cart</h2>

        {Array.isArray(carts) && carts.length > 0 ? (
          carts.map((item) => (
            <div className="cart-item" key={item._id}>
              <div className="cart-item-info">
                {Array.isArray(item.items) &&
                  item.items.map((i, idx) => (
                    <div key={idx}>
                      <h3>{i.menu}</h3>
                      <p>Quantity: {i.quantity}</p>
                    </div>
                  ))}
                <p>Price: Rs.{item.totalPrice}/=</p>
                <button
                  className="cart-remove-button"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}

        {/* {carts.length > 0 && (
          <div className="cart-total">
      
            <button className="checkout-button" onClick={checkOutOrder}>
              Proceed to Checkout
            </button>
          </div>
        )} */}

        {carts.length > 0 && (
          <div className="cart-total">
            {!showAddressInput ? (
              <button
                className="checkout-button"
                onClick={() => setShowAddressInput(true)}
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="address-input-section">
                <input
                  type="text"
                  placeholder="Enter delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="address-input"
                />
                <button
                  className="confirm-button"
                  onClick={handleConfirmOrder}
                  // disabled={!deliveryAddress.trim()}
                >
                  Confirm Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
