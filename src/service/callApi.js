import {API_ROOT} from "../api-config";

const callApi = async (path) => {
	const response = await fetch(`${API_ROOT}/${path}`);
	const body = await response.json();

	if (response.status !== 200) throw Error(body.message);

	return body;
};

export default callApi