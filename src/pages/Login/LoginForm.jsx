import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { loginDoctor } from "../../redux/auth/authThunk";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    login_id: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(loginDoctor(form));

    if (loginDoctor.fulfilled.match(resultAction)) {
      console.log(resultAction.payload.user);

      navigate("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[420px] rounded-[30px] bg-white p-8 shadow-lg"
    >
      <h2 className="mb-8 text-3xl font-bold">
        Doctor Login
      </h2>

      <input
        name="login_id"
        placeholder="Login ID"
        value={form.login_id}
        onChange={handleChange}
        className="mb-5 h-14 w-full rounded-xl border px-4"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className="mb-3 h-14 w-full rounded-xl border px-4"
      />

      {error && (
        <p className="mb-4 text-sm text-red-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="h-14 w-full rounded-xl bg-[#6A3F2D] text-white disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};
                            
export default LoginForm;                                                                                                                                                                                                                                                                           