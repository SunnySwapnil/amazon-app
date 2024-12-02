import { useState } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [order, setOrder] = useState({ orderId: '', item: '', customer: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders', order);
      setSuccessMessage('Order added successfully!');
      setOrder({ orderId: '', item: '', customer: '' });
    } catch (error) {
      alert('Error adding order: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Add Order</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="orderId"
          placeholder="Order ID"
          value={order.orderId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="item"
          placeholder="Item"
          value={order.item}
          onChange={handleChange}
          required
        />
        <div>
          <textarea
            type="text"
            name="customer"
            placeholder="Customer Details"
            value={order.customer}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit">Add Order</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default OrderForm;
