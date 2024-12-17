import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-[#FCFAF7] w-full h-screen flex flex-col justify-start items-center relative">
      <div className="sm:w-[85%] md:w-[50%] lg:w-[34%] mt-8 flex flex-col">
        <h1 className="text-3xl font-[750] py-5 text-left">Login</h1>
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
          onClick={handleSignIn}
        >
          Log in
        </div>
        {/* <div
          className="bg-[#F5EDE8] hover:bg-[#f3eae5] flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center mt-3 gap-2"
          onClick={handleGoogleSignIn}
        >
          <div>Continue with Google</div>
        </div> */}
        <h1 className="text-sm text-[#9C784A] font-[500] text-center py-3">
          Don’t have an account?
        </h1>
        <Link
          to="/signup"
          className="bg-[#F5EDE8] hover:bg-[#f3eae5] flex justify-center items-center font-[600] px-4 py-2 rounded-xl cursor-pointer text-center gap-2"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
