import { toast } from 'sonner';

const { useState, useEffect } = require('react');

const useFetch = (callBack) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fn = async(...args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await callBack(...args);
            setData(response);
            setError(null);
        } catch (err) {
            setError(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return {data, loading, error, fn, setData};
};

export default useFetch;