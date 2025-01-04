import { useSelector } from "react-redux";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <main className="p-3 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form
        //onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          {/* Name Field */}
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            //onChange={handleChange}
            //value={formData.name}
          />

          {/* Description Field */}
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg resize-none"
            id="description"
            rows="2"
            required
            // onChange={handleChange}
            // value={formData.description}
          />

          {/* Address Field */}
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            // onChange={handleChange}
            // value={formData.address}
          />

          {/* Property and Transaction Type */}
          <div className="flex flex-col gap-4">
            <label htmlFor="propertyType">Property Type</label>
            <select
              id="propertyType"
              className="border p-3 rounded-lg"
              required
              // onChange={handleChange}
              // value={formData.propertyType}
            >
              <option value="">Select Property Type</option>
              {[
                "Apartment",
                "House",
                "Studio",
                "Condo",
                "Villa",
                "Duplex",
                "Townhouse",
              ].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label htmlFor="transactionType-sale">Transaction Type</label>
            <div className="flex gap-4 flex-wrap">
              {["Full Sale", "Rent", "Lease", "Short-term", "Long-term"].map(
                (type) => (
                  <div key={type} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      id={type}
                      name="transactionType"
                      value={type}
                      required
                      // onChange={handleChange}
                      // checked={formData.transactionType === type}
                    />
                    <label htmlFor={type}>{type}</label>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Other Features */}
          <div className="flex gap-5 flex-wrap">
            {["parking spot", "furnished", "offer"].map((field) => (
              <div key={field} className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id={field}
                  // onChange={handleChange}
                  // checked={formData[field]}
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
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                // onChange={handleChange}
                // value={formData.bedrooms}
              />
              <label htmlFor="bedrooms">Bedrooms</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                // onChange={handleChange}
                // value={formData.bathrooms}
              />
              <label htmlFor="bathrooms">Bathrooms</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                // onChange={handleChange}
                // value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <label htmlFor="regularPrice">Regular Price</label>{" "}
                <span className="text-xs">($ / month)</span>
              </div>
            </div>{" "}
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                //max={formData.regularPrice}
                required
                className="p-3 border border-gray-300 rounded-lg"
                // onChange={handleChange}
                // value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <label htmlFor="discountPrice">Discount Price</label>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {/* {formData.offer && (
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
                <label htmlFor="discountPrice">Discount Price</label>
              </div>
            )} */}
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
              //onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              // onClick={handleImageSubmit}
              // disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-50"
            >
              {/* {uploading ? "Uploading..." : "Upload"} */}Upload
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {/* {imageUploadError && imageUploadError} */}jjjjjjjjj
          </p>
          {/* {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex items-center justify-between">
                <img
                  src={url}
                  alt="Listing"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700"
                >
                  Remove
                </button>
              </div>
            ))} */}
          <div
            //key={url}
            className="flex items-center justify-between"
          >
            <img
              //src={url}
              src=""
              alt="Listing"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <button
              type="button"
              //onClick={() => handleRemoveImage(index)}
              className="text-red-700"
            >
              Remove
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {/* {loading ? "Creating..." : "Create Listing"} */}Create Listing
          </button>
          {/* {error && <p className="text-red-700">{error}</p>} */}
        </div>
      </form>
    </main>
  );
}
