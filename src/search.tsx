/* eslint-disable react/react-in-jsx-scope */
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { Link } from "react-router-dom";
import { SEARCH_HOST } from "./main";
import useAutoFocus from "./useAutoFocus";

type Result = {
	id: string[];
	method: string[];
	prompt: string[];
	scale: number[];
	seed: number[];
};

type QueryResult = {
	score: number;
	result: Result;
};

type QueryResults = {
	status: number;
	results: QueryResult[];
};

const makeSearch =
	(set: Dispatch<SetStateAction<QueryResults | undefined>>) =>
	async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		fetch(
			`${SEARCH_HOST}/v1/query/${(e.target as HTMLFormElement).query.value}`,
		)
			.then((res) => res.json() as unknown as QueryResults)
			.then((results) => {
				return set(results);
			});
	};

const Search = () => {
	const [results, setResults] = useState<undefined | QueryResults>(undefined);
	const [query, setQuery] = useState("");
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const focus = useAutoFocus();

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "x" && e.ctrlKey) {
				setResults(undefined);
				setQuery("");
			}
		};
		document.addEventListener("keyup", handler);
		return function cleanup() {
			document.removeEventListener("keyup", handler);
		};
	});

	return (
		<div className="search">
			{isSearching ? (
				<form onSubmit={makeSearch(setResults)}>
					<input
						type="text"
						name="query"
						className="query"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						ref={focus}
					/>
					<button
						type="button"
						onClick={() => {
							setResults(undefined);
							setQuery("");
						}}
						onKeyUp={() => {
							setResults(undefined);
							setQuery("");
						}}
					>
						X Clear
					</button>
					<button
						type="button"
						onClick={() => {
							setIsSearching(false);
							setResults(undefined);
							setQuery("");
						}}
						onKeyUp={() => {
							setIsSearching(false);
							setResults(undefined);
							setQuery("");
						}}
					>
						&lt; Close
					</button>
				</form>
			) : (
				<button
					type="button"
					onClick={() => {
						setIsSearching(true);
					}}
					onKeyUp={() => {
						setIsSearching(true);
					}}
				>
					Search
				</button>
			)}
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
					gridGap: "2em",
				}}
			>
				{isSearching && results !== undefined ? (
					results?.results?.length > 0 ? (
						<Results
							results={results?.results}
							onGoToResult={() => {
								setIsSearching(false);
							}}
						/>
					) : (
						<></>
					)
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

const Results = ({ results, onGoToResult }) => {
	return results.map((result) => {
		const dir = result.result.id[0].substring(
			0,
			result.result.id[0].length - 5,
		);
		const id = result.result.id[0];
		const iter = result.result.id[0].substring(
			result.result.id[0].length - 4,
			result.result.id[0].length,
		);
		return (
			<div key={id} class="result">
				<Link to={`/${dir}/${iter}`} onClick={onGoToResult}>
					<img src={`http://localhost:3000/${dir}/${id}.png`} alt={id} />
				</Link>
			</div>
		);
	});
};

export default Search;

