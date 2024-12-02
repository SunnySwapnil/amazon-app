import { useState, useEffect } from 'react';
import axios from 'axios';

const DisputeCaseList = () => {
  const [disputes, setDisputes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newDispute, setNewDispute] = useState({
    reason: '',
    status: 'Open',
    linkedOrders: [],
    linkedReturns: [],
  });

  useEffect(() => {
    fetchDisputes();
    fetchOrders();
    fetchReturns();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/disputes');
      setDisputes(response.data);
    } catch (error) {
      alert('Error fetching disputes: ' + error.message);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      alert('Error fetching orders: ' + error.message);
    }
  };

  const fetchReturns = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/returns');
      setReturns(response.data);
    } catch (error) {
      alert('Error fetching returns: ' + error.message);
    }
  };

  const handleDisputeChange = (e) => {
    setNewDispute({ ...newDispute, [e.target.name]: e.target.value });
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/disputes', newDispute);
      fetchDisputes();
      setModalVisible(false);
      setNewDispute({
        reason: '',
        status: 'Open',
        linkedOrders: [],
        linkedReturns: [],
      });
    } catch (error) {
      alert('Error creating dispute: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Dispute Cases</h2>
      <button onClick={() => setModalVisible(true)}>Add Dispute</button>
      {modalVisible && (
        <div className="modal">
          <form onSubmit={handleDisputeSubmit}>
            <input
              type="text"
              name="reason"
              placeholder="Reason"
              value={newDispute.reason}
              onChange={handleDisputeChange}
              required
            />
            <select
              name="status"
              value={newDispute.status}
              onChange={handleDisputeChange}
            >
              <option value="Open">Open</option>
              <option value="Resolved">Resolved</option>
            </select>
            <h4>Link Orders</h4>
            {orders.map((order) => (
              <label key={order.id}>
                <input
                  type="checkbox"
                  value={order.id}
                  onChange={(e) =>
                    setNewDispute((prev) => ({
                      ...prev,
                      linkedOrders: e.target.checked
                        ? [...prev.linkedOrders, order.id]
                        : prev.linkedOrders.filter((id) => id !== order.id),
                    }))
                  }
                />
                {order.item} ({order.orderId})
              </label>
            ))}
            <h4>Link Returns</h4>
            {returns.map((ret) => (
              <label key={ret.id}>
                <input
                  type="checkbox"
                  value={ret.id}
                  onChange={(e) =>
                    setNewDispute((prev) => ({
                      ...prev,
                      linkedReturns: e.target.checked
                        ? [...prev.linkedReturns, ret.id]
                        : prev.linkedReturns.filter((id) => id !== ret.id),
                    }))
                  }
                />
                {ret.reason} (Order ID: {ret.orderId})
              </label>
            ))}
            <button type="submit">Create Dispute</button>
            <button type="button" onClick={() => setModalVisible(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      <ul>
        {disputes.map((dispute) => (
          <li key={dispute.id}>
            <strong>Reason:</strong> {dispute.reason} | <strong>Status:</strong>{' '}
            {dispute.status}
            <ul>
              <li>
                <strong>Linked Orders:</strong>{' '}
                {dispute.linked_orders.map((o) => o.item).join(', ')}
              </li>
              <li>
                <strong>Linked Returns:</strong>{' '}
                {dispute.linked_returns.map((r) => r.reason).join(', ')}
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisputeCaseList;
