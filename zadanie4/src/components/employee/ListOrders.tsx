import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import axios from '../../api/Axios';

// Define types for the order, status, and opinion
interface Product {
    product: {
        name: string;
    };
    quantity: number;
    price: number;
}

interface Opinion {
    rating: number;
    content: string;
    createdAt: string;
}

interface Order {
    _id: string;
    confirmationDate: string;
    products: Product[];
    opinion?: Opinion;
}

interface Status {
    name: string;
}

const ListOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const fetchOrders = async (statusName: string) => {
        try {
            const response = await axios.get(`/orders/status/${statusName}`);
            setOrders(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania zamówień:', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('/status');
            setStatuses(response.data);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania statusów:', error);
        }
    };

    const changeOrderStatus = async (orderId: string, newStatusName: string) => {
        try {
            await axios.patch(`/orders/${orderId}`, { status: newStatusName });
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    useEffect(() => {
        if (selectedStatus) {
            fetchOrders(selectedStatus);
        }
    }, [selectedStatus]);

    useEffect(() => {
        const defaultStatus = statuses.find(status => status.name === 'ZATWIERDZONE');
        if (defaultStatus) {
            setSelectedStatus(defaultStatus.name);
            fetchOrders(defaultStatus.name);
        }
    }, [statuses]);

    const isCompletedOrCancelled = statuses.some(status => {
        return (status.name === selectedStatus) && (status.name === 'ZREALIZOWANE' || status.name === 'ANULOWANE');
    });

    return (
        <div className="container mt-4">
            <h2 className="my-4 text-center">Zamówienia ze statusem</h2>
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-center">
                    <select
                        className="form-select form-select-lg text-center fw-bold"
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        value={selectedStatus}
                        aria-label="Status Select"
                    >
                        {statuses
                            .map(status => (
                                <option key={status.name} value={status.name}>
                                    {status.name.charAt(0).toUpperCase() + status.name.slice(1).toLowerCase()}
                                </option>
                            ))}
                    </select>
                </div>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark text-center">
                    <tr className="align-middle">
                        <th>Data zatwierdzenia</th>
                        <th>Wartość</th>
                        <th>Lista towarów</th>
                        {isCompletedOrCancelled ? (
                            <th>Opinia</th>
                        ) : (
                            <th>Akcja</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order._id} className="align-middle">
                            <td className="text-center">
                                {new Date(order.confirmationDate).toLocaleString()}
                            </td>
                            <td className="text-center">
                                {order.products.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} PLN
                            </td>
                            <td>
                                <ul>
                                    {order.products.map((item, index) => (
                                        <li key={index}>
                                            {item.product.name} (x{item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            {isCompletedOrCancelled ? (
                                <td>
                                    {order.opinion ? (
                                        <>
                                            <div className="mb-2">
                                                <strong>Ocena:</strong> {order.opinion.rating} / 5
                                            </div>
                                            <div className="mb-2">
                                                <strong>Treść:</strong> {order.opinion.content}
                                            </div>
                                            <div className="mb-2">
                                                <strong>Data:</strong> {new Date(order.opinion.createdAt).toLocaleDateString()}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-muted">Brak oceny</div>
                                    )}
                                </td>
                            ) : (
                                <td className="text-center">
                                    {selectedStatus === 'NIEZATWIERDZONE' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => changeOrderStatus(order._id, 'ZATWIERDZONE')}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                                <span className="ms-2">Zatwierdź</span>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => changeOrderStatus(order._id, 'ANULOWANE')}
                                            >
                                                <FontAwesomeIcon icon={faBan} />
                                                <span className="ms-2">Anuluj</span>
                                            </button>
                                        </>
                                    )}
                                    {selectedStatus === 'ZATWIERDZONE' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => changeOrderStatus(order._id, 'ZREALIZOWANE')}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                                <span className="ms-2">Zrealizowano</span>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => changeOrderStatus(order._id, 'ANULOWANE')}
                                            >
                                                <FontAwesomeIcon icon={faBan} />
                                                <span className="ms-2">Anuluj</span>
                                            </button>
                                        </>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListOrders;
