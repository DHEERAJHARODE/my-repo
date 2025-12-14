import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const RoomDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      const snap = await getDoc(doc(db, "rooms", id));
      if (snap.exists()) {
        setRoom({ id: snap.id, ...snap.data() });
      }
    };

    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (!user) return;

    const checkRequest = async () => {
      const q = query(
        collection(db, "bookings"),
        where("roomId", "==", id),
        where("seekerId", "==", user.uid)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        setAlreadyRequested(true);
      }
    };

    checkRequest();
  }, [user, id]);

  const handleBooking = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      roomId: id,
      ownerId: room.ownerId,
      seekerId: user.uid,
      status: "pending",
      createdAt: new Date(),
    });

    setAlreadyRequested(true);
    alert("Booking request sent!");
  };

  if (!room) return <p>Loading...</p>;

  const isBooked = room.status === "booked";

  return (
    <div style={{ padding: "20px" }}>
      <h2>{room.title}</h2>
      <p><b>Rent:</b> ₹{room.rent}</p>
      <p><b>Location:</b> {room.location}</p>

      {isBooked && <p style={{ color: "red" }}>❌ Room already booked</p>}

      {!isBooked && user?.uid !== room.ownerId && (
        <button
          onClick={handleBooking}
          disabled={alreadyRequested}
        >
          {alreadyRequested ? "Request Sent" : "Request Booking"}
        </button>
      )}
    </div>
  );
};

export default RoomDetails;
