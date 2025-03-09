import { useState, useCallback } from 'react';
import useLoadingBlur from './UseLoading';

const BASE_URL = 'http://localhost:3000';


const useFetch = () => {
  const {useblur} = useLoadingBlur();
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint, method = 'GET', body = null) => {
      setError(null);

    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status} - ${response.statusText}`);
      }

      return await response.json(); // Retorna os dados ao invés de armazenar localmente
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      useblur(false);
    }
  }, []);

  return { error, fetchData };
};

export default useFetch;
