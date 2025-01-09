import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { titleCase } from "../helper/unit";

export default function Contact({ listing, onClose }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      if (!listing?.userRef) return; // Ensure userRef exists before making the request

      try {
        const res = await fetch(`/api/v1/user/current-user/${listing.userRef}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch landlord data: ${res.statusText}`);
        }
        const data = await res.json();
        setLandlord(data.data);
        console.log("Landlord data:", data.data);
      } catch (error) {
        console.error("Error fetching landlord data:", error);
      }
    };

    fetchLandlord();
  }, [listing?.userRef]);

  const handleSendMessage = () => {
    setIsSending(true);

    // Simulate sending message and resetting the button
    setTimeout(() => {
      setIsSending(false);
      setMessage(""); // Clear the message after sending
      onClose(); // Close the contact form after sending
    }, 3000); // Adjust the timeout as needed
  };

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold">
              {titleCase(landlord.username)}
            </span>{" "}
            for{" "}
            <span className="font-semibold">{titleCase(listing.title)}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="3"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg resize-none"
          ></textarea>

          {isSending ? (
            <button
              disabled
              className="bg-slate-400 text-white text-center p-3 uppercase rounded-lg"
            >
              Sending...
            </button>
          ) : (
            <Link
              to={`mailto:${
                landlord.email
              }?subject=Regarding ${encodeURIComponent(
                listing.title
              )}&body=${encodeURIComponent(message)}`}
              className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
              onClick={handleSendMessage}
            >
              Send Message
            </Link>
          )}
        </div>
      )}
    </>
  );
}

Contact.propTypes = {
  listing: PropTypes.shape({
    userRef: PropTypes.string,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
