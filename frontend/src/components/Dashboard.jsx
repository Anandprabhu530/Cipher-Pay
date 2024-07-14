/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setdata] = useState();
  const [balance, setBalance] = useState(0);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("authorization")) {
      navigate("/signin");
    }
    const setter = async () => {
      const res = await fetch(
        "http://localhost:3000/api/v1/user/bulk?filter=" + filter
      ).then((data) => data.json());
      setdata(res.users);
    };
    setter();

    const balance_getter = async () => {
      const res = await fetch("http://localhost:3000/api/v1/account/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: localStorage.getItem("authorization"),
        },
      }).then((data) => data.json());
      setBalance(res);
    };
    balance_getter();
  }, [filter, navigate]);

  return (
    <div className="w-full h-screen border-2 border-red-500">
      <div className="text-2xl font-bold justify-between p-4 border-b border-slate-400 w-full flex">
        <div>Cipher Pay</div>
        <div>Hello Testuser01</div>
      </div>
      <div className="p-4 text-xl font-semibold">
        Your Balance: {balance.balance}
      </div>
      <div className="p-4">
        <div className="text-xl font-semibold pb-4">Users</div>
        <input
          className="p-2 w-full bg-transparent border border-slate-400 rounded-md outline-none"
          placeholder="Search Users.."
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg pb-4">All Users</div>
        <div>
          {data &&
            data.map((solo_data, index) => (
              <Userdisplay key={index} solo_data={solo_data} />
            ))}
        </div>
      </div>
    </div>
  );
};

const Userdisplay = ({ solo_data }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between w-full m-2 p-2 items-center">
      <div className="font-semibold">{solo_data.fullname}</div>
      <button
        className="p-2 bg-black text-white rounded-md"
        onClick={() =>
          navigate("/send?id=" + solo_data.id + "&name=" + solo_data.fullname)
        }
      >
        Send Money
      </button>
    </div>
  );
};
export default Dashboard;
