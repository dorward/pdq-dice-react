import React, { useState, useEffect } from 'react';
import { Button, Intent, Spinner } from '@blueprintjs/core';
import axios from 'axios';

const Login = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				const url = 'http://localhost:3000/api/allUsers';
				const response = await axios.get(url);
				console.log(response);
				setData(response.data);
			} catch {
				setData('Something went wrong');
			}
		})();
	}, []);

	if (data) {
		return (
			<main className="tiny">
				<p>{JSON.stringify(data)}</p>
			</main>
		);
	}

	return (
		<main className="tiny">
			<Spinner intent={Intent.PRIMARY} />
		</main>
	);
};

export default Login;
