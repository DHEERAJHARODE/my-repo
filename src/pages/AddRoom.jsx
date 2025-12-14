import { useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "rooms"), {
        title,
        rent,
        location,
        ownerId: user.uid,
        createdAt: new Date(),
      });

      alert("Room added successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleAddRoom} style={styles.form}>
        <h2>Add New Room</h2>

        <input
          placeholder="Room Title"
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          placeholder="Rent Price"
          onChange={(e) => setRent(e.target.value)}
          required
        />

        <input
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <button disabled={loading} type="submit">
          {loading ? "Saving..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    width: "300px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
};

export default AddRoom;
