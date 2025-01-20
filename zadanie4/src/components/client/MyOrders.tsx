import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import axios from '../../api/Axios';

interface OrderProduct {
    product: {
        name: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    confirmationDate: string;
    status: string;
    products: OrderProduct[];
    opinion?: {
        rating: number;
        content: string;
        createdAt: string;
    };
}

interface OpinionForm {
    rating: string;
    content: string;
    createdAt: string;
}

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [opinionForm, setOpinionForm] = useState<OpinionForm>({
        rating: '',
        content: '',
        createdAt: new Date().toISOString().split('T')[0],
    });
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string>('');

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/orders/user/me');
            setOrders(response.data);
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania zamówień:', error);
        }
    };

    const addOpinion = async (orderId: string) => {
        setError('');
        const { rating, content, createdAt } = opinionForm;

        try {
            await axios.post(`/orders/${orderId}/opinions`, {
                rating,
                content,
                createdAt,
            });

            fetchOrders();
            setOpinionForm({ rating: '', content: '', createdAt: new Date().toISOString().split('T')[0] });
            setSelectedOrderId(null);
        } catch (error) {
            console.error('Wystąpił błąd podczas dodawania opinii:', error);
            setError('Nie udało się dodać opinii. Sprawdź, czy zamówienie spełnia wymagania.');
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
                        const isOpinionAllowed = ['ZREALIZOWANE', 'ANULOWANE'].includes(order.status);
                        const opinionExists = !!order.opinion;

                        return (
                            <tr key={order._id} className="align-middle">
                                <td className="text-center">
                                    {order.confirmationDate
                                        ? new Date(order.confirmationDate).toLocaleString()
                                        : 'Brak danych'}
                                </td>
                                <td className="text-center">
                                    {order.products
                                        .reduce((total, item) => total + item.price * item.quantity, 0)
                                        .toFixed(2)}{' '}
                                    PLN
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
                                <td className="text-center">
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                                </td>
                                <td className="text-center">
                                    {opinionExists ? (
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
                                    ) : isOpinionAllowed ? (
                                        selectedOrderId === order._id ? (
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    addOpinion(order._id);
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
                                                            value={opinionForm.content}
                                                            onChange={(e) =>
                                                                setOpinionForm({
                                                                    ...opinionForm,
                                                                    content: e.target.value,
                                                                })
                                                            }
                                                            required
                                                        />
                                                </div>
                                                <div className="mb-2">
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={opinionForm.createdAt}
                                                        onChange={(e) =>
                                                            setOpinionForm({
                                                                ...opinionForm,
                                                                createdAt: e.target.value,
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
                                                onClick={() => setSelectedOrderId(order._id)}
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
