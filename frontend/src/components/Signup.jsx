import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [data, setData] = useState();
  const navigate = useNavigate();
  const handleChange = (event) => {
    setData((prev) => {
      return { ...prev, [event.target.name]: event.target.value };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await fetch("http://localhost:3000/api/v1/user/new-user", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("authorization", token);
      navigate("/dashboard");
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-300">
      <div className="flex flex-col w-80 h-max bg-white p-6 rounded-lg">
        <div className="w-full flex justify-center font-bold text-3xl pb-4">
          Sign Up
        </div>
        <div className="text-lg text-slate-400 pb-6 text-center font-semibold">
          Enter your information to create an account
        </div>
        <form className="flex flex-col">
          <div className="font-semibold pb-2">Fullname</div>
          <input
            onChange={handleChange}
            name="fullname"
            placeholder="John doe"
            className="border p-2 border-slate-300 rounded-md bg-transparent outline-none w-full"
          />
          <div className="pt-6 font-semibold pb-2">Email</div>
          <input
            onChange={handleChange}
            name="username"
            placeholder="johndoe@example.com"
            type="email"
            className="border p-2 border-slate-300 rounded-md bg-transparent outline-none w-full"
          />
          <div className="pt-6 font-semibold">Password</div>
          <input
            onChange={handleChange}
            name="password"
            type="password"
            className="border p-2 border-slate-300 rounded-md bg-transparent outline-none w-full"
          />
          <button
            className="mt-6 w-full bg-black text-white cursor-pointer rounded-lg p-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
        <div className="w-full flex justify-center pt-4 font-semibold">
          Already have an account? &nbsp;
          <Link to="/signin" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
