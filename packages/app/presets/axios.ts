import axios from 'axios'

axios.interceptors.request.use((config) => {
	return config
})

axios.interceptors.response.use(
	(response) => response.data,
	(error) => Promise.reject(error)
)
