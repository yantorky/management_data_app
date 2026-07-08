import { User, Client, Project, ProjectFolder, ProjectFile, TeamMember, AuditLog } from './types';

// Preloaded Users
export const initialUsers: User[] = [
  {
    id: 'u-1',
    email: 'root_admin@firm.com',
    firstName: 'Yan',
    lastName: 'Torky',
    fullName: 'Yan Torky',
    role: 'ROOT_ADMIN',
    isActive: true,
    lastLogin: '2026-07-06T14:32:00-07:00',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'u-2',
    email: 'project_mgr@firm.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    fullName: 'Sarah Chen',
    role: 'ADMIN',
    isActive: true,
    lastLogin: '2026-07-06T10:15:00-07:00',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'u-3',
    email: 'architect@firm.com',
    firstName: 'Marcus',
    lastName: 'Vance',
    fullName: 'Marcus Vance',
    role: 'USER',
    isActive: true,
    lastLogin: '2026-07-05T09:00:00-07:00',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  }
];

// Preloaded Clients
export const initialClients: Client[] = [
  {
    id: 'c-1',
    name: 'Metropolitan Developers Inc.',
    email: 'contact@metropdev.com',
    phone: '+1 (555) 234-5678',
    website: 'www.metropdev.com',
    address: '452 Broadway, Suite 10, New York, NY 10013',
    industry: 'Real Estate Development',
    companySize: '100-500 employees',
    status: 'ACTIVE',
    notes: 'Primary developer client. Highly active, handles mixed-use residential projects.',
    createdBy: 'u-1',
    createdAt: '2026-01-15T08:30:00Z',
  },
  {
    id: 'c-2',
    name: 'Genesis Healthcare Partners',
    email: 'facilities@genesishealth.org',
    phone: '+1 (555) 876-5432',
    website: 'www.genesishealth.org',
    address: '100 Medical Plaza, Chicago, IL 60611',
    industry: 'Healthcare & Biotech',
    companySize: '1000+ employees',
    status: 'ACTIVE',
    notes: 'Institutional client. Focuses on regional medical clinic renovations and hospital wings.',
    createdBy: 'u-2',
    createdAt: '2026-02-20T11:00:00Z',
  },
  {
    id: 'c-3',
    name: 'Aether Capital Holdings',
    email: 'info@aethercap.com',
    phone: '+1 (555) 443-2211',
    website: 'www.aethercap.com',
    address: '12 Marina Blvd, Financial District, San Francisco, CA 94111',
    industry: 'Financial Services',
    companySize: '50-100 employees',
    status: 'ACTIVE',
    notes: 'Premium commercial client, developing sustainable office spaces and boutique headquarters.',
    createdBy: 'u-1',
    createdAt: '2026-03-05T14:20:00Z',
  }
];

// Preloaded Projects
export const initialProjects: Project[] = [
  {
    id: 'p-1',
    name: 'Elysium Residential Tower',
    description: 'A 32-story luxury residential building targeting LEED Platinum certification with mixed-use ground level retail, public plazas, and subterranean parking.',
    code: 'MDA-ELY-01',
    type: 'CURRENT',
    status: 'DESIGN',
    clientId: 'c-1',
    startDate: '2026-02-01',
    endDate: '2028-06-30',
    estimatedCompletion: '2028-05-15',
    projectManagerId: 'u-2',
    location: 'Brooklyn, NY',
    totalArea: 285000,
    budget: 85000000,
    priority: 'HIGH',
    buildingType: 'Mixed-Use Residential',
    sector: 'Residential',
    folderStructureInitialized: true,
    createdAt: '2026-01-20T09:00:00Z'
  },
  {
    id: 'p-2',
    name: 'Genesis Medical Plaza Wing B',
    description: 'Renovation and expansion of the main surgical and critical care wing at Genesis Medical Center, utilizing strict bio-hazard containment protocols and BIM-integrated planning.',
    code: 'MDA-GEN-M2',
    type: 'CURRENT',
    status: 'CONSTRUCTION',
    clientId: 'c-2',
    startDate: '2026-03-10',
    endDate: '2027-04-30',
    estimatedCompletion: '2027-04-15',
    projectManagerId: 'u-2',
    location: 'Chicago, IL',
    totalArea: 64000,
    budget: 2450000,
    priority: 'CRITICAL',
    buildingType: 'Hospital / Healthcare',
    sector: 'Healthcare',
    folderStructureInitialized: true,
    createdAt: '2026-02-25T10:30:00Z'
  },
  {
    id: 'p-3',
    name: 'Aether Capital Carbon-Neutral HQ',
    description: 'Feasibility study and concept development for a mass-timber high-rise headquarters, featuring net-zero operational carbon, biophilic green facades, and smart grid automation.',
    code: 'MDA-AET-HQ',
    type: 'POTENTIAL',
    status: 'PLANNING',
    clientId: 'c-3',
    startDate: '2026-07-15',
    endDate: '2026-11-30',
    estimatedCompletion: '2026-11-15',
    projectManagerId: 'u-1',
    location: 'San Francisco, CA',
    totalArea: 120000,
    budget: 42000000,
    priority: 'MEDIUM',
    buildingType: 'Office Headquarters',
    sector: 'Commercial',
    folderStructureInitialized: false,
    createdAt: '2026-06-10T11:45:00Z'
  }
];

// Helper to generate ISO 19650 folder set
export function generateISO19650Folders(projectId: string, createdBy: string): ProjectFolder[] {
  const folders: { name: string; folderCode: string; cat: typeof initialFolders[number]['cat'] }[] = [
    { name: '00 Admin & Management', folderCode: '00-ADM', cat: '00_Admin' },
    { name: '10 General & Contracts', folderCode: '10_GEN', cat: '10_General' },
    { name: '20 Design & Concepts', folderCode: '20_DES', cat: '20_Design' },
    { name: '30 Technical & Specs', folderCode: '30_TEC', cat: '30_Technical' },
    { name: '40 Tender Packages', folderCode: '40_TEN', cat: '40_Tender' },
    { name: '50 Construction Records', folderCode: '50_CON', cat: '50_Construction' },
    { name: '60 As-Built drawings', folderCode: '60_ASB', cat: '60_As-Built' },
    { name: '70 Operations & Manuals', folderCode: '70_OPR', cat: '70_Operation' }
  ];

  return folders.map((f, index) => ({
    id: `${projectId}-f-${index + 1}`,
    projectId,
    parentFolderId: null,
    name: f.name,
    folderCode: f.folderCode,
    hierarchyLevel: 1,
    isoCategory: f.cat,
    folderPath: `/${f.folderCode}`,
    visibility: 'TEAM',
    createdAt: new Date().toISOString(),
    createdBy
  }));
}

const initialFolders = [
  { name: '00 Admin & Management', folderCode: '00-ADM', cat: '00_Admin' as const },
  { name: '10 General & Contracts', folderCode: '10_GEN', cat: '10_General' as const },
  { name: '20 Design & Concepts', folderCode: '20_DES', cat: '20_Design' as const },
  { name: '30 Technical & Specs', folderCode: '30_TEC', cat: '30_Technical' as const },
  { name: '40 Tender Packages', folderCode: '40_TEN', cat: '40_Tender' as const },
  { name: '50 Construction Records', folderCode: '50_CON', cat: '50_Construction' as const },
  { name: '60 As-Built drawings', folderCode: '60_ASB', cat: '60_As-Built' as const },
  { name: '70 Operations & Manuals', folderCode: '70_OPR', cat: '70_Operation' as const }
];

// Initial preloaded folders for project 1 and 2
export const initialFoldersList: ProjectFolder[] = [
  ...initialFolders.map((f, i) => ({
    id: `p-1-f-${i + 1}`,
    projectId: 'p-1',
    parentFolderId: null,
    name: f.name,
    folderCode: f.folderCode,
    hierarchyLevel: 1,
    isoCategory: f.cat,
    folderPath: `/${f.folderCode}`,
    visibility: 'TEAM' as const,
    createdAt: '2026-02-05T09:00:00Z',
    createdBy: 'u-2'
  })),
  ...initialFolders.map((f, i) => ({
    id: `p-2-f-${i + 1}`,
    projectId: 'p-2',
    parentFolderId: null,
    name: f.name,
    folderCode: f.folderCode,
    hierarchyLevel: 1,
    isoCategory: f.cat,
    folderPath: `/${f.folderCode}`,
    visibility: 'TEAM' as const,
    createdAt: '2026-03-12T10:00:00Z',
    createdBy: 'u-2'
  }))
];

// Preloaded files in project 1 folder 3 (20 Design & Concepts)
export const initialFilesList: ProjectFile[] = [
  {
    id: 'file-1',
    projectId: 'p-1',
    folderId: 'p-1-f-3', // 20_Design
    originalFilename: 'MDA-ELY-ZZ-XX-DR-A-0001-S3-P01.dwg',
    fileExtension: 'dwg',
    mimeType: 'image/vnd.dwg',
    fileSize: 4241024,
    version: 2,
    isLatest: true,
    uploadedBy: 'u-3',
    uploadedByName: 'Marcus Vance',
    checksum: '6e1a478c9d0b641f22b88f3a5a782cb90e6e73cb88a4c00ef26d9e51fa241775',
    accessLevel: 'TEAM',
    isArchived: false,
    createdAt: '2026-05-14T11:20:00Z',
    description: 'Ground Floor lobby layout, revised following review comments on acoustics.',
    versions: [
      {
        version: 1,
        storedFilename: 'p1_f3_MDA-ELY-ZZ-XX-DR-A-0001-S3-P01_v1.dwg',
        fileSize: 4192000,
        uploadedBy: 'u-3',
        uploadedByName: 'Marcus Vance',
        checksum: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        createdAt: '2026-02-12T14:30:00Z',
        storageLocation: 'S3'
      },
      {
        version: 2,
        storedFilename: 'p1_f3_MDA-ELY-ZZ-XX-DR-A-0001-S3-P01_v2.dwg',
        fileSize: 4241024,
        uploadedBy: 'u-3',
        uploadedByName: 'Marcus Vance',
        checksum: '6e1a478c9d0b641f22b88f3a5a782cb90e6e73cb88a4c00ef26d9e51fa241775',
        createdAt: '2026-05-14T11:20:00Z',
        storageLocation: 'S3'
      }
    ]
  },
  {
    id: 'file-2',
    projectId: 'p-1',
    folderId: 'p-1-f-3', // 20_Design
    originalFilename: 'MDA-ELY-01-XX-RP-A-0023-S2-P02.pdf',
    fileExtension: 'pdf',
    mimeType: 'application/pdf',
    fileSize: 1845110,
    version: 1,
    isLatest: true,
    uploadedBy: 'u-2',
    uploadedByName: 'Sarah Chen',
    checksum: '8b7f2323f99aa091bc2e341512bf60601a91e3ca2918bc289bca7a918a241bb2',
    accessLevel: 'CLIENT',
    isArchived: false,
    createdAt: '2026-04-10T16:45:00Z',
    description: 'Architectural schematic design report for client approval.',
    versions: [
      {
        version: 1,
        storedFilename: 'p1_f3_MDA-ELY-01-XX-RP-A-0023-S2-P02_v1.pdf',
        fileSize: 1845110,
        uploadedBy: 'u-2',
        uploadedByName: 'Sarah Chen',
        checksum: '8b7f2323f99aa091bc2e341512bf60601a91e3ca2918bc289bca7a918a241bb2',
        createdAt: '2026-04-10T16:45:00Z',
        storageLocation: 'S3'
      }
    ]
  },
  {
    id: 'file-3',
    projectId: 'p-1',
    folderId: 'p-1-f-1', // 00_Admin
    originalFilename: 'Project-Brief-Signed-2026.docx',
    fileExtension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    fileSize: 521000,
    version: 1,
    isLatest: true,
    uploadedBy: 'u-1',
    uploadedByName: 'Yan Torky',
    checksum: 'bcde710a99182a39b2e35181ca6e81ea19e1e3b092bc2818617ba812e342cbcc',
    accessLevel: 'TEAM',
    isArchived: false,
    createdAt: '2026-01-25T10:00:00Z',
    description: 'Official signed project brief defining total area and target LEED credits.',
    versions: [
      {
        version: 1,
        storedFilename: 'p1_f1_Project-Brief-Signed-2026_v1.docx',
        fileSize: 521000,
        uploadedBy: 'u-1',
        uploadedByName: 'Yan Torky',
        checksum: 'bcde710a99182a39b2e35181ca6e81ea19e1e3b092bc2818617ba812e342cbcc',
        createdAt: '2026-01-25T10:00:00Z',
        storageLocation: 'LOCAL'
      }
    ]
  }
];

// Preloaded Team Members
export const initialTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    projectId: 'p-1',
    userId: 'u-2',
    role: 'PROJECT_MANAGER',
    canEdit: true,
    canDelete: true,
    canShare: true,
    canApprove: true,
    startDate: '2026-01-20',
    addedBy: 'u-1'
  },
  {
    id: 'tm-2',
    projectId: 'p-1',
    userId: 'u-3',
    role: 'ARCHITECT',
    canEdit: true,
    canDelete: false,
    canShare: false,
    canApprove: false,
    startDate: '2026-02-01',
    addedBy: 'u-2'
  },
  {
    id: 'tm-3',
    projectId: 'p-2',
    userId: 'u-2',
    role: 'PROJECT_MANAGER',
    canEdit: true,
    canDelete: true,
    canShare: true,
    canApprove: true,
    startDate: '2026-02-25',
    addedBy: 'u-1'
  }
];

// Preloaded Audit Logs
export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'u-1',
    userEmail: 'root_admin@firm.com',
    action: 'LOGIN',
    entityType: 'USER',
    entityId: 'u-1',
    entityName: 'Yan Torky',
    description: 'User logged in successfully.',
    status: 'SUCCESS',
    timestamp: '2026-07-06T14:32:00-07:00',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-2',
    userId: 'u-3',
    userEmail: 'architect@firm.com',
    action: 'UPLOAD',
    entityType: 'FILE',
    entityId: 'file-1',
    entityName: 'MDA-ELY-ZZ-XX-DR-A-0001-S3-P01.dwg',
    description: 'Uploaded file version 2 to folder 20 Design & Concepts.',
    newValues: JSON.stringify({ version: 2, fileSize: 4241024, folder: '20_Design' }),
    status: 'SUCCESS',
    timestamp: '2026-05-14T11:20:00Z',
    ipAddress: '192.168.1.92'
  },
  {
    id: 'log-3',
    userId: 'u-2',
    userEmail: 'project_mgr@firm.com',
    action: 'CREATE',
    entityType: 'PROJECT',
    entityId: 'p-2',
    entityName: 'Genesis Medical Plaza Wing B',
    description: 'Created a new project and initialized its ISO 19650 compliant folder tree.',
    newValues: JSON.stringify({ code: 'MDA-GEN-M2', type: 'CURRENT', budget: 2450000 }),
    status: 'SUCCESS',
    timestamp: '2026-02-25T10:30:00Z',
    ipAddress: '192.168.1.104'
  }
];
