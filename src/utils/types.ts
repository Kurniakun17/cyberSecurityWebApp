type projectsType={
  "id": string,
  "name": string,
  "description": string,
  "target_url": string,
  "target_ip": string,
  "progress": string,
  "template_id": string,
  "createdAt": string,
  "updatedAt": string
};

interface ChecklistItemType {
  id: string;
  type: string;
  progress: number;
  title: string;
  severity_level: string;
  priority: number;
}

interface ChecklistTag {
  id: string;
  priority: number;
  name: string;
  checklist: ChecklistItemType[];
}

interface Template {
  id: string;
  name: string;
  checklist_tag: ChecklistTag[];
}

type projectDetailType = {
  done_checklist: number;
  total_checklist: number;
  total_vulnerability: number;
  total_narrative: number;
  critical_vuln: number;
  high_vuln: number;
  medium_vuln: number;
  low_vuln: number;
  informational_vuln: number;
  id: string;
  name: string;
  description: string;
  target_url: string[];
  target_ip: string[];
  progress: string;
  template_id: string;
  createdAt: string;
  updatedAt: string;
  template: Template;
  project_user: userCollaborator[]
  publish: boolean;
}

type userCollaborator = {
  id: string;
  role: string;
  user_id: string;
  user: {
    username: string
  }
};

type templateDetailType = {
  "id": string,
  "name": string,
  "description": string,
  "type": string,
  "createdAt": string,
  "updatedAt": string,
  "checklist_tag": ChecklistTag[],
  "target_ip": string[],
  "target_url": string[],
}

type cvss31ValueT = {
    AV: 'Network' | 'Adjacent' | 'Local' | 'Physical';
    AC: 'High' | 'Low';
    UI: 'None' | 'Required';
    S: 'Unchanged' | 'Changed';
    PR: 'None' | 'Low' | 'High';
    C: 'None' | 'Low' | 'High';
    I: 'None' | 'Low' | 'High';
    A: 'None' | 'Low' | 'High';
  severity_level: '' | 'Informational'|'None' | 'Low' | 'Medium' | 'High' | 'Critical';
  }

type ChecklistDetailT = {
  id: string;
  type: string;
  progress: number;
  title: string;
  description: string;
  best_practice: string;
  vulnerability_name: string;
  vulnerability_description: string;
  generate_to_word: boolean;
  category: string;
  cvss_score: number;
  severity_level: string;
  attack_vector: string;
  attack_complexity: string;
  privilege_required: string;
  user_interaction: string;
  scope: string;
  confidentiality: string;
  integrity: string;
  availability: string;
  status: string;
  affected_target: string;
  reference: string;
  capec_owasp_cwe: string;
  impact: string;
  recommendation: string;
  poc: string;
  checklisttag_id: string;
  createdAt: string;
  updatedAt: string;
  images: Image[]; 
};

type Image = {
  id: string;
  file_name: string;
  file_caption: string;
  file_type: string;
  file_path: string;
  checklist_id: string;
  project_id: string | null;
  createdAt: string;
  updatedAt: string;
};

type userDataT = {
  username: string;
  password: string;
  id:string;
  email: string;
  phone: string;
  name:  string;
  admin: boolean;
}

interface checklistItemInputT {
    title: string;
    type: string;
    progress: number;
    description: string;
    generate_to_word: boolean;
    best_practice: string;
    poc: string;
    affected_target: string| string[];
    reference: string|string[];
    capec_owasp_cwe: string|string[];
    vulnerability_name: string;
    vulnerability_description: string;
    cvss_score: number;
    impact: string;
    recommendation: string;
    status: string;
    attack_vector? : 'Network' | 'Adjacent' | 'Local' | 'Physical';
    attack_complexity? : 'High' | 'Low';
    user_interaction?: 'None' | 'Required';
    scope?: 'Unchanged' | 'Changed';
    privilege_required?: 'None' | 'Low' | 'High';
    confidentiality?: 'None' | 'Low' | 'High';
    integrity?: 'None' | 'Low' | 'High';
    availability?: 'None' | 'Low' | 'High';
}

type templatesT= {
      totalPages: number,
    currentPage: number,
    items: templateType[],
}

type templateType = {
    id: string,
    name: string,
    description: string,
    type: string,
    createdAt: string,
    updatedAt: string,

}

type UserData = {
  id: string,
  username: string,
  admin: boolean,
  email: string,
  phone: string,
  name: string,
}

type Reference = {
  items: ChecklistDetailT[],
  success: boolean,
  totalItems: number,
  currentPage: number,
  totalPages: number,
}



export type {templatesT, userDataT, Reference, UserData, templateType, templateDetailType, Image, projectsType, ChecklistTag,projectDetailType, ChecklistItemType, checklistItemInputT,cvss31ValueT, ChecklistDetailT }