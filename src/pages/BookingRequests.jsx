import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

const BookingRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) return;

    // fetch booking requests where ownerId == current owner
    const q = query(
      collection(db, "bookings"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list = [];

      for (let docSnap of snapshot.docs) {
        const data = docSnap.data();

        // fetch room details
        const roomSnap = await getDoc(doc(db, "rooms", data.roomId));

        list.push({
          id: docSnap.id,
          ...data,
          roomTitle: roomSnap.exists() ? roomSnap.data().title : "Unknown Room",
        });
      }

      setRequests(list);
    });

    return () => unsubscribe();
  }, [user]);

  const handleStatus = async (id, status) => {
    await updateDoc(doc(db, "bookings", id), {
      status,
    });
    alert(`Booking ${status}!`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Booking Requests</h2>

      {requests.length === 0 && <p>No booking requests yet.</p>}

      {requests.map((req) => (
        <div key={req.id} style={styles.card}>
          <h3>{req.roomTitle}</h3>
          <p><b>Seeker ID:</b> {req.seekerId}</p>
          <p><b>Status:</b> {req.status}</p>

          {req.status === "pending" && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleStatus(req.id, "accepted")}>
                ✔ Accept
              </button>

              <button
                onClick={() => handleStatus(req.id, "rejected")}
                style={{ background: "red", color: "#fff" }}
              >
                ✖ Reject
              </button>
            </div>
          )}
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
  },
};

export default BookingRequests;
