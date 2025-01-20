import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
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

interface OpinionForm {
    rating: string;
    description: string;
}

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [opinionForm, setOpinionForm] = useState<OpinionForm>({
        rating: '',
        description: '',
    });
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders/user/me');
            setOrders(response.data);
        } catch (error) {
            console.error('Error while fetching orders:', error);
        }
    };

    const addOpinion = async (orderId: string) => {
        setError('');
        const { rating, description } = opinionForm;

        try {
            await axios.post(`/api/orders/${orderId}/opinions`, {
                rating,
                description
            });

            fetchOrders();
            setOpinionForm({ rating: '', description: ''});
            setSelectedOrderId(null);
        } catch (error) {
            console.error('Error while adding opinion:', error);
            setError('Error while adding opinion');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="my-4 text-center">Twoje Zamówienia i Opinie</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark text-center">
                    <tr className="align-middle">
                        <th>Data zatwierdzenia</th>
                        <th>Wartość</th>
                        <th>Lista towarów</th>
                        <th>Status</th>
                        <th>Opinia</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => {
                        const isOpinionAllowed = ['COMPLETED', 'CANCELLED'].includes(order.status.name);
                        const opinionExists = !!order.opinion;

                        return (
                            <tr key={order.id} className="align-middle">
                                <td className="text-center">
                                    {order.approval_date
                                        ? new Date(order.approval_date).toLocaleString()
                                        : 'Brak danych'}
                                </td>
                                <td className="text-center">
                                    {order.ordered_items
                                        .reduce((total, item) => total + item.unit_price, 0)
                                        .toFixed(2)}{' '}
                                    PLN
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
                                <td className="text-center">
                                    {order.status.name.slice(1).toLowerCase()}
                                </td>
                                <td className="text-center">
                                    {opinionExists ? (
                                        <>
                                            <div className="mb-2">
                                                <strong>Ocena:</strong> {order.opinion?.rating} / 5
                                            </div>
                                            <div className="mb-2">
                                                <strong>Treść:</strong> {order.opinion?.description}
                                            </div>
                                        </>
                                    ) : isOpinionAllowed ? (
                                        selectedOrderId === order.id ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    addOpinion(order.id);
                                                }}
                                            >
                                                <div className="mb-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="5"
                                                        placeholder="Ocena (1-5)"
                                                        className="form-control"
                                                        value={opinionForm.rating}
                                                        onChange={(e) =>
                                                            setOpinionForm({
                                                                ...opinionForm,
                                                                rating: e.target.value,
                                                            })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-2">
                                                        <textarea
                                                            placeholder="Treść opinii"
                                                            className="form-control"
                                                            value={opinionForm.rating}
                                                            onChange={(e) =>
                                                                setOpinionForm({
                                                                    ...opinionForm,
                                                                    description: e.target.value,
                                                                })
                                                            }
                                                            required
                                                        />
                                                </div>
                                                {error && <p className="text-danger">{error}</p>}
                                                <button type="submit" className="btn btn-primary btn-sm">
                                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                                    <span className="ms-2">Zapisz opinię</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm ms-2"
                                                    onClick={() => setSelectedOrderId(null)}
                                                >
                                                    Anuluj
                                                </button>
                                            </form>
                                        ) : (
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={() => setSelectedOrderId(order.id)}
                                            >
                                                <FontAwesomeIcon icon={faCommentDots} />
                                                <span className="ms-2">Dodaj opinię</span>
                                            </button>
                                        )
                                    ) : (
                                        <div className="text-muted">
                                            Aby dodać opinię, zamówienie musi być zrealizowane lub anulowane.
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyOrders;
