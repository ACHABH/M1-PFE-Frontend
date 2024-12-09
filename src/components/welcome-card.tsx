import { Link } from "@tanstack/react-router";
// import ProfilePic from "../../public/icons/default-user-picture.png"

type Props = {
  name: string;
  path: string;
};

export default function WelcomeCard(props: Props) {
  return (
    <div
      className="bg-white d-flex justify-content-between p-2 rounded shadow mt-4 mx-3"
      style={{ width: "fit-content" }}
    >
      <img
        src={props.path}
        alt="Profile Picture"
        className="rounded-circle"
        style={{ width: "50px", height: "50px" }}
      />
      <div>
        <h4>Welcome, {props.name}</h4>
        <Link
          to="/"
          className="text-secondary"
          style={{
            textDecoration: "none",
            fontSize: "13px",
          }}
        >
          Sign out
        </Link>
      </div>
    </div>
  );
}
