import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

const BookingRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "bookings"),
      where("ownerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list = [];

      for (let docSnap of snapshot.docs) {
        const data = docSnap.data();
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

  const handleAccept = async (booking) => {
    // 1️⃣ Accept current booking
    await updateDoc(doc(db, "bookings", booking.id), {
      status: "accepted",
    });

    // 2️⃣ Mark room as booked
    await updateDoc(doc(db, "rooms", booking.roomId), {
      status: "booked",
    });

    // 3️⃣ Reject all other bookings for same room
    const q = query(
      collection(db, "bookings"),
      where("roomId", "==", booking.roomId),
      where("status", "==", "pending")
    );

    const snap = await getDocs(q);

    snap.forEach(async (d) => {
      await updateDoc(doc(db, "bookings", d.id), {
        status: "rejected",
      });
    });

    alert("Booking accepted & room booked!");
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, "bookings", id), {
      status: "rejected",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Booking Requests</h2>

      {requests.map((req) => (
        <div key={req.id} style={styles.card}>
          <h3>{req.roomTitle}</h3>
          <p><b>Seeker ID:</b> {req.seekerId}</p>
          <p><b>Status:</b> {req.status}</p>

          {req.status === "pending" && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => handleAccept(req)}>
                ✔ Accept
              </button>
              <button
                onClick={() => handleReject(req.id)}
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
