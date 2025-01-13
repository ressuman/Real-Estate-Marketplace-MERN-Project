import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useState } from "react";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // const handleGoogleClick = async () => {
  //   if (loading) return;
  //   setLoading(true);

  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const auth = getAuth(app);

  //     const result = await signInWithPopup(auth, provider);
  //     const idToken = await result.user.getIdToken();

  //     const res = await fetch("/api/v1/auth/google-auth", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: result.user.displayName,
  //         email: result.user.email,
  //         photo: result.user.photoURL,
  //       }),
  //     });

  //     if (!res.ok) {
  //       throw new Error(`Error: ${res.status} ${res.statusText}`);
  //     }

  //     const data = await res.json();
  //     dispatch(signInSuccess(data));
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Could not sign in with Google:", error);
  //     alert("Sign-In failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleGoogleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch("/api/v1/auth/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      if (!res.ok) throw new Error(`Error: ${res.statusText}`);
      const data = await res.json();

      dispatch(signInSuccess({ user: data.data.user, token: data.data.token }));
      navigate("/profile");
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className={`bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95 ${
        loading && "opacity-50 cursor-not-allowed"
      }`}
      disabled={loading}
    >
      {loading ? "Signing In..." : "Continue with Google"}
    </button>
  );
}
