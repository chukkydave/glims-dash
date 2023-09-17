import {
    Lucide,
    LoadingIcon,
} from "@/base-components";
import DarkModeSwitcher from "@/components/dark-mode-switcher/Main";
import dom from "@left4code/tw-starter/dist/js/dom";
import logoUrl from "@/assets/images/logo.svg";
import illustrationUrl from "@/assets/images/illustration.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "../../features/auth/authSlice";
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL;

function Main() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (token !== null) {
            navigate("/");
        } else {
            dom("body").removeClass("main").removeClass("error-page").addClass("login");
        }
    }, [token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email === '' || password === '') {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    "x-auth-key": "dGhpc2lzd29uZGVyZnVsOnNlY3JldHNhdWNl"
                },
            };

            const requestData = {
                email,
                password,
            };
            const response = await axios.post(`${baseUrl}/admin/login`, requestData, config);


            let { active, admin_id, email: mails, first_name, last_name, phone_number, role_id, id } = response.data.data.admin
            let Adata = {
                isAdmin: active,
                fullName: `${first_name} ${last_name}`,
                phone: phone_number,
                email: mails,
                id: admin_id,
            };

            dispatch(setToken(response.data.data.access_token));
            dispatch(setUser(Adata));
            setErrorMessage('');
            setEmail('');
            setPassword('');
            setLoading(false);
            // navigate("/");
        } catch (error) {
            setErrorMessage(error);
            console.log(error);
            setLoading(false);
        }
    };
    // console.log(process.env.VITE_API_PATH)

    return (
        <>
            <div>
                <DarkModeSwitcher />
                <div className="container sm:px-10">
                    <div className="block xl:grid grid-cols-2 gap-4">
                        {/* BEGIN: Login Info */}
                        <div className="hidden xl:flex flex-col min-h-screen">
                            <a href="" className="-intro-x flex items-center pt-5">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="w-6"
                                    src={logoUrl}
                                />
                                <span className="text-white text-lg ml-3"> Law-school Paddi </span>
                            </a>
                            <div className="my-auto">
                                <img
                                    alt="Midone Tailwind HTML Admin Template"
                                    className="-intro-x w-1/2 -mt-16"
                                    src={illustrationUrl}
                                />
                                <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                                    A few more clicks to <br />
                                    sign in to your account.
                                </div>
                                <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                                    Manage Law-School Paddi App from here.
                                </div>
                            </div>
                        </div>
                        {/* END: Login Info */}
                        {/* BEGIN: Login Form */}
                        <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                            <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                                    Sign In
                                </h2>
                                <div className="intro-x mt-2 text-slate-400 xl:hidden text-center">
                                    A few more clicks to sign in to your account. Manage Law-School Paddi App from here.
                                </div>
                                <div className="intro-x mt-8">
                                    <input
                                        type="email"
                                        className="intro-x login__input form-control py-3 px-4 block"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}

                                    />
                                    <input
                                        type="password"
                                        className="intro-x login__input form-control py-3 px-4 block mt-4"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div><br />
                                {errorMessage && <div className="text-danger">{errorMessage}</div>}
                                <div className="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
                                    <a href="">Forgot Password?</a>
                                </div>
                                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">

                                    {loading ? (<button className="w-24 h-6"><LoadingIcon icon="puff" /></button>) : (<button className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" onClick={handleSubmit}>
                                        Login
                                    </button>)}

                                </div>

                            </div>
                        </div>
                        {/* END: Login Form */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;
