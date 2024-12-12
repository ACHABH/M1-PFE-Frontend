import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

export default function Loading() {
  return (
    <Container
      as="div"
      style={{
        width: "100%",
        height: "100%",
        display: "grid",
        placeContent: "center",
      }}
    >
      <Spinner />
    </Container>
  );
}
