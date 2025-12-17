import { api } from './api';

//get all URLs for current authenticated user
export const getUserUrls = async () => {
    const res = await api.get('/url/user');
    return res.data;
};

//create a short url
export const createShortUrl = async (originalUrl) => {
    const res = await api.post('/url/shorten', originalUrl);
    return res.data;
};

//delete by id
export const deleteUrl = async (id) => {
    const res = await api.delete('/url/delete/${id}');
    return res.data;
}