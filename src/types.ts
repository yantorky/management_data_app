export type UserRole = 'ROOT_ADMIN' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  avatarUrl?: string;
  password?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  industry: string;
  companySize: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  notes: string;
  createdBy: string;
  createdAt: string;
}

export type ProjectType = 'CURRENT' | 'POTENTIAL';

export type ProjectStatus = 
  | 'PLANNING' 
  | 'DESIGN' 
  | 'TENDER' 
  | 'CONSTRUCTION' 
  | 'COMPLETED' 
  | 'ARCHIVED';

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Project {
  id: string;
  name: string;
  description: string;
  code: string;
  type: ProjectType;
  status: ProjectStatus;
  clientId: string;
  startDate: string;
  endDate: string;
  estimatedCompletion: string;
  projectManagerId: string;
  location: string;
  totalArea: number; // in sq ft
  budget: number; // in USD
  priority: ProjectPriority;
  buildingType: string;
  sector: string;
  folderStructureInitialized: boolean;
  createdAt: string;
}

export type ISOCategory = 
  | '00_Admin' 
  | '10_General' 
  | '20_Design' 
  | '30_Technical' 
  | '40_Tender' 
  | '50_Construction' 
  | '60_As-Built' 
  | '70_Operation' 
  | 'CUSTOM';

export interface ProjectFolder {
  id: string;
  projectId: string;
  parentFolderId: string | null;
  name: string;
  folderCode: string;
  hierarchyLevel: number;
  isoCategory: ISOCategory;
  folderPath: string;
  visibility: 'TEAM' | 'CLIENT' | 'PUBLIC';
  createdAt: string;
  createdBy: string;
}

export interface FileVersion {
  version: number;
  storedFilename: string;
  fileSize: number;
  uploadedBy: string;
  uploadedByName: string;
  checksum: string;
  createdAt: string;
  storageLocation: 'LOCAL' | 'S3' | 'GCS';
}

export interface ProjectFile {
  id: string;
  projectId: string;
  folderId: string;
  originalFilename: string;
  fileExtension: string;
  mimeType: string;
  fileSize: number;
  version: number;
  isLatest: boolean;
  uploadedBy: string;
  uploadedByName: string;
  checksum: string;
  accessLevel: 'PRIVATE' | 'TEAM' | 'CLIENT' | 'PUBLIC';
  isArchived: boolean;
  createdAt: string;
  description: string;
  versions: FileVersion[];
}

export type TeamMemberRole = 
  | 'PROJECT_MANAGER' 
  | 'ARCHITECT' 
  | 'ENGINEER' 
  | 'TECHNICIAN' 
  | 'INTERN' 
  | 'CONSULTANT';

export interface TeamMember {
  id: string;
  projectId: string;
  userId: string;
  role: TeamMemberRole;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canApprove: boolean;
  startDate: string;
  addedBy: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: 'LOGIN' | 'LOGOUT' | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'SHARE' | 'UPLOAD' | 'DOWNLOAD' | 'ARCHIVE';
  entityType: 'USER' | 'CLIENT' | 'PROJECT' | 'FOLDER' | 'FILE' | 'TEAM_MEMBER';
  entityId: string;
  entityName: string;
  oldValues?: string; // stringified JSON
  newValues?: string; // stringified JSON
  description: string;
  status: 'SUCCESS' | 'FAILED';
  errorMessage?: string;
  timestamp: string;
  ipAddress: string;
}
