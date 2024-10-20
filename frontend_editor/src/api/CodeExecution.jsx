import axios from 'axios';

const executeCode = async (language, version, code) => {
  try {
    const response = await axios.post('http://localhost:5000/', { language, version, code });
    return response.data;
  } catch (error) {
    return { success: false, error: 'Execution failed' };
  }
};

export default executeCode;