import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { getTransactionUnit, titleCase } from "../helper/unit";
import {
  FaBath,
  FaBed,
  FaBuilding,
  FaCity,
  FaHome,
  FaHotel,
  FaWarehouse,
} from "react-icons/fa";

export default function ListingItem({ listing }) {
  // Fallback for listing data if incomplete
  const {
    _id,
    name = "No Title Available",
    address = "No Address Provided",
    description = "No Description Available",
    imageUrls = [],
    offer = false,
    discountPrice,
    regularPrice = 0,
    transactionType,
    propertyType,
    bedrooms = 0,
    bathrooms = 0,
  } = listing || {};

  const displayPrice = offer ? discountPrice : regularPrice;

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
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full md:w-[48%] lg:w-[31%] ">
      <Link
        to={_id ? `/listing/${_id}` : "#"}
        onClick={(e) => !_id && e.preventDefault()}
      >
        <img
          // src={
          //   imageUrls[0] ||
          //   "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          // }
          src={
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt={name}
          className="h-[320px] md:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-lg font-semibold text-slate-700">
            {name}
          </p>

          <div className="flex items-center gap-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm text-gray-600 truncate w-full">{address}</p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

          <div className="flex items-center gap-6 p-4 border rounded-lg shadow-md bg-white max-w-72">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full">
              {getPropertyIcon(propertyType)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600 uppercase">
                Property Type
              </span>
              <span className="text-sm text-gray-900">
                {titleCase(propertyType)}
              </span>
            </div>
          </div>

          <p className="text-slate-500 mt-2 font-semibold">
            ${displayPrice.toLocaleString("en-US")}
            {getTransactionUnit(transactionType)}
          </p>

          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xs flex gap-2">
              <FaBed className="text-lg" color="green" />
              {bedrooms > 1 ? `${bedrooms} bedrooms ` : `${bedrooms} bedroom `}
            </div>
            <div className="font-bold text-xs flex gap-2">
              <FaBath className="text-lg" color="green" />
              {bathrooms > 1
                ? `${bathrooms} bathrooms `
                : `${bathrooms} bathroom `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
