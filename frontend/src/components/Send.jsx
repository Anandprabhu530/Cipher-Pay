import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Send = () => {
  const [money, setMoney] = useState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transferto = searchParams.get("id");
  const name = searchParams.get("name");
  const handleChange = (event) => {
    setMoney(event.target.value);
  };
  useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      navigate("/signin");
    }
  }, []);
  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3000/api/v1/account/transfer", {
      method: "POST",
      body: JSON.stringify({
        transferto: transferto,
        amount: parseInt(money),
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("authorization"),
      },
    }).then((data) => data.json());
    if (res) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-300">
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg w-96 shadow-xl">
        <div className="text-3xl font-bold pb-6 text-center">Send Money</div>
        <div className="font-bold text-xl">{name}</div>
        <div className="text-xl font-semibold">Amount </div>
        <input
          className="p-2 outline-none bg-transparent border border-slate-400 rounded-md"
          placeholder="Enter amount"
          onChange={handleChange}
        />
        <button
          className="w-full p-2 bg-blue-500 rounded-md text-white font-semibold"
          onClick={handleSubmit}
        >
          Initiate transfer
        </button>
      </div>
    </div>
  );
};

export default Send;
