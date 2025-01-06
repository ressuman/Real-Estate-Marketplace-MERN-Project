import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getUnitText, titleCase } from "../helper/unit";

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const params = useParams(); // Get listingId from URL params

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    title: "",
    description: "",
    address: "",
    propertyType: "",
    transactionType: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 500,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filePercentages, setFilePercentages] = useState(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Upload file to Cloudinary
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      const progressArray = Array.from(files).map(() => 0); // Initialize progress for each file
      setFilePercentages(progressArray);

      for (let i = 0; i < files.length; i++) {
        promises.push(
          storeImage(files[i], (progress) => {
            progressArray[i] = progress;
            setFilePercentages([...progressArray]); // Update progress state
          })
        );
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });

          // Clear progress after a short delay
          setTimeout(() => {
            setFilePercentages([]);
          }, 0);

          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Image upload failed. Ensure each image is under 2 MB."
          );
          setUploading(false);
          console.log(err);
        });
    } else {
      setImageUploadError(
        "You can only upload a maximum of 6 images per listing."
      );
      setUploading(false);
    }
  };

  const storeImage = async (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ressuman_upload_preset");
      formData.append("cloud_name", "dljydeppw");

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        "https://api.cloudinary.com/v1_1/dljydeppw/image/upload"
      );

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          onProgress(percentage);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } else {
          reject(new Error(`Upload failed: ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Failed to upload image. Please try again."));
      };

      xhr.send(formData);
    });
  };

  const handleRemoveImage = (index) => {
    // Remove the image URL from formData.imageUrls
    const updatedImageUrls = formData.imageUrls.filter((_, i) => i !== index);

    // Remove the corresponding progress value (if exists) from filePercentages
    const updatedFilePercentages = filePercentages.filter(
      (_, i) => i !== index
    );

    // Update the state
    setFormData({
      ...formData,
      imageUrls: updatedImageUrls,
    });

    setFilePercentages(updatedFilePercentages); // Ensure the progress bar data stays consistent
  };

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    // Convert numeric inputs to numbers
    if (type === "number") {
      setFormData({
        ...formData,
        [id]: Number(value), // Convert value to number
      });
      return;
    }

    // Handle radio buttons for transactionType
    if (
      value === "sale" ||
      value === "rent" ||
      value === "lease" ||
      value === "short-term" ||
      value === "long-term"
    ) {
      setFormData({
        ...formData,
        transactionType: value, // Use value instead of id
      });
      return;
    }

    // Handle checkboxes
    if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({
        ...formData,
        [id]: checked, // Update boolean values
      });
      return;
    }

    // Handle propertyType (select dropdown)
    if (id === "propertyType") {
      setFormData({
        ...formData,
        propertyType: value, // Update propertyType
      });
      return;
    }

    // Handle text and textarea inputs
    if (type === "text" || id === "description") {
      setFormData({
        ...formData,
        [id]: value, // Update other form fields
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (formData.imageUrls.length === 0) {
        setError("You must upload at least one image.");
        return;
      }

      if (formData.imageUrls.length > 6) {
        setError("You can upload a maximum of 6 images.");
        return;
      }

      if (!formData.title.trim()) {
        setError("Title is required.");
        return;
      }

      if (!formData.description.trim()) {
        setError("Description is required.");
        return;
      }

      if (!formData.address.trim()) {
        setError("Address is required.");
        return;
      }

      // Validate price fields
      if (Number(formData.regularPrice) < Number(formData.discountPrice)) {
        setError("Discount price must be lower than the regular price.");
        return;
      }

      if (!formData.propertyType) {
        return setError("Please select a valid property type.");
      }

      // If all validations pass, proceed
      setLoading(true);
      setError(false);

      // API call to create listing
      const res = await fetch(
        `/api/v1/listings/update-listing/${params.listingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        }
      );

      const data = await res.json();

      setLoading(false);

      // Handle non-2xx HTTP status codes
      if (!res.ok || data.success === false) {
        setError(data.message || "Failed to create listing. Please try again.");
        return;
      }

      // Navigate to the listing page if successful
      navigate(`/listing/${data.data._id}`);
    } catch (error) {
      // Catch unexpected errors
      console.error("Error creating listing:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;

        if (!listingId) {
          console.error("Listing ID is missing.");
          return;
        }

        const res = await fetch(`/api/v1/listings/get-listing/${listingId}`);

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error fetching listing: ${errorData.message}`);
          return;
        }

        const data = await res.json();

        if (data.success === false) {
          console.error(`Error fetching listing: ${data.message}`);
          return;
        }

        // Set form data if successful
        setFormData(data.data || {});
      } catch (error) {
        console.error(`Unexpected error fetching listing: ${error.message}`);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main className="p-3 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          {/* Title Field */}
          <input
            type="text"
            placeholder="Title"
            className="border p-3 rounded-lg"
            id="title"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.title}
          />

          {/* Description Field */}
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg resize-none"
            id="description"
            rows="2"
            required
            onChange={handleChange}
            value={formData.description}
          />

          {/* Address Field */}
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Property and Transaction Type */}
          <div className="flex flex-col gap-4">
            <label htmlFor="propertyType">Property Type</label>
            <select
              id="propertyType"
              className="border p-3 rounded-lg"
              required
              onChange={handleChange}
              value={formData.propertyType}
            >
              <option value="">Select Property Type</option>
              {[
                "apartment",
                "house",
                "studio",
                "condo",
                "villa",
                "duplex",
                "townhouse",
              ].map((type) => (
                <option key={type} value={type}>
                  {titleCase(type)}
                </option>
              ))}
            </select>

            <label htmlFor="transactionType-sale">Transaction Type</label>
            <div className="flex gap-4 flex-wrap">
              {[
                { label: "Full Sale", value: "sale" },
                { label: "Rent", value: "rent" },
                { label: "Lease", value: "lease" },
                { label: "Short-term", value: "short-term" },
                { label: "Long-term", value: "long-term" },
              ].map((type) => (
                <div key={type.value} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    id={type.value}
                    name="transactionType"
                    value={type.value}
                    required
                    onChange={handleChange}
                    checked={formData.transactionType === type.value}
                  />
                  <label htmlFor={type.value}>{type.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Other Features */}
          <div className="flex gap-5 flex-wrap">
            {["parking", "furnished", "offer"].map((field) => (
              <div key={field} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={field}
                  onChange={handleChange}
                  checked={formData[field]}
                />
                <label htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              </div>
            ))}
          </div>

          {/* Pricing Fields */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="50"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <label htmlFor="bedrooms">Bedrooms</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="50"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Bathrooms</label>
            </div>
            {/* Regular Price */}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="500"
                max="1000000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <label htmlFor="regularPrice">Regular Price</label>
                <span className="text-xs">
                  {getUnitText(formData.transactionType)}
                </span>
              </div>
            </div>
            {/* Discount Price */}
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max={formData.regularPrice}
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <label htmlFor="discountPrice">Discount Price</label>
                  <span className="text-xs">
                    {getUnitText(formData.transactionType)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 text-sm text-center">
              {imageUploadError}
            </p>
          )}

          {/* Upload Progress */}
          {filePercentages.length > 0 &&
            filePercentages.map((progress, index) => (
              <div key={index} className="flex items-center gap-2">
                <p className="text-sm">Image {index + 1}:</p>
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm">{progress}%</p>
              </div>
            ))}

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="Listing"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          {/* Submit Button */}
          <button
            disabled={loading || uploading}
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update listing"}
          </button>
          {error && <p className="text-red-700 text-sm text-center">{error}</p>}
        </div>
      </form>
    </main>
  );
}
