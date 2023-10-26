import axios from "axios";
import { ChecklistTag, UserData } from "./types";
const mainUrl = "http://localhost:3000";

const api = axios.create({
  baseURL: mainUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }
  return config;
});

const removeCollaborator=  async (projectId: string,
  body: { collaborator_id: string }) =>{
    console.log(body);
  try {
    const res = await api.post(
      `${mainUrl}/project/${projectId}/remove-collaborator`,
      body
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

const addCollaborator = async (
  projectId: string,
  body: { collaborator_id: string }
) => {
  try {
    const res = await api.post(
      `${mainUrl}/project/${projectId}/add-collaborator`,
      body
    );
    return res.data;
  } catch (error) {
    return error;
  }
};

const editProfile = async (body: UserData) => {
  try {
    const res = await api.put(`${mainUrl}/user/edit`, body);
    return res.data;
  } catch (error) {
    return error;
  }
};

const fetchProjects = async (
  pageCount: number,
  sizeCount: number,
  type: string
) => {
  const res = await api.get(
    `${mainUrl}/project?page=${pageCount}&size=${sizeCount}&progress=${type}`
  );
  return res.data;
};

const fetchTemplates = async (pageCount: number, sizeCount: number) => {
  const res = await api.get(
    `${mainUrl}/template?page=${pageCount}&size=${sizeCount}`
  );
  return res.data;
};

const fetchProjectDetail = async (id: string) => {
  const res = await api.get(`${mainUrl}/project/${id}`);
  return res.data.data;
};

const fetchTemplateDetail = async (id: string) => {
  const res = await api.get(`${mainUrl}/template/${id}`);

  return res.data.data;
};

const addChecklistTag = async (id: string, name: string) => {
  const res = await api.post(`${mainUrl}/template/${id}/tag`, { name });
  return res.data;
};

const addChecklistTagItem = async (
  templateId: string,
  checklistTagId: string,
  title: string
) => {
  const res = await api.post(`${mainUrl}/template/${templateId}/checklist`, {
    title,
    tag: checklistTagId,
  });
  return res.data;
};

const deleteChecklistItem = async (
  templateId: string,
  checklistTagId: string
) => {
  const res = await api.delete(
    `${mainUrl}/template/${templateId}/checklist/${checklistTagId}`
  );
  return res.data;
};

const deleteChecklistTag = async (
  templateId: string,
  checklistTagId: string
) => {
  const res = await api.delete(
    `${mainUrl}/template/${templateId}/tag/${checklistTagId}`
  );
  return res.data;
};

const fetchChecklistDetail = async (
  checklistId: string,
  templateId: string
) => {
  const url = `${mainUrl}/template/${templateId}/checklist/${checklistId}`;
  const res = await api.get(url);
  return res.data;
};

const updateChecklistItem = async (
  templateId: string,
  checklistId: string,
  body: { title: string }
) => {
  const res = await api.put(
    `${mainUrl}/template/${templateId}/checklist/${checklistId}`,
    body
  );
  return res.data;
};

const uploadPocImage = async (
  templateId: string,
  checklistId: string,
  objectImage: { file: File; caption: string }
) => {
  const formData = new FormData();
  formData.append("file", objectImage.file);
  formData.append("caption", objectImage.caption);

  const url = `${mainUrl}/template/${templateId}/checklist/${checklistId}/upload`;
  const res = await api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const exportToDocx = async (
  projectId: string,
  body: { client: string; report_type: string }
) => {
  const url = `${mainUrl}/project/${projectId}/export`;
  const res = await api.post(url, body);
  if (res.data.success) {
    const link = document.createElement("a");
    link.download = `${body.client} report`;
console.log(res.data.response.path.replace(
      ".",
      ""
    ));
    link.href = `${mainUrl}${res.data.response.path.replace(
      ".",
      ""
    )}`;
    link.click();
  }

  return res.data;
};

const getRiskMapList = async (  pageCount: number,
  sizeCount: number,
  title:string,
  tag: string,
) => {
  try {
    const res = await api.get(`${mainUrl}/reference/riskmapping?page=${pageCount}&tag=${tag}&size=${sizeCount}&title=${title}`);
    return res.data
  } catch (error) {
    return error;
  }
}

const deleteRiskMap = async (
  riskMapId: string,
) => {
  const res = await api.delete(`${mainUrl}/reference/riskmapping/${riskMapId}`);
  return res.data;
};

const deletePOCImage = async (
  templateId: string,
  checklistId: string,
  imageId: string
) => {
  const url = `${mainUrl}/template/${templateId}/checklist/${checklistId}/upload/${imageId}`;
  const res = await api.delete(url);
  return res.data;
};

// /reference/riskmapping


const toggleChecklist = async (
  templateId: string,
  checklistId: string,
  progress: number
) => {
  const url = `${mainUrl}/template/${templateId}/checklist/${checklistId}`;
  const res = await api.put(url, { progress });
  return res.data;
};

const toggleProject = async (id: string, progress: string) => {
  const res = await api.put(`${mainUrl}/project/${id}`, { progress });
  return res.data;
};

const deleteProject = async (id: string) => {
  try {
    const res = await api.delete(`${mainUrl}/project/${id}`);
    return res.data;
  } catch (error) {
    return { success: false };
  }
};

const deleteTemplate = async (id: string) => {
  const res = await api.delete(`${mainUrl}/template/${id}`);
  return res.data;
};

const moveChecklist = async ({
  templateId,
  body,
}: {
  templateId: string;
  body: ChecklistTag;
}) => {
  const newBody = { checklisttag_id: body.id, checklists: body.checklist };
  const res = await api.post(
    `${mainUrl}/template/${templateId}/checklist/move`,
    newBody
  );
  return res.data;
};

const moveChecklistToAnotherTag = async ({
  templateId,
  body,
}: {
  templateId: string;
  body: unknown;
}) => {
  const res = await api.post(
    `${mainUrl}/template/${templateId}/checklist/movetag`,
    body
  );
  return res.data;
};

const moveTag = async ({
  templateId,
  body,
}: {
  templateId: string;
  body: unknown;
}) => {
  try {
    const res = await api.post(
      `${mainUrl}/template/${templateId}/tag/move`,
      body
    );
    return res.data;
  } catch (error) {
    return error;
  }
};


const updateChecklistTag = async (
  templateId: string,
  tagId: string,
  body: { name: string }
) => {
  const res = await api.put(
    `${mainUrl}/template/${templateId}/tag/${tagId}`,
    body
  );
  return res.data;
};

const updateRiskMap = async (
  riskMapId: string,
  body: {
    "title": string;
    "url": string;
    "tag": string[];
}
) => {
  try {
    const res = await api.put(
      `${mainUrl}/reference/riskmapping/${riskMapId}`,
      body
    );
    return res.data;
    
  } catch (error) {
    return error;
  }
};

const addProject = async (body: {
  target_ip: string[];
  progress: string;
  name: string;
  description: string;
  template_id?: string;
}) => {
  const res = await api.post(`${mainUrl}/project`, body);
  return res.data;
};

const updateProject = async (
  projectId: string,
  body: {
    target_ip: string[] | string;
    target_url: string[] | string;
    progress: string;
    name: string;
    description: string;
  }
) => {
  body = {
    ...body,
    target_ip: body.target_ip === "" ? [] : body.target_ip,
    target_url: body.target_url === "" ? [] : body.target_url,
  };
  const res = await api.put(`${mainUrl}/project/${projectId}`, body);

  return res.data;
};

const updateTemplate = async (
  templateId: string,
  body: {
    target_ip: string[] | string;
    target_url: string[] | string;
    progress: string;
    name: string;
    description: string;
  }
) => {
  body = {
    ...body,
    target_ip: body.target_ip === "" ? [] : body.target_ip,
    target_url: body.target_url === "" ? [] : body.target_url,
  };
  const res = await api.put(
    `${mainUrl}/template/${templateId}`,
    body
  );

  return res.data;
};

const getTemplateList = async () => {
  const res = await api.get(`${mainUrl}/template?type=unfilled`);
  return res.data;
};

const addTemplate = async (body: { name: string; description: string }) => {
  const res = await api.post(`${mainUrl}/template?type=unfilled`, body);
  return res.data;
};
const getReference = async (
  pageCount: number,
  sizeCount: number,
  title: string,
  vulnerability_name: string
) => {
  const url = `${mainUrl}/reference/checklist?page=${pageCount}&size=${sizeCount}&vulnerability_name=${vulnerability_name}&title=${title}`;
  const res = await api.get(url);
  return res.data;
};

export {
  editProfile,
  moveTag,
  updateChecklistTag,
  getReference,
  api,
  updateTemplate,
  updateProject,
  addTemplate,
  deleteTemplate,
  fetchTemplates,
  addProject,
  getTemplateList,
  moveChecklist,
  moveChecklistToAnotherTag,
  fetchProjects,
  fetchProjectDetail,
  fetchTemplateDetail,
  addCollaborator,
  exportToDocx,
  addChecklistTag,
  addChecklistTagItem,
  deleteChecklistItem,
  deleteChecklistTag,
  deleteRiskMap,
  fetchChecklistDetail,
  toggleChecklist,
  toggleProject,
  deleteProject,
  updateChecklistItem,
  uploadPocImage,
  deletePOCImage,
  removeCollaborator,
  getRiskMapList,
  mainUrl,
  updateRiskMap
};
