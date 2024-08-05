import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

const api = {
  getCodeBlocks: () => axios.get(`${API_BASE_URL}/api/codeblocks`),
  getCodeBlock: (id) => axios.get(`${API_BASE_URL}/api/codeblocks/${id}`)
};

export default api;
