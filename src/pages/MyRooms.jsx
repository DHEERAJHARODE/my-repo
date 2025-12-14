import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this room?")) return;

  try {
    await deleteDoc(doc(db, "rooms", id));
    alert("Room deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("There was an issue deleting the room. Please try again later.");
  }
};

const MyRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "rooms"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) =>
        list.push({ id: doc.id, ...doc.data() })
      );
      setRooms(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Rooms</h2>

      {loading && <p>Loading your rooms...</p>}

      {rooms.length === 0 && !loading && <p>No rooms added yet.</p>}

      {rooms.map((room) => (
        <div key={room.id} style={styles.card}>
          <h3>{room.title}</h3>
          <p>Rent: ₹{room.rent}</p>
          <p>Location: {room.location}</p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate(`/edit-room/${room.id}`)}>
              ✏️ Edit
            </button>

            <button
              onClick={() => handleDelete(room.id)}
              style={{ background: "red", color: "#fff" }}
            >
              🗑 Delete
            </button>
          </div>
        </div>
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

export default MyRooms;
