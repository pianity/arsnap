import { Link } from "react-router-dom";

import { AppRoute } from "@/consts";

export default function Settings() {
    return (
        <ul>
            <li>
                <Link to={AppRoute.GeneralSettings}>General Settings</Link>
            </li>
            <li>
                <Link to={AppRoute.Events}>Events</Link>
            </li>
            <li>
                <Link to={AppRoute.Permissions}>Permissions</Link>
            </li>
        </ul>
    );
}
