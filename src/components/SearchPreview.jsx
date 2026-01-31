import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

const SearchPreview = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.bucket);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredResults = items.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.category?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower)
    );
  });

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-24 md:w-64">
      <div className="join w-full">
        <input
          type="text"
          placeholder="Search items..."
          className="input input-bordered join-item w-full"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => searchTerm.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <button className="btn btn-primary join-item">
          <Icon icon="mdi:magnify" width="20" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchTerm.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {filteredResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Icon
                icon="mdi:magnify-off"
                width="32"
                className="mx-auto mb-2"
              />
              <p>No items found</p>
            </div>
          ) : (
            <ul className="divide-y divide-base-300">
              {filteredResults.slice(0, 8).map((item) => (
                <li
                  key={item.id}
                  className="p-3 hover:bg-base-200 cursor-pointer transition-colors"
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={
                          item.imageBase64 || "https://via.placeholder.com/50"
                        }
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        📍 {item.location}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="mt-1">
                        <span className="badge badge-sm badge-primary">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
              {filteredResults.length > 8 && (
                <li className="p-3 text-center text-sm text-gray-500">
                  +{filteredResults.length - 8} more results
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPreview;
