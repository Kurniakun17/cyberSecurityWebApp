import axios from 'axios';

const fetchProjects = async () => {
  const res = await axios.get('http://localhost:3000/project');

  return res.data;
};

const fetchProjectDetail = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/project/${id}`);

  return res.data;
};

const addChecklistTag = async (id: string, name: string) => {
  const res = await axios.post(`http://localhost:3000/template/${id}/tag`, {name});
  return res.data;
} 

const addChecklistTagItem = async (templateId: string, checklistTagId: string, title: string) => {
  const res = await axios.post(`http://localhost:3000/template/${templateId}/checklist`, {title, tag: checklistTagId});
  return res.data;
}

const deleteChecklistItem = async (templateId: string, checklistTagId: string) => {
  const res = await axios.delete(`http://localhost:3000/template/${templateId}/checklist/${checklistTagId}`)
  return res.data;
}

const deleteChecklistTag = async (templateId: string, checklistTagId: string) => {
  const res = await axios.delete(`http://localhost:3000/template/${templateId}/tag/${checklistTagId}`)
  return res.data;
}

const toggleChecklist = async (templateId:string, checklistTagId: string, progress: number) => {
  const res = await axios.put(`http://localhost:3000/template/${templateId}/checklist/${checklistTagId}`, {progress})
  return res.data;
}

const toggleProjects = async (id: string, progress: string) => {
  await axios.put(`http://localhost:3000/project/${id}`, {progress}) 
}

export { fetchProjects, fetchProjectDetail, addChecklistTag, addChecklistTagItem, deleteChecklistItem, deleteChecklistTag, toggleChecklist, toggleProjects };
