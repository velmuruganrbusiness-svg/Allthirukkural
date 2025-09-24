import { useState, useCallback, useEffect } from 'react';

const FAVORITES_KEY = 'thirukkural_favorites';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        try {
            const storedFavorites = localStorage.getItem(FAVORITES_KEY);
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error("Could not load favorites from localStorage", error);
        }
    }, []);

    const toggleFavorite = useCallback((kuralNumber: number) => {
        setFavorites(prevFavorites => {
            const newFavorites = prevFavorites.includes(kuralNumber)
                ? prevFavorites.filter(id => id !== kuralNumber)
                : [...prevFavorites, kuralNumber];
            
            try {
                localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
            } catch (error) {
                console.error("Could not save favorites to localStorage", error);
            }
            
            return newFavorites;
        });
    }, []);

    return { favorites, toggleFavorite };
};
