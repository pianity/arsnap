import { Link } from "react-router-dom";
import metamaskLogoUrl from "@/assets/metamask.png";
import arsnapLogoUrl from "@/assets/arsnap.png";

export default function Header() {
    return (
        <header className="w-screen h-[72px] pl-6 pr-5 flex items-center justify-between relative border-b border-white border-opacity-25">
            {/* MARK: Navbar items */}
            <ul className="flex">
                <li className="text-white text-base leading-[17px] font-semibold mr-4 lg:hover:text-purple-text">
                    <Link to="/about">About</Link>
                </li>
                <li className="text-white text-base leading-[17px] font-semibold mr-4 lg:hover:text-purple-text">
                    <Link to="/help">Help</Link>
                </li>
                <li className="text-white text-base leading-[17px] font-semibold mr-4 lg:hover:text-purple-text">
                    <Link to="/report">Report a bug</Link>
                </li>
            </ul>
            {/* MARK: Metamask connect */}
            <button className="h-10 px-4 flex items-center rounded-full bg-white bg-opacity-20 lg:hover:bg-opacity-40 transition duration-300 ease-quart-out">
                <span className="text-sm leading-[15px] font-semibold mr-2">Connect with</span>
                <img src={metamaskLogoUrl} alt="Metamask" />
            </button>
            {/* MARK: ArSnap logo */}
            <img
                src={arsnapLogoUrl}
                alt="ArSnap for MetaMask"
                className="absolute px-10 left-1/2 -bottom-14 -translate-x-1/2 z-10 bg-purple-dark"
            />
        </header>
    );
}
