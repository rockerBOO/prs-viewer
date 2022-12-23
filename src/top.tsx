/* eslint-disable react/react-in-jsx-scope */
const GotoTop = () => {
	return (
		<div style={{ position: "fixed", bottom: 0, right: 0, margin: "0.3em" }}>
			<button
				type="button"
				onClick={() => {
					window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
				}}
				onKeyUp={() => {
					window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
				}}
			>
				^
			</button>
		</div>
	);
};

export default GotoTop;

