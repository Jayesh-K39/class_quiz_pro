import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import BackIcon from './icons/BackIcon'
import EyeIcon from "./icons/Eye";
import EyeSlash from "./icons/EyeSlash";

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Class Quiz Pro | Teacher Login";
    }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    async function login(e) {
        e.preventDefault();
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            if (data.error) {
                toast.error(data.error);
                return;
            }

            localStorage.setItem("token", data.token);
            navigate("/controlroom", { replace: true });
        } catch {
            toast.error("Server Error. Please stand by...");
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white">

            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center lg:justify-between px-6">

                {/* Left Side */}
                <section className="hidden lg:block max-w-xl">

                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
                        Teacher Portal
                    </span>

                    <h1 className="mt-6 text-6xl font-black tracking-tight">
                        Welcome Back.
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-slate-300">
                        Log in to create quizzes, manage classrooms,
                        monitor live sessions, and view student results
                        in real time.
                    </p>

                    <div className="mt-10 flex gap-8 text-slate-300">

                        <div>
                            <p className="text-3xl font-bold text-white">
                                100%
                            </p>

                            <p className="text-sm">
                                Real-time
                            </p>
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-white">
                                ⚡
                            </p>

                            <p className="text-sm">
                                Instant Updates
                            </p>
                        </div>

                        <div>
                            <p className="text-3xl font-bold text-white">
                                🔒
                            </p>

                            <p className="text-sm">
                                Secure Login
                            </p>
                        </div>

                    </div>

                </section>

                {/* Login Card */}

                <section className="w-full max-w-md">

                    <form
                        onSubmit={login}
                        className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8"
                    >

                        <h2 className="text-3xl font-bold">
                            Teacher Login
                        </h2>

                        <p className="mt-2 text-sm text-slate-300">
                            Sign in to continue to your dashboard.
                        </p>

                        <div className="mt-8 space-y-5">

                            <div>

                                <label className="mb-2 block text-sm text-slate-300">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-violet-500"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm text-slate-300">
                                    Password
                                </label>

                                <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/70 focus-within:border-violet-500">

                                    <input
                                        type={
                                            show
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your password"
                                        className="flex-1 bg-transparent px-4 py-3 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShow((s) => !s)
                                        }
                                        className="px-4 text-sm text-violet-300 hover:text-white transition"
                                    >
                                        {password &&
                                            (show ? (
                                                <EyeIcon />
                                            ) : (
                                                <EyeSlash />
                                            ))}
                                    </button>

                                </div>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="mt-8 w-full rounded-xl bg-violet-600 py-3 font-semibold transition hover:bg-violet-500 active:scale-[0.98]"
                        >
                            Login
                        </button>

                    </form>

                </section>

            </div>

        </main>
    );
}

export default Login;
