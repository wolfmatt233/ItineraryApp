import Error from "./resources/Error";
import CreateItinerary from "./resources/itineraries/CreateItinerary";
import Itineraries from "./resources/itineraries/Itineraries";
import Itinerary from "./resources/activities/Itinerary";
import Login from "./resources/auth/Login";
import SignUp from "./resources/auth/SignUp";
import User from "./resources/auth/User";

export default function RenderPage({ user, page }) {
  if (user) {
    switch (page.split(":")[0]) {
      case "itineraries":
        return <Itineraries />;
      case "user":
        return <User />;
      case "create-itinerary":
        return <CreateItinerary />;
      case "itinerary":
        return <Itinerary id={page.split(":")[1]} />;
      case "error":
        return (
          <Error
            error={page.split(":")[1].split("|")[0]}
            status={page.split("|")[1]}
          />
        );
      default:
        return <Error error="Page not found" status={404} />;
    }
  } else {
    switch (page) {
      case "login":
        return <Login />;
      case "signup":
        return <SignUp />;
      default:
        return <Error error="Please log in or sign up." />;
    }
  }
}
