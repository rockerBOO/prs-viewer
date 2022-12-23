import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { isSearchEnabled } from "./main";
import Search from "./search";
import { set } from "./settings";
import { RootState } from "./store";
import GotoTop from "./top";

const Settings = () => {
	const settings = useSelector((state: RootState) => {
		return state.settings;
	});
	const dispatch = useDispatch();

	return (
		<button
			onClick={() => {
				dispatch(
					set({
						gallery_size: settings.gallery_size
							? settings.gallery_size === 1024
								? 256
								: 1024
							: 1024,
					}),
				);
			}}
			style={{ position: "fixed", top: "1em", right: "1em" }}
		>
			Toggle sizes
		</button>
	);
};

const App = () => {
	return (
		<main>
			<header>
				<span style={{ opacity: 0.5, margin: "1em 0" }}>PRS Viewer</span>
				<nav>
					<Link to="/">Index</Link>
					<Settings />
					{isSearchEnabled && <Search />}
					<GotoTop />
				</nav>
			</header>
			<Outlet />
		</main>
	);
};

export default App;

