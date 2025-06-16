'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export function useRecommendations() {
  const { auth } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/api/recommendations', {
          headers: {
            Authorization: `Bearer ${auth?.access_token}`,
          },
        });
        setRecommendations(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (auth?.access_token) {
      fetchRecommendations();
    }
  }, [auth]);

  return { recommendations, isLoading, error };
}