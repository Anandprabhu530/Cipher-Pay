import { useEffect, useState } from "react";

const Dashboard = () => {
  const [data, setdata] = useState();
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const setter = async () => {
      const res = await fetch("http://localhost:3000/api/v1/user/bulk").then(
        (data) => data.json()
      );
      setdata(res);
      console.log(res);
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
  }, []);

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
        />
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg pb-4">All Users</div>
        <div>
          {data &&
            data.users.map((solo_data, index) => (
              <div key={index} className="flex justify-between w-full">
                <div className="font-semibold">{solo_data.fullname}</div>
                <button className="p-2 bg-black text-white rounded-md">
                  Send Money
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
