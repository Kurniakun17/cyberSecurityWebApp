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
}

interface ChecklistTag {
  id: string;
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
  cvss_Score: string;
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
  images: string[]; 
};

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





export type { projectsType, projectDetailType, ChecklistItemType, checklistItemInputT,cvss31ValueT, ChecklistDetailT }