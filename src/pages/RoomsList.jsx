import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const RoomsList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
      setRooms(list);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Rooms</h2>

      {rooms.length === 0 && <p>No rooms available yet.</p>}

      {rooms.map((room) => (
        <Link
          to={`/room/${room.id}`}
          style={{ textDecoration: "none", color: "black" }}
          key={room.id}
        >
          <div style={styles.card}>
            <h3>{room.title}</h3>
            <p>Rent: ₹{room.rent}</p>
            <p>Location: {room.location}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

export default RoomsList;
