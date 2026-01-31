import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import { Icon } from "@iconify/react";

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        setLoading(true);
        const itemRef = doc(db, "bucket", itemId);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          setItem({ id: itemSnap.id, ...itemSnap.data() });
        } else {
          setError("Item not found");
        }
      } catch (err) {
        console.error("Error fetching item:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetail();
    }
  }, [itemId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            width="64"
            className="mx-auto mb-4 text-error"
          />
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-lg mb-6">{error || "Item not found"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const imgSrc = item.imageBase64 || "https://via.placeholder.com/600";

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-ghost btn-sm mb-6"
        >
          <Icon icon="mdi:arrow-left" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex flex-col items-center">
            <figure className="w-full bg-yellow-300 rounded-lg overflow-hidden shadow-lg">
              <img
                src={imgSrc}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
            </figure>
            <div className="mt-4 text-sm text-gray-500">
              {item.imageName && <p>📁 {item.imageName}</p>}
              {item.imageType && <p>🖼️ {item.imageType}</p>}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold mb-2">{item.title}</h1>
              <div className="badge badge-lg badge-primary">
                {item.category}
              </div>
            </div>

            {/* Location */}
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="mdi:map-marker"
                    width="24"
                    className="text-error"
                  />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-lg">{item.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {item.description && (
              <div className="card bg-base-200">
                <div className="card-body">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon icon="mdi:text-box" />
                    Description
                  </h3>
                  <p className="text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="card bg-base-200">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <Icon icon="mdi:calendar" width="24" className="text-info" />
                  <div>
                    <h3 className="font-semibold">Reported On</h3>
                    <p className="text-lg">
                      {item.createdAt
                        ? new Date(
                            item.createdAt.toDate?.(),
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="btn btn-primary flex-1">
                <Icon icon="mdi:message" />
                Contact Owner
              </button>
              <button className="btn btn-outline flex-1">
                <Icon icon="mdi:share-variant" />
                Share
              </button>
            </div>

            {/* Item ID (for reference) */}
            <div className="text-xs text-gray-400 text-center pt-4">
              Item ID: {item.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
