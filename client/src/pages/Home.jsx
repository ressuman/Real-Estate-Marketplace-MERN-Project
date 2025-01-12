import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/bundle";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [leaseListings, setLeaseListings] = useState([]);
  const [shortTermListings, setShortTermListings] = useState([]);
  const [longTermListings, setLongTermListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const [
          offersRes,
          rentRes,
          saleRes,
          leaseRes,
          shortTermRes,
          longTermRes,
        ] = await Promise.all([
          fetch("/api/v1/listings/get-all-listings?offer=true&limit=3"),
          fetch(
            "/api/v1/listings/get-all-listings?transactionType=rent&limit=3"
          ),
          fetch(
            "/api/v1/listings/get-all-listings?transactionType=sale&limit=3"
          ),
          fetch(
            "/api/v1/listings/get-all-listings?transactionType=lease&limit=3"
          ),
          fetch(
            "/api/v1/listings/get-all-listings?transactionType=short-term&limit=3"
          ),
          fetch(
            "/api/v1/listings/get-all-listings?transactionType=long-term&limit=3"
          ),
        ]);

        const [
          offersData,
          rentData,
          saleData,
          leaseData,
          shortTermData,
          longTermData,
        ] = await Promise.all([
          offersRes.json(),
          rentRes.json(),
          saleRes.json(),
          leaseRes.json(),
          shortTermRes.json(),
          longTermRes.json(),
        ]);

        setOfferListings(offersData.data);
        setRentListings(rentData.data);
        setSaleListings(saleData.data);
        setLeaseListings(leaseData.data);
        setShortTermListings(shortTermData.data);
        setLongTermListings(longTermData.data);
      } catch (err) {
        setError("Failed to fetch listings");
        console.error(err);
      }
    };

    fetchListings();
  }, []);

  return (
    <div>
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">
          Discover your <span className="text-slate-500">Dream Ideal </span>{" "}
          <br />
          perfect home effortlessly
          <br />
          with AbodeConnect
        </h1>
        <p className="text-gray-500 text-xs md:text-sm lg:text-base leading-relaxed">
          Welcome to{" "}
          <strong className="text-gray-700">AbodeConnect Estate</strong>, your
          trusted partner — where your journey to finding the perfect property
          begins.
          <br />
          Whether you&apos;re searching for a cozy apartment, a modern
          townhouse, or a luxurious villa, we provide a diverse range of
          hand-picked and extensive selection of properties tailored to suit
          your lifestyle, needs and budget.
        </p>
        <Link
          to="/search"
          className="text-xs md:text-sm lg:text-base  text-blue-600 font-bold hover:underline  hover:text-blue-900 shadow-sm transition-all duration-300"
        >
          Start your journey and search today...
        </Link>
      </div>

      {/* Swiper Section */}
      {offerListings && offerListings?.length > 0 && (
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
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Offers */}
        {offerListings && offerListings?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rentListings && rentListings?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?transactionType=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Sale */}
        {saleListings && saleListings?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for Full sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?transactionType=sale"}
              >
                Show more places for Full sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Lease */}
        {leaseListings && leaseListings?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for lease
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?transactionType=lease"}
              >
                Show more places for lease
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {leaseListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Short Term */}
        {shortTermListings && shortTermListings?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for Short term
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?transactionType=short-term"}
              >
                Show more places for Short term
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {shortTermListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Long Term */}
        {longTermListings && longTermListings?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for Long term
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?transactionType=long-term"}
              >
                Show more places for Long term
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {longTermListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
