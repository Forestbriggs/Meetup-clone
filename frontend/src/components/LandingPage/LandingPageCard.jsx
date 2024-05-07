import { NavLink } from "react-router-dom"
export default function LandingPageCard({ title, text, image, disabled, to }) {


    return (
        <div className="landing-page__card">
            <div className="card-image" style={{ backgroundImage: `url(${image})` }} />
            {disabled ? <a disabled className="disabled">{title}</a> : <NavLink to={to}>{title}</NavLink>}


            <p>{text}</p>
        </div>
    )
}