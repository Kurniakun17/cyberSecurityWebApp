import axios from 'axios';

const fetchProjects = async () => {
  const res = await axios.get('http://localhost:3000/project');

  return res.data;
};

const fetchProjectDetail = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/project/${id}`);

  return res.data;
};

const toggleProjects = async (id: string, progress: string) => {
  await axios.put(`http://localhost:3000/project/${id}`, {progress}) 
}

export { fetchProjects, fetchProjectDetail, toggleProjects };
