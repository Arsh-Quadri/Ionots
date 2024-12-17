import { useState } from "react";
import { auth, googleProvider, db } from "../firebase"; // Import db for Firestore
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // Firestore functions
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState(""); // State for the user's name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const capitalizedName = capitalizeName(name);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: capitalizedName,
        email: user.email,
        score: 0,
      });

      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Store user details in Firestore
      const capitalizedName = capitalizeName(user.displayName || "Google User");
      await setDoc(doc(db, "users", user.uid), {
        name: capitalizedName,
        email: user.email,
      });

      alert("Signed up with Google!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-[#FCFAF7] w-full h-screen flex flex-col justify-start items-center relative">
      <div className="sm:w-[85%] md:w-[50%] lg:w-[34%] mt-8 flex flex-col">
        <h1 className="text-3xl font-[750] py-5 text-left">Sign Up</h1>
        <div className="mt-3">
          <h1 className="text-md font-[600] text-left mb-1">Name</h1>
          <input
            type="text"
            value={name}
            className="bg-transparent outline-none placeholder-[#9C784A] pl-2 py-2 w-full rounded-xl border-2 border-[#E8DECF]"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <h1 className="text-md font-[600] text-left mb-1">Email address</h1>
          <input
            type="email"
            value={email}
            className="bg-transparent outline-none placeholder-[#9C784A] pl-2 py-2 w-full rounded-xl border-2 border-[#E8DECF]"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-3">
          <h1 className="text-md font-[600] text-left">Password</h1>
          <input
            type="password"
            value={password}
            className="bg-transparent outline-none placeholder-[#9C784A] pl-2 py-2 w-full rounded-xl border-2 border-[#E8DECF]"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div
          className="bg-[#F28F0D] hover:bg-[#f89f2b] font-[600] px-4 py-3 rounded-xl cursor-pointer text-center mt-3"
          onClick={handleSignUp}
        >
          Sign up
        </div>
        {/* <div
          className="bg-[#F5EDE8] hover:bg-[#f3eae5] flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center mt-3 gap-2"
          onClick={handleGoogleSignUp}
        >
          <div>Continue with Google</div>
        </div> */}
        <h1 className="text-sm text-[#9C784A] font-[500] text-center py-3">
          Already have an account?
        </h1>
        <Link
          to="/login"
          className="bg-[#F5EDE8] hover:bg-[#f3eae5] flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center gap-2"
        >
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Signup;
