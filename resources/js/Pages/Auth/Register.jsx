import { useState } from "react";
import { router, Head } from "@inertiajs/react";

export default function Register({seo}) {
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

  const preventSubmitOnEnter = (e) => {
    if (e.key === "Enter" && step !== 3) {
      e.preventDefault();
    }
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
    if (step !== 3) return;

    setLoading(true);
    setErrors({});

    router.post(
      "/register/step",
      { ...data, step: 3, final_submit: true },
      {
        onStart: () => setLoading(true),
        onFinish: () => setLoading(false),
        onError: (errs) => setErrors(errs),
      }
    );
  };

  const inputClass =
    "w-full px-4 py-2 rounded-lg border bg-transparent text-secondary-text focus:outline-none focus:ring-1 focus:ring-primary-btn ";

  const errorClass = "text-sm text-red-500 mt-1";

  const buttonClass =
    "px-6 py-2 bg-primary-btn text-primary-text font-semibold rounded-lg hover:bg-secondary-btn transition disabled:opacity-50";

  return (
    <>
    <Head>
        <link rel="icon" href={`/storage/Images/Favicon/${seo.favicon}`} type="image/x-icon" />
        <meta itemprop="name" content={seo.brand_name} />
        <meta name="description" content={seo.description} />
        <meta itemprop="image" content={`/storage/Images/BrandLogo/${seo.brand_logo}`} />
        <title>Register</title>
    </Head>
    <div className="min-h-screen flex items-center justify-center bg-primary-background px-4">
      <div className="w-full max-w-md bg-secondary-background border border-secondary-btn shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary-text mb-6">Register</h2>

        <form onSubmit={submitFinal} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  onKeyDown={preventSubmitOnEnter}
                  placeholder="Nama lengkapmu"
                  className={inputClass}
                  disabled={loading}
                />
                {errors.name && <div className={errorClass}>{errors.name}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                  onKeyDown={preventSubmitOnEnter}
                  placeholder="Pilih username"
                  className={inputClass}
                  disabled={loading}
                />
                {errors.username && <div className={errorClass}>{errors.username}</div>}
              </div>

              <button type="button" onClick={submitStep} disabled={loading} className={buttonClass}>
                {loading ? "Loading..." : "Lanjut"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  onKeyDown={preventSubmitOnEnter}
                  placeholder="kamu@email.com"
                  className={inputClass}
                  disabled={loading}
                />
                {errors.email && <div className={errorClass}>{errors.email}</div>}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="px-6 py-2 border border-secondary-btn rounded-lg text-secondary-text hover:bg-secondary-btn/20 transition"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={submitStep}
                  disabled={loading}
                  className={buttonClass}
                >
                  {loading ? "Loading..." : "Lanjut"}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Buat password"
                  className={inputClass}
                  disabled={loading}
                />
                {errors.password && <div className={errorClass}>{errors.password}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-text mb-1">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={inputClass}
                  disabled={loading}
                />
                {errors.password_confirmation && (
                  <div className={errorClass}>{errors.password_confirmation}</div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="px-6 py-2 border border-secondary-btn rounded-lg text-secondary-text hover:bg-secondary-btn/20 transition"
                >
                  Kembali
                </button>
                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? "Mendaftarkan..." : "Daftar"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="mt-6 text-center text-secondary-text text-sm">
          Sudah punya akun?{" "}
          <a href="/login" className="text-primary-btn hover:underline font-medium">
            Login sekarang
          </a>
        </p>
      </div>
    </div>
    </>
  );
}
