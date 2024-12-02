import { useState } from 'react';
import axios from 'axios';

const ReturnForm = () => {
  const [returnData, setReturnData] = useState({
    orderId: '',
    reason: '',
    tracking: '',
    originalOrder: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setReturnData({ ...returnData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/returns', returnData);
      setSuccessMessage('Return added successfully!');
      setReturnData({
        orderId: '',
        reason: '',
        tracking: '',
        originalOrder: '',
      });
    } catch (error) {
      alert('Error adding return: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Add Return</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="orderId"
            placeholder="Order ID"
            value={returnData.orderId}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="reason"
            placeholder="Reason"
            value={returnData.reason}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tracking"
            placeholder="Tracking"
            value={returnData.tracking}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="originalOrder"
            placeholder="Original Order"
            value={returnData.originalOrder}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Return</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default ReturnForm;
