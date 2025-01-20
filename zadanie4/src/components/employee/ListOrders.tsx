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

interface Status {
    name: "UNAPPROVED" | "APPROVED" | "CANCELLED" | "COMPLETED";
}

interface Opinion {
    rating: number;
    description: string;
}

interface Order {
    id: string;
    username: string
    email: string
    phone_number: number;
    status: Status;
    approval_date: string;
    ordered_items: Product[];
    opinion?: Opinion;
}

const ListOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    const fetchOrders = async (statusName: string) => {
        try {
            let asdf;
            switch (statusName) {
                case "UNAPPROVED":{
                    asdf = 1
                    break;
                }
                case "APPROVED": {
                    asdf = 2;
                    break;
                }
                case "CANCELLED":{
                    asdf = 3;
                    break;
                }
                case "COMPLETED":{
                    asdf = 4;
                    break;
                }
                default: {
                    throw new Error("unknown order status")
                }
            }
            const response = await axios.get(`/orders/status/${asdf}`);
            setOrders(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error while reading orders:', error);
        }
    };

    const fetchStatuses = async () => {
        try {
            const response = await axios.get('/status');
            setStatuses(response.data);
        } catch (error) {
            console.error('Error while reading order statuses:', error);
        }
    };

    const changeOrderStatus = async (orderId: string, newStatusName: string) => {
        try {
            await axios.patch(`/orders/${orderId}`, { status: newStatusName });
            setOrders(orders.filter(order => order.id !== orderId));
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
        const defaultStatus = statuses.find(status => status.name === 'APPROVED');
        if (defaultStatus) {
            setSelectedStatus(defaultStatus.name);
            fetchOrders(defaultStatus.name);
        }
    }, [statuses]);

    const isCompletedOrCancelled = statuses.some(status => {
        return (status.name === selectedStatus) && (status.name === 'COMPLETED' || status.name === 'CANCELLED');
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
                        <tr key={order.id} className="align-middle">
                            <td className="text-center">
                                {new Date(order.approval_date).toLocaleString()}
                            </td>
                            <td className="text-center">
                                {order.ordered_items.reduce((total, item) => total + (item.unit_price), 0).toFixed(2)} PLN
                            </td>
                            <td>
                                <ul>
                                    {order.ordered_items.map((item, index) => (
                                        <li key={index}>
                                            {item.name}
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
                                                <strong>Treść:</strong> {order.opinion.description}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-muted">Brak oceny</div>
                                    )}
                                </td>
                            ) : (
                                <td className="text-center">
                                    {selectedStatus === 'UNAPPROVED' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => changeOrderStatus(order.id, 'APPROVED')}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                                <span className="ms-2">Zatwierdź</span>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => changeOrderStatus(order.id, 'ANULOWANE')}
                                            >
                                                <FontAwesomeIcon icon={faBan} />
                                                <span className="ms-2">Anuluj</span>
                                            </button>
                                        </>
                                    )}
                                    {selectedStatus === 'APPROVED' && (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={() => changeOrderStatus(order.id, 'ZREALIZOWANE')}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                                <span className="ms-2">Zrealizowano</span>
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => changeOrderStatus(order.id, 'ANULOWANE')}
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
