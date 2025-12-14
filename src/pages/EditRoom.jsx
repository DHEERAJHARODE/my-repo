import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      const snap = await getDoc(doc(db, "rooms", id));

      if (snap.exists()) {
        const data = snap.data();
        setTitle(data.title);
        setRent(data.rent);
        setLocation(data.location);
      }

      setLoading(false);
    };

    fetchRoom();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateDoc(doc(db, "rooms", id), {
      title,
      rent,
      location,
      updatedAt: new Date(),
    });

    alert("Room updated successfully!");
    navigate("/my-rooms");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <form onSubmit={handleUpdate} style={styles.form}>
        <h2>Edit Room</h2>

        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input value={rent} onChange={(e) => setRent(e.target.value)} required />
        <input value={location} onChange={(e) => setLocation(e.target.value)} required />

        <button type="submit">Update Room</button>
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

export default EditRoom;
