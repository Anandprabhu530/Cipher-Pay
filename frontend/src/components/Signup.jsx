import { Link } from "react-router-dom";

const Signup = () => {
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
            placeholder="John doe"
            className="border p-2 border-slate-300 rounded-md bg-transparent outline-none w-full"
          />
          <div className="pt-6 font-semibold pb-2">Email</div>
          <input
            placeholder="johndoe@example.com"
            className="border p-2 border-slate-300 rounded-md bg-transparent outline-none w-full"
          />
          <div className="pt-6 font-semibold">Password</div>
          <input className="border p-2 border-slate-300 rounded-md bg-transparent outline-none w-full" />
          <button className="mt-6 w-full bg-black text-white cursor-pointer rounded-lg p-2">
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
