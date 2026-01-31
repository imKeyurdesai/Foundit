import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../components/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setItems, setError } from "../store/slices/bucketSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.bucket);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        dispatch(setLoading(true));
        const q = query(collection(db, "bucket"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const lostItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        dispatch(setItems(lostItems));
      } catch (error) {
        console.error("Error fetching lost items:", error);
        dispatch(setError(error.message));
      }
    };

    fetchLostItems();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user || null);
    });

    return unsubscribe;
  }, []);

  const handleToggleFound = async (e, item) => {
    e.stopPropagation();
    try {
      const nextFound = !item.found;
      const itemRef = doc(db, "bucket", item.id);
      await updateDoc(itemRef, {
        found: nextFound,
        foundAt: nextFound ? new Date() : null,
      });

      dispatch(
        setItems(
          items.map((it) =>
            it.id === item.id ? { ...it, found: nextFound } : it,
          ),
        ),
      );
    } catch (error) {
      console.error("Error toggling found status:", error);
      dispatch(setError(error.message));
    }
  };

  const handleDelete = async (e, itemId) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, "bucket", itemId));
      dispatch(setItems(items.filter((item) => item.id !== itemId)));
    } catch (error) {
      console.error("Error deleting item:", error);
      dispatch(setError(error.message));
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading lost items...</div>;
  }

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📢 Lost Items</h1>

      {items.length === 0 ? (
        <p>No lost items reported yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-8">
          {items.map((item) => {
            const imgSrc =
              item.imageBase64 || "https://via.placeholder.com/400";

            return (
              <div
                key={item.id}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => navigate(`/item/${item.id}`)}
              >
                {/* Image */}
                <figure className="relative h-60 w-auto bg-yellow-300 overflow-hidden rounded-t-lg object-cover">
                  <img
                    src={imgSrc}
                    alt={item.title}
                    className="h-full w-full "
                  />
                </figure>

                {/* Content */}
                <div className="card-body space-y-2">
                  <h2 className="card-title text-lg font-semibold">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500">📍 {item.location}</p>

                  <p className="text-sm line-clamp-3">{item.description}</p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="badge badge-outline">{item.category}</span>

                    <button
                      className="btn btn-primary btn-sm hover:scale-110 duration-300 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/item/${item.id}`);
                      }}
                    >
                      View
                    </button>
                  </div>

                  {item.found && (
                    <div className="badge badge-success">Found</div>
                  )}

                  {currentUser?.uid === item.userId && (
                    <div className="flex gap-2 pt-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={(e) => handleToggleFound(e, item)}
                      >
                        {item.found ? "Mark as Unfound" : "Mark as Found"}
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={(e) => handleDelete(e, item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
