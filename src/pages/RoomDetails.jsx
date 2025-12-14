import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const RoomDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const snap = await getDoc(doc(db, "rooms", id));
      if (snap.exists()) {
        setRoom({ id: snap.id, ...snap.data() });
      }
    };

    fetchRoom();
  }, [id]);

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

    alert("Booking request sent!");
  };

  if (!room) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{room.title}</h2>
      <p><b>Rent:</b> ₹{room.rent}</p>
      <p><b>Location:</b> {room.location}</p>

      {user?.uid !== room.ownerId && (
        <button onClick={handleBooking}>Request Booking</button>
      )}
    </div>
  );
};

export default RoomDetails;
