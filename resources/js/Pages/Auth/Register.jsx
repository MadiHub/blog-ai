import { useState } from "react";
import { router } from "@inertiajs/react";

export default function Register() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitStep = () => {
    setLoading(true);
    setErrors({});

    router.post(
      "/register/step",
      { ...data, step },
      {
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
        onSuccess: () => setStep((prev) => prev + 1),
        onError: (errs) => setErrors(errs),
      }
    );
  };

  const submitFinal = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    router.post(
      "/register/step",
      { ...data, step: 3, final_submit: true },
      {
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
        onSuccess: () => router.visit("/dashboard"),
        onError: (errs) => setErrors(errs),
      }
    );
  };

  const inputClass =
    "w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const errorClass = "text-sm text-red-600 mt-1";

  const buttonClass =
    "px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300";

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

      <form onSubmit={submitFinal}>
        {step === 1 && (
          <>
            <label className="block mb-4">
              <span className="text-gray-700">Name</span>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass}
                disabled={loading}
              />
              {errors.name && <div className={errorClass}>{errors.name}</div>}
            </label>

            <label className="block mb-6">
              <span className="text-gray-700">Username</span>
              <input
                type="text"
                name="username"
                value={data.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={inputClass}
                disabled={loading}
              />
              {errors.username && (
                <div className={errorClass}>{errors.username}</div>
              )}
            </label>

            <button
              type="button"
              onClick={submitStep}
              disabled={loading}
              className={buttonClass}
            >
              {loading ? "Loading..." : "Next"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block mb-6">
              <span className="text-gray-700">Email</span>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
                disabled={loading}
              />
              {errors.email && <div className={errorClass}>{errors.email}</div>}
            </label>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={loading}
                className="px-6 py-3 border rounded-md border-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={submitStep}
                disabled={loading}
                className={buttonClass}
              >
                {loading ? "Loading..." : "Next"}
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label className="block mb-4">
              <span className="text-gray-700">Password</span>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={inputClass}
                disabled={loading}
              />
              {errors.password && (
                <div className={errorClass}>{errors.password}</div>
              )}
            </label>

            <label className="block mb-6">
              <span className="text-gray-700">Confirm Password</span>
              <input
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={inputClass}
                disabled={loading}
              />
              {errors.password_confirmation && (
                <div className={errorClass}>{errors.password_confirmation}</div>
              )}
            </label>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={loading}
                className="px-6 py-3 border rounded-md border-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className={buttonClass}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
