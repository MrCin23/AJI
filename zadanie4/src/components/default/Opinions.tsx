import React, { useEffect, useState } from 'react';
import axios from '../../api/Axios';

interface Opinion {
    user: string;
    rating: number;
    content: string;
    createdAt: string;
}

const Opinions: React.FC = () => {
    const [opinions, setOpinions] = useState<Opinion[]>([]);

    useEffect(() => {
        const fetchOpinions = async () => {
            try {
                const response = await axios.get<Opinion[]>('/opinions');
                setOpinions(response.data);
            } catch (err) {
                console.log('Nie udało się pobrać opini.');
            }
        };

        fetchOpinions();
    }, []);

    return (
        <div className="container">
            <h2 className="mb-4">Wszystkie opinie</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                    <thead className="table-dark text-center">
                    <tr className="align-middle">
                        <th>Nazwa użytkownika</th>
                        <th>Ocena</th>
                        <th>Treść</th>
                        <th>Data</th>
                    </tr>
                    </thead>
                    <tbody>
                    {opinions.map((opinion, index) => (
                        <tr key={index} className="align-middle">
                            <td className="text-center">{opinion.user}</td>
                            <td className="text-center">{opinion.rating} / 5</td>
                            <td>{opinion.content}</td>
                            <td className="text-center">
                                {new Date(opinion.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Opinions;
