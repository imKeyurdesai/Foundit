import React, { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../components/firebase";
import { Navigate } from "react-router-dom";

const Uploads = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!auth.currentUser) {
      setError("Please login first");
      return;
    }

    if (!title || !location || !category || !image) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const itemId = `${auth.currentUser.uid}_${Date.now()}`;

      const imageBase64 = await fileToBase64(image);

      await setDoc(doc(db, "bucket", itemId), {
        id: itemId,
        title,
        location,
        category,
        imageBase64,
        imageName: image.name,
        imageType: image.type,
        userId: auth.currentUser.uid,
        found: false,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setLocation("");
      setCategory("");
      setImage(null);

      setError("");
      Navigate("/dashboard");
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-base-100 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">📤 Report Lost Item</h2>

      {error && (
        <div className="alert font-bold alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item name"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Lost location"
          className="input input-bordered w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="select select-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Accessories">Accessories</option>
          <option value="Documents">Documents</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Item"}
        </button>
      </form>
    </div>
  );
};

export default Uploads;
