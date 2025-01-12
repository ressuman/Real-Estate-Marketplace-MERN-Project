import { useNavigate } from "react-router-dom";
import { titleCase } from "../helper/unit";
import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  const [searchQuery, setSearchQuery] = useState({
    searchTerm: "",
    propertyType: "all",
    transactionType: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const handleChange = (e) => {
    const { id, name, value, checked } = e.target;

    setSearchQuery((prev) => {
      let updatedQuery = { ...prev };

      // Handle 'searchTerm'
      if (id === "searchTerm") {
        updatedQuery.searchTerm = value;
      }

      // Handle 'propertyType'
      if (id === "propertyType") {
        updatedQuery.propertyType = value;
      }

      // Handle 'transactionType' (radio buttons)
      if (name === "transactionType") {
        updatedQuery.transactionType = value;
      }

      // Handle 'amenities' (checkboxes for dynamic IDs)
      // Handle 'parking', 'furnished', and 'offer' (checkboxes)
      if (id === "parking" || id === "furnished" || id === "offer") {
        updatedQuery[id] = checked;
      }

      // Handle 'sort_order' (dropdown)
      if (id === "sort_order") {
        const [sort = "created_at", order = "desc"] = value.split("_");
        updatedQuery.sort = sort;
        updatedQuery.order = order;
      }

      return updatedQuery;
    });
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // Helper function to parse boolean values
    const parseBoolean = (value) => value === "true";

    // Extract URL parameters
    const searchTermFromUrl = urlParams.get("searchTerm") || "";
    const propertyTypeFromUrl = urlParams.get("propertyType") || "all";
    const transactionTypeFromUrl = urlParams.get("transactionType") || "all";
    const parkingFromUrl = parseBoolean(urlParams.get("parking"));
    const furnishedFromUrl = parseBoolean(urlParams.get("furnished"));
    const offerFromUrl = parseBoolean(urlParams.get("offer"));
    const sortFromUrl = urlParams.get("sort") || "created_at";
    const orderFromUrl = urlParams.get("order") || "desc";

    // Update the state if any URL parameter exists
    if (
      searchTermFromUrl ||
      propertyTypeFromUrl ||
      transactionTypeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSearchQuery({
        searchTerm: searchTermFromUrl,
        propertyType: propertyTypeFromUrl,
        transactionType: transactionTypeFromUrl,
        parking: parkingFromUrl,
        furnished: furnishedFromUrl,
        offer: offerFromUrl,
        sort: sortFromUrl,
        order: orderFromUrl,
      });
    }

    // Fetch listings
    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);

        const searchQuery = urlParams.toString();
        const response = await fetch(
          `/api/v1/listings/get-all-listings?${searchQuery}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status}`);
        }

        const data = await response.json();
        const res = data.data;

        setShowMore(res.length > 8);
        setListings(res);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();

    // Only add parameters to the URL if they are not default values
    if (searchQuery.searchTerm) {
      urlParams.set("searchTerm", searchQuery.searchTerm);
    }
    if (searchQuery.propertyType !== "all") {
      urlParams.set("propertyType", searchQuery.propertyType);
    }
    if (searchQuery.transactionType !== "all") {
      urlParams.set("transactionType", searchQuery.transactionType);
    }
    urlParams.set("parking", searchQuery.parking);
    urlParams.set("furnished", searchQuery.furnished);
    urlParams.set("offer", searchQuery.offer);
    urlParams.set("sort", searchQuery.sort);
    urlParams.set("order", searchQuery.order);

    const searchQueryParams = urlParams.toString();

    navigate(`/search?${searchQueryParams}`);
  };

  const onShowMoreClick = async () => {
    try {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;

      // Add startIndex to existing search parameters
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);

      const searchQuery = urlParams.toString();
      const response = await fetch(
        `/api/v1/listings/get-all-listings?${searchQuery}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch additional listings: ${response.status}`
        );
      }

      const data = await response.json();
      const newListings = data.data;

      // Update "Show More" button visibility based on returned results
      // Determine if "Show More" should remain visible
      setShowMore(newListings.length >= 9);

      // Append new listings to the existing list
      setListings((prevListings) => [...prevListings, ...newListings]);
    } catch (error) {
      console.error("Error fetching more listings:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen w-full md:w-[40%] lg:w-[30%]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Search Term */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={searchQuery.searchTerm || ""}
              onChange={handleChange}
            />
          </div>

          {/* Type Selection */}
          {/* Property Type */}
          <div className="flex flex-col gap-4 flex-wrap">
            <label htmlFor="propertyType" className="font-semibold">
              Property Type:
            </label>
            <select
              id="propertyType"
              className="border p-3 rounded-lg"
              value={searchQuery.propertyType || "all"}
              onChange={handleChange}
            >
              <option value="all">Select Type</option>
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
          </div>

          {/* Transaction Type */}
          <div className="flex flex-col gap-4 flex-wrap">
            <label htmlFor="transactionType" className="font-semibold">
              Transaction Type:
            </label>
            <div className="flex gap-4 flex-wrap">
              {[
                { label: "All", value: "all" },
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
                    onChange={handleChange}
                    checked={searchQuery.transactionType === type.value}
                  />
                  <label htmlFor={type.value}>{type.label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="amenities" className="font-semibold">
              Amenities:
            </label>
            {["parking", "furnished"].map((amenity) => (
              <div className="flex gap-2" key={amenity}>
                <input
                  type="checkbox"
                  id={amenity}
                  className="w-5"
                  onChange={handleChange}
                  checked={searchQuery[amenity] || false}
                />
                <span>{titleCase(amenity)}</span>
              </div>
            ))}
          </div>

          {/* Offer Section */}
          <div className="flex gap-2 flex-wrap items-center">
            <label htmlFor="offer" className="font-semibold">
              Offer:
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={searchQuery.offer || false}
              />
              <label htmlFor="offer">Show Only Listings with Offers</label>
            </div>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort_order" className="font-semibold">
              Sort:
            </label>
            <select
              id="sort_order"
              //defaultValue={"created_at_desc"}
              className="border rounded-lg p-3"
              onChange={handleChange}
              value={`${searchQuery.sort}_${searchQuery.order}`}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          >
            Search
          </button>
        </form>
      </div>

      {/* Listings Section */}
      <div className="w-full md:w-[60%] lg:w-[70%]">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && (!listings || listings.length === 0) && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              type="button"
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
