import { Link, Outlet } from "react-router-dom";

const App = () => {
  return (
    <div style={{ width: "100%", display: "grid", justifyItems: "center" }}>
      <div style={{ display: "grid", justifyItems: "center" }}>
        <h1 style={{ opacity: 0.5 }}>PRS Viewer</h1>
        <Link to="/">Index</Link>
      </div>
      <Outlet />
    </div>
  );
};

export default App;
