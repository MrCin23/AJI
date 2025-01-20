import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
    baseURL: '/api',
});

axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get('jwt');
    if (token) {
        config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            const refreshToken = Cookies.get('refreshToken');
            // console.log(refreshToken)
            if (refreshToken) {
                try {
                    const { data } = await axios.post('http://localhost:3000/users/new/token', { refreshToken });

                    if (data.token) {
                        Cookies.set('jwt', data.token, { expires: 1 / 24, secure: true });
                        error.config.headers['authorization'] = `Bearer ${data.token}`;
                        return axiosInstance(error.config);
                    }
                } catch (err) {
                    console.error('Error refreshing token', err);
                    Cookies.remove('jwt');
                    Cookies.remove('refreshToken');
                    window.location.href = '/login';
                }
            } else {
                console.log('No refresh token available');
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;