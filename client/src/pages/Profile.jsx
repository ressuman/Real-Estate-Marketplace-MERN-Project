import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  //console.log(formData);

  // Upload file to Cloudinary
  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ressuman_upload_preset"); // Replace with your preset name
      formData.append("cloud_name", "dljydeppw"); // Replace with your Cloudinary cloud name

      // const response = await fetch(
      //   "https://api.cloudinary.com/v1_1/dljydeppw/image/upload",
      //   {
      //     method: "POST",
      //     body: formData,
      //   }
      // );

      // if (!response.ok) {
      //   throw new Error("Image upload failed");
      // }

      // const data = await response.json();
      // setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
      // setFilePercentage(100);
      // setFileUploadError(null);
      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        "https://api.cloudinary.com/v1_1/dljydeppw/image/upload"
      );

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setFilePercentage(percentage);
          //console.log(`Upload Progress: ${percentage}%`);
        }
      });

      // Handle success
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
          setFilePercentage(100);
          setFileUploadError(null);
          //console.log("Upload Complete: 100%");
        } else {
          setFileUploadError("Image upload failed.");
          console.log("Upload failed:", xhr.responseText);
        }
      };

      // Handle error
      xhr.onerror = () => {
        setFileUploadError("Failed to upload image. Please try again.");
        console.log("Failed to upload image:", xhr.statusText);
      };

      // Send the form data
      xhr.send(formData);
    } catch (error) {
      setFileUploadError("Failed to upload image. Please try again.");
      console.log("Failed to upload image:", error.message);
    }
  };

  useEffect(() => {
    if (file) {
      setFilePercentage(0); // Reset progress
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("Form submitted");
    dispatch(updateUserStart());
    //console.log("Loading state set to true");
    try {
      const response = await fetch(
        `/api/v1/user/update-user/${currentUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      //console.log("Data fetched successfully:", data);
      dispatch(updateUserSuccess({ data: data.data }));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    try {
      const response = await fetch(
        `/api/v1/user/delete-user/${currentUser._id}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    dispatch(signOutUserStart());
    try {
      const response = await fetch("/api/v1/auth/signout");
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  // const handleShowListings = async () => {
  //   setShowListingsError(false);
  //   try {
  //     const response = await fetch(`/api/user/listings/${currentUser._id}`);
  //     const data = await response.json();
  //     if (!data.success) throw new Error(data.message);

  //     setUserListings(data.listings);
  //   } catch (error) {
  //     setShowListingsError(true);
  //   }
  // };

  // const handleListingDelete = async (listingId) => {
  //   try {
  //     const response = await fetch(`/api/listing/delete/${listingId}`, { method: "DELETE" });
  //     const data = await response.json();
  //     if (!data.success) throw new Error(data.message);

  //     setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
  //   } catch (error) {
  //     console.error("Failed to delete listing:", error.message);
  //   }
  // };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          //onChange={handleFileChange}
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          //onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar || "/default-avatar.png"}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {(() => {
            if (fileUploadError) {
              return (
                <span className="text-red-700">
                  Error uploading image (image must be less than 5 MB)
                </span>
              );
            } else if (filePercentage > 0 && filePercentage < 100) {
              return (
                <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
              );
            } else if (filePercentage === 100) {
              return (
                <span className="text-green-700">
                  Image successfully uploaded!
                </span>
              );
            } else {
              return null;
              // return <span className="text-slate-500">No image selected.</span>;
            }
          })()}
        </p>

        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={handleChange}
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          //className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
          className={`bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 ${
            loading ? "cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5 ">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer hover:underline"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer hover:underline"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-5 text-center">{error || ""}</p>
      <p className="text-green-700 mt-5 text-center">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>
      <button
        // onClick={handleShowListings}
        className="text-green-700 w-full"
      >
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {/* {showListingsError && "Error showing listings"} */}
      </p>
      {/* {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls?.[0] || "/default-listing.png"}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}

// <div className="p-3 max-w-lg mx-auto">
//   <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
//   <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//     <input
//       type="file"
//       ref={fileRef}
//       hidden
//       accept="image/*"
//       onChange={(e) => setFile(e.target.files[0])}
//     />
//     <img
//       onClick={() => fileRef.current.click()}
//       src={formData.avatar || currentUser.avatar}
//       alt="profile"
//       className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
//     />
//     <p className="text-sm self-center">
//       {fileUploadError && (
//         <span className="text-red-700">{fileUploadError}</span>
//       )}
//       {filePerc > 0 && filePerc < 100 && (
//         <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
//       )}
//       {filePerc === 100 && (
//         <span className="text-green-700">Image successfully uploaded!</span>
//       )}
//     </p>
//     <input
//       type="text"
//       id="username"
//       defaultValue={currentUser.username}
//       onChange={handleChange}
//       className="border p-3 rounded-lg"
//       placeholder="Username"
//     />
//     <input
//       type="email"
//       id="email"
//       defaultValue={currentUser.email}
//       onChange={handleChange}
//       className="border p-3 rounded-lg"
//       placeholder="Email"
//     />
//     <input
//       type="password"
//       id="password"
//       onChange={handleChange}
//       className="border p-3 rounded-lg"
//       placeholder="Password"
//     />
//     <button
//       type="submit"
//       disabled={loading}
//       className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
//     >
//       {loading ? "Loading..." : "Update"}
//     </button>
//   </form>
// </div>;
