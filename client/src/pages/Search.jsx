import { useLocation, useNavigate } from "react-router-dom";
import { titleCase } from "../helper/unit";
import { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import { buildSearchParams } from "../helper/search";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showAll, setShowAll] = useState(false);

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

  // Handle form input changes
  const handleChange = (e) => {
    const { id, name, value, checked } = e.target;
    setSearchQuery((prev) => {
      const updated = { ...prev };
      if (id === "searchTerm") {
        updated.searchTerm = value;
      }
      if (id === "propertyType") {
        updated.propertyType = value;
      }
      if (name === "transactionType") {
        updated.transactionType = value;
      }
      if (["parking", "furnished", "offer"].includes(id)) {
        updated[id] = checked;
      }
      if (id === "sort_order") {
        const [sort = "createdAt", order = "desc"] = value.split("_");
        updated.sort = sort;
        updated.order = order;
      }
      return updated;
    });
  };

  // Update URL when searchQuery changes
  useEffect(() => {
    const params = buildSearchParams(searchQuery);

    navigate(`/search?${params}`, { replace: true });
  }, [searchQuery, navigate]);

  // Fetch listings on location.search change
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const limit = showAll ? 10000 : 9;
        const queryParams = `${location.search}&limit=${limit}`;

        const response = await fetch(
          `/api/v1/listings/get-all-listings${queryParams}`
        );
        const data = await response.json();

        if (data.success) {
          setListings(data.data);
          //setTotalCount(data.meta?.total || 0);
          //setShowMore(data.meta?.remaining > 0);
          setTotalCount(data.count?.total || 0);
          setShowMore(!showAll && data.count?.remaining > 0);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search, showAll]);

  // Manual submit
  const handleSubmit = (e) => {
    e.preventDefault();

    setShowAll(false); // reset showAll state

    const query = buildSearchParams(searchQuery);
    navigate(`/search?${query}`);
  };

  // Show More Listings
  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const limit = 9;
    const params = buildSearchParams(searchQuery, { startIndex, limit });

    const response = await fetch(`/api/v1/listings/get-all-listings?${params}`);
    const data = await response.json();

    if (data.success) {
      setListings((prev) => [...prev, ...data.data]);
      setShowMore(data.count?.remaining > 0);
      setTotalCount(data.count?.total || 0);
    }
  };

  // const onShowAllClick = () => {
  //   setShowAll(true);
  // };
  // Add onShowAllClick function
  const onShowAllClick = async () => {
    const params = buildSearchParams(searchQuery, { limit: 10000 });

    const response = await fetch(`/api/v1/listings/get-all-listings?${params}`);
    const data = await response.json();

    if (data.success) {
      setListings(data.data);
      setTotalCount(data.count?.total || 0);
      setShowMore(false);
      setShowAll(true);
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
              //value={searchQuery.searchTerm}
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
              //value={searchQuery.propertyType}
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
          Listing results:{" "}
          {totalCount > 0 && (
            <span className="text-3xl font-bold ml-2">
              ({listings.length} of {totalCount})
            </span>
          )}
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listings found!</p>
          )}
          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          {!showAll && showMore && (
            <div className="w-full flex gap-4">
              <button
                onClick={onShowMoreClick}
                className="text-green-700 hover:underline p-3 rounded-lg border border-green-700 flex-1"
              >
                Show More ({totalCount - listings.length} remaining)
              </button>
              <button
                onClick={onShowAllClick}
                className="text-blue-700 hover:underline p-3 rounded-lg border border-blue-700 flex-1"
              >
                Show All {totalCount} Listings
              </button>
            </div>
          )}
          {/* {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
          {!showAll && listings.length >= 9 && (
            <button
              onClick={onShowAllClick}
              className="text-blue-700 hover:underline p-7 text-center w-full"
            >
              Show all listings
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
}
