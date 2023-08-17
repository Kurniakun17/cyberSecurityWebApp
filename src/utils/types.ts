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



export type { projectsType, projectDetailType, ChecklistItemType }