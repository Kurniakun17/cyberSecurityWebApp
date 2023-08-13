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

interface ChecklistItem {
  id: string;
  type: string;
  progress: number;
  title: string;
  severity_level: string;
}

interface ChecklistTag {
  id: string;
  name: string;
  checklist: ChecklistItem[];
}

interface Template {
  id: string;
  name: string;
  checklist_tag: ChecklistTag[];
}

interface projectDetail {
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



export type { projectsType, projectDetail }