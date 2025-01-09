import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  FaBath,
  FaBed,
  FaBuilding,
  FaChair,
  FaCity,
  FaHome,
  FaHotel,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaWarehouse,
} from "react-icons/fa";
import { getTransactionUnit, titleCase } from "../helper/unit";
import Contact from "../components/Contact";

export default function Listing() {
  const { currentUser } = useSelector((state) => state.user);

  const params = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(
          `/api/v1/listings/get-listing/${params.listingId}`
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error fetching listing: ${errorData.message}`);
          setError(true);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (data.success === false) {
          console.error(`Error fetching listing: ${data.message}`);
          setError(true);
          setLoading(false);
          return;
        }

        // Set the listing data
        setListing(data.data || {}); // Use `data.data` to match your API response
        setLoading(false);
      } catch (error) {
        console.error(`Unexpected error fetching listing: ${error.message}`);
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        navigate("/");
      }, 4000); // Wait for 2 seconds before redirecting
    }
  }, [error, navigate]);

  const getPropertyIcon = (propertyType) => {
    switch (propertyType) {
      case "apartment":
        return <FaBuilding />;
      case "house":
        return <FaHome />;
      case "studio":
        return <FaWarehouse />;
      case "villa":
        return <FaHotel />;
      case "condo":
        return <FaCity />;
      default:
        return <FaBuilding />;
    }
  };

  return (
    <main>
      {loading && (
        <div className="flex justify-center items-center my-7">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-center my-7 text-2xl">Loading...</p>
        </div>
      )}
      {error && (
        <p className="text-center my-7 text-2xl text-red-500">
          Something went wrong! Redirecting to the homepage...
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          {/* Image Slider */}
          {listing?.imageUrls?.length > 0 ? (
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              navigation
              //spaceBetween={5}
              slidesPerView={1}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-center my-7 text-gray-500">
              No images available
            </p>
          )}

          {/* Copy Link */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                try {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                  alert("Clipboard feature not supported");
                  console.error("Failed to copy link:", err.message);
                }
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing?.title || "Listing title not available"} - $
              {listing?.offer
                ? listing.discountPrice?.toLocaleString("en-US") || "N/A"
                : listing.regularPrice?.toLocaleString("en-US") || "N/A"}{" "}
              {getTransactionUnit(listing?.transactionType)}
            </p>

            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address || "Address not available"}
            </p>

            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                For{" "}
                {titleCase(listing.transactionType) ||
                  "Transaction type not available"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  $
                  {(
                    +listing.regularPrice - +listing.discountPrice
                  ).toLocaleString("en-US")}{" "}
                  discount
                </p>
              )}
            </div>
            <div className="flex items-center gap-6 p-4 border rounded-lg shadow-md bg-white max-w-72">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
                {getPropertyIcon(listing?.propertyType)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-600 uppercase">
                  Property Type
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {titleCase(listing?.propertyType) || "Not Specified"}
                </span>
              </div>
            </div>

            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description || "No description available"}
            </p>

            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 md:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms ? (
                  <>
                    {listing.bedrooms}{" "}
                    {listing.bedrooms > 1 ? "Bedrooms" : "Bedroom"}
                  </>
                ) : (
                  "No bedrooms info"
                )}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms ? (
                  <>
                    {listing.bathrooms}{" "}
                    {listing.bathrooms > 1 ? "Bathrooms" : "Bathroom"}
                  </>
                ) : (
                  "No bathrooms info"
                )}
              </li>

              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking Spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Not Furnished"}
              </li>
            </ul>

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact Landlord
              </button>
            )}
            {contact && (
              <Contact listing={listing} onClose={() => setContact(false)} />
            )}
          </div>
        </div>
      )}
    </main>
  );
}
