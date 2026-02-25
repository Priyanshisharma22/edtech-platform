
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  const removeFromCart = (courseId) => {
    const updatedCart = cartItems.filter((item) => item._id !== courseId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };


  const handlePayment = async () => {
    if (cartItems.length === 0) return alert("Your cart is empty");

    try {
      setProcessing(true);

      const bundleItem = {
        title: `Course Bundle (${cartItems.length} courses)`,
        price: Number(getTotalPrice()), // Ensure it's a number
      };

      // API call to backend
      const response = await api.post("/payment/create-checkout", {
        course: bundleItem,
      });

      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe
      }
    } catch (error) {
      console.error("Payment error details:", error.response?.data || error.message);
      alert("Payment Error: " + (error.response?.data?.error || "Check backend console"));
    } finally {
      setProcessing(false);
    }
  };
  const handleCheckout = () => {
    // Get existing enrolled courses from localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    
    // Add cart items to enrolled courses
    const updatedEnrolled = [...enrolledCourses, ...cartItems];
    localStorage.setItem("enrolledCourses", JSON.stringify(updatedEnrolled));
    
    // Clear the cart
    localStorage.setItem("cart", JSON.stringify([]));
    setCartItems([]);
    
    // Navigate to My Courses page
    navigate("/mycourses");
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0).toFixed(2);
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading cart...</h2>;
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Start adding courses to your cart!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p className="item-price">Price: ${item.price}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="total-price">
              <h2>Total: ${getTotalPrice()}</h2>
            </div>
            <div className="checkout-buttons">
              <button 
                className="checkout-btn payment-btn" 
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "💳 Pay with Stripe"}
              </button>
              <button 
                className="checkout-btn proceed-btn" 
                onClick={handleCheckout}
              >
                ⏭️ Skip & Continue to Courses
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
