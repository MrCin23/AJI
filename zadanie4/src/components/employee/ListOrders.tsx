import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import axios from '../../api/Axios';

interface Product {
    id: string;
    name: string;
    description: string;
    unit_price: number;
    unit_weight: number;
    category: Category;
}

interface Category {
    id: string;
    name: string;
}

interface OrderItem {
    product_id: number;
    quantity: number;
    product?: Product;
}

interface Order {
    id: number;
    username: string;
    email: string;
    phone_number: string;
    status: "UNAPPROVED" | "APPROVED" | "CANCELLED" | "COMPLETED";
    ordered_items: OrderItem[];
    total_value: number;
}

const ListOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('UNAPPROVED');

    const fetchOrders = async (status: string) => {
        try {
            let statusID;
            switch (status) {
                case "UNAPPROVED": statusID = 1; break;
                case "APPROVED": statusID = 2; break;
                case "CANCELLED": statusID = 3; break;
                case "COMPLETED": statusID = 4; break;
                default: throw new Error("unknown order status");
            }

            const response = await axios.get(`/orders/status/${statusID}`);

            const ordersWithProducts = await Promise.all(response.data.map(async (order: Order) => {
                const itemsWithProducts = await Promise.all(order.ordered_items.map(async (item) => {
                    const productResponse = await axios.get(`/products/${item.product_id}`);
                    return {
                        ...item,
                        product: productResponse.data,
                    };
                }));

                const totalValue = itemsWithProducts.reduce((sum, item) => {
                    return sum + (item.product?.unit_price || 0) * item.quantity;
                }, 0);

                return {
                    ...order,
                    ordered_items: itemsWithProducts,
                    total_value: totalValue,
                };
            }));

            setOrders(ordersWithProducts);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const changeOrderStatus = async (orderId: number, newStatus: "COMPLETED" | "CANCELLED") => {
        try {
            let statusID;
            switch (newStatus) {
                case "CANCELLED": statusID = 3; break;
                case "COMPLETED": statusID = 4; break;
                default: throw new Error("unknown order status");
            }
            await axios.patch(`/orders/${orderId}`, { status_id: statusID });
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        fetchOrders(statusFilter);
    }, [statusFilter]);

    return (
        <div className="container mt-5 vw-100 vh-100">
            <h2 className="mb-4 text-center">Orders</h2>

            <div className="mb-4">
                <label htmlFor="statusFilter" className="form-label me-2">Filter by Status:</label>
                <select
                    id="statusFilter"
                    className="form-select d-inline w-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="UNAPPROVED">Unapproved</option>
                    <option value="APPROVED">Approved</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                </select>
            </div>

            <table className="table table-hover table-bordered">
                <thead className="table-light">
                <tr>
                    <th scope="col">Order ID</th>
                    <th scope="col">Username</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone Number</th>
                    <th scope="col">Order Items</th>
                    <th scope="col">Total Value</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.username}</td>
                        <td>{order.email}</td>
                        <td>{order.phone_number}</td>
                        <td>
                            {order.ordered_items.map(item => (
                                <div key={item.product_id}>
                                    {item.product?.name} - {item.quantity} pcs @ {item.product?.unit_price} each
                                </div>
                            ))}
                        </td>
                        <td>${order.total_value.toFixed(2)}</td>
                        <td>
                            {statusFilter === "UNAPPROVED" && (
                                <div className="d-flex justify-content-around">
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => changeOrderStatus(order.id, "COMPLETED")}
                                        title="Mark as Completed"
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => changeOrderStatus(order.id, "CANCELLED")}
                                        title="Cancel Order"
                                    >
                                        <FontAwesomeIcon icon={faBan} />
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListOrders;
