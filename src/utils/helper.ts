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

const fetchChecklistDetail = async (checklistId: string, templateId:string, ) => {
  const url = `http://localhost:3000/template/${templateId}/checklist/${checklistId}`;
  const res = await axios.get(url);
  return res.data;
}

const updateChecklistItem = async (templateId: string, checklistId: string, body: {title: string}) => {
  const res = await axios.put(`http://localhost:3000/template/${templateId}/checklist/${checklistId}`, body)
  console.log(res.data);
  return res.data;
}

const uploadPocImage = async( templateId: string ,checklistId: string,  objectImage: {file: File, caption: string}) => {
  const formData = new FormData();
  formData.append('file', objectImage.file);
  formData.append('caption', objectImage.caption);

  const url = `http://localhost:3000/template/${templateId}/checklist/${checklistId}/upload`;
  const res= await axios.post(url, formData, { headers: {
          "Content-Type": "multipart/form-data",}})
  return res.data;
};

const exportToDocx = async (projectId: string, body: {client: string, report_type:string}) => {
  const url =`http://localhost:3000/project/${projectId}/export`;
  console.log(url);
  const res= await axios.post(url,body)
  if(res.data.success){
  const link = document.createElement('a');
  link.download=`${body.client} report`

  link.href = `http://localhost:3000${res.data.response.path.replace('.', '')}`;
  link.click();  }

  return res.data;
}

const deletePOCImage = async( templateId: string ,checklistId: string,  imageId:string) => {
  const url = `http://localhost:3000/template/${templateId}/checklist/${checklistId}/upload/${imageId}`;
  const res= await axios.delete(url);
  return res.data;
};


const toggleChecklist = async (templateId:string, checklistId: string, progress: number) => {
  const url = `http://localhost:3000/template/${templateId}/checklist/${checklistId}`;
  const res = await axios.put(url, {progress})
  return res.data;
}

const toggleProject = async (id: string, progress: string) => {
  await axios.put(`http://localhost:3000/project/${id}`, {progress}) 
}

const deleteProject = async (id: string) => {
    await axios.delete(`http://localhost:3000/project/${id}`)
}

const moveChecklist = async ({templateId, body} :{templateId: string, body: unknown}) => {
  const newBody = {checklisttag_id: body.id, checklists: body.checklist};
  const res = await axios.post(`http://localhost:3000/template/${templateId}/checklist/move`, newBody)
  console.log(res.data);
}

const moveChecklistToAnotherTag =async ({templateId, body} :{templateId: string, body: unknown}) => {
  console.log(body);
  const res = await axios.post(`http://localhost:3000/template/${templateId}/checklist/movetag`, body)
  console.log(res);
}

export { moveChecklist, moveChecklistToAnotherTag, fetchProjects, fetchProjectDetail, exportToDocx, addChecklistTag, addChecklistTagItem, deleteChecklistItem, deleteChecklistTag, fetchChecklistDetail,toggleChecklist, toggleProject,deleteProject , updateChecklistItem, uploadPocImage, deletePOCImage };
