import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setRole(docSnap.data().role);
      }

      setLoading(false);
    };

    fetchRole();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.email}</p>
      <p>Role: {role}</p>

      {role === "owner" && <OwnerDashboard />}
      {role === "room-seeker" && <SeekerDashboard />}
    </div>
  );
};

const OwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3>Owner Panel</h3>
      <p>Here you can add/manage your rooms.</p>

      <button onClick={() => navigate("/add-room")}>
        + Add New Room
      </button>

      <button onClick={() => navigate("/my-rooms")}>
        📂 My Rooms
      </button>

      <button onClick={() => navigate("/booking-requests")}>
        📩 Booking Requests
      </button>

    </div>
  );
};


const SeekerDashboard = () => (
  <div>
    <h3>Room Seeker Panel</h3>
    <p>Here you can browse and book rooms.</p>
  </div>
);

export default Dashboard;
