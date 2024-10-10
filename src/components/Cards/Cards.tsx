import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Cards.module.scss";

interface User {
  name: {
    first: string;
    last: string;
  };
  email: string;
  location: {
    city: string;
    country: string;
  };
  picture: {
    large: string;
  };
}

interface ApiResponse {
  results: User[];
}

const Cards = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<ApiResponse>("https://randomuser.me/api/?results=10");
        setUsers(response.data.results);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message || "Failed to fetch users");
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Random Users</h2>
      <div className={styles.cardsContainer}>
        {users.map((user) => (
          <div key={user.email} className={`${styles.card} ${styles[`card${users.indexOf(user) + 1}`]}`}>
            <img src={user.picture.large} alt="User" className={styles.cardImage} />
            <h3>{`${user.name.first} ${user.name.last}`}</h3>
            <p>Email: {user.email}</p>
            <p>Location: {`${user.location.city}, ${user.location.country}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Cards;
