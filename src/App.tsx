import React, { useState, useEffect } from 'react';
import {
  Building2,
  FolderTree,
  ShieldCheck,
  FileText,
  UserCheck,
  History,
  Briefcase,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Search,
  Upload,
  Download,
  Info,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Edit3,
  UserPlus,
  AlertCircle,
  FileCode,
  ArrowRight,
  Database,
  Lock,
  Globe,
  Settings,
  HelpCircle,
  X,
  BookOpen,
  HardDrive,
  Server,
  Key,
  Printer,
  FileText as FileIcon
} from 'lucide-react';
import {
  initialUsers,
  initialClients,
  initialProjects,
  initialFoldersList,
  initialFilesList,
  initialTeamMembers,
  initialAuditLogs,
  generateISO19650Folders
} from './mockData';
import {
  User,
  Client,
  Project,
  ProjectFolder,
  ProjectFile,
  TeamMember,
  AuditLog,
  UserRole,
  ProjectType,
  ProjectStatus,
  ProjectPriority,
  ISOCategory
} from './types';
import { translations, Language } from './i18n';
// @ts-ignore
import torkyLogoWatermark from './assets/images/torky_logo_1784381159887.jpg';

export default function App() {
  // Load State from LocalStorage or Fallback to preloads
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mda_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('mda_current_user');
    if (saved) return JSON.parse(saved);
    return initialUsers[0]; // default to Yan Torky (ROOT_ADMIN)
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('mda_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('mda_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [folders, setFolders] = useState<ProjectFolder[]>(() => {
    const saved = localStorage.getItem('mda_folders');
    return saved ? JSON.parse(saved) : initialFoldersList;
  });

  const [files, setFiles] = useState<ProjectFile[]>(() => {
    const saved = localStorage.getItem('mda_files');
    return saved ? JSON.parse(saved) : initialFilesList;
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('mda_team_members');
    return saved ? JSON.parse(saved) : initialTeamMembers;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('mda_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Status Instalasi Awal Sistem (Verifikasi Lisensi & Inisialisasi)
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    const installed = localStorage.getItem('mda_installed') === 'true';
    if (!installed) return false;
    
    // Verifikasi kriptografis untuk mencegah modifikasi lokal/cracking localStorage
    const savedKey = localStorage.getItem('mda_license_key') || '';
    const companyName = localStorage.getItem('mda_company_name') || '';
    const sambaConfigRaw = localStorage.getItem('mda_samba_config');
    
    if (!savedKey || !companyName || !sambaConfigRaw) {
      return false; // Ada data konfigurasi yang tidak lengkap, tolak inisialisasi
    }
    
    let serverIp = '192.168.1.150';
    let poolName = 'ArchPoolNAS';
    try {
      const parsed = JSON.parse(sambaConfigRaw);
      serverIp = parsed.serverIp || '192.168.1.150';
      poolName = parsed.poolName || 'ArchPoolNAS';
    } catch (e) {
      return false;
    }
    
    // Hitung ulang Machine ID dan Kunci Lisensi Kriptografis yang diharapkan
    const cleanCompany = companyName.substring(0, 4).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const cleanIp = serverIp.replace(/\./g, '');
    const cleanPool = poolName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const mId = `MDA-HW-${cleanCompany}-${cleanIp}-${cleanPool}`;
    
    const base = mId.split('').reverse().join('');
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = (hash << 5) - hash + base.charCodeAt(i);
      hash |= 0;
    }
    const hexHash = Math.abs(hash).toString(16).toUpperCase();
    const expectedKey = `TORKY-SECURE-2026-MDA-${hexHash}`;
    
    // Lisensi harus benar-benar cocok, mencegah bypass lewat devtools
    return savedKey === expectedKey;
  });

  // Multilanguage state (Default US English: 'EN')
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('mda_language') as Language) || 'EN';
  });

  // Regional, Timezone & Licensing Security Settings (Torky Komputer Security Engine)
  const [region, setRegion] = useState<string>(() => {
    return localStorage.getItem('mda_region') || 'Indonesia';
  });
  const [timezone, setTimezone] = useState<string>(() => {
    return localStorage.getItem('mda_timezone') || 'WITA';
  });
  const [licenseKey, setLicenseKey] = useState<string>(() => {
    return localStorage.getItem('mda_license_key') || '';
  });
  const [companyName, setCompanyName] = useState<string>(() => {
    return localStorage.getItem('mda_company_name') || '';
  });

  const [setupData, setSetupData] = useState({
    companyName: '',
    superAdminEmail: '',
    superAdminName: '',
    superAdminPassword: '',
    confirmPassword: '',
    sambaIp: '',
    sambaPool: '',
    infrastructureMode: 'TRUENAS' as 'TRUENAS' | 'LOCAL',
    region: 'Indonesia',
    timezone: 'WITA',
    licenseKey: ''
  });

  // Helper Kriptografi & Sidik Jari Perangkat (Torky Komputer Security Engine)
  const generateMachineId = (company: string, ip: string, pool: string) => {
    const cleanCompany = (company || 'MDA').substring(0, 4).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const cleanIp = (ip || '127001').replace(/\./g, '');
    const cleanPool = (pool || 'POOL').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `MDA-HW-${cleanCompany}-${cleanIp}-${cleanPool}`;
  };

  const generateLicenseFromMachineId = (mId: string) => {
    const base = mId.split('').reverse().join('');
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = (hash << 5) - hash + base.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    const hexHash = Math.abs(hash).toString(16).toUpperCase();
    return `TORKY-SECURE-2026-MDA-${hexHash}`;
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };


  const [copyFeedback, setCopyFeedback] = useState(false);

  const [showSetupPassword, setShowSetupPassword] = useState(false);
  const [showSetupConfirmPassword, setShowSetupConfirmPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Modal Konfirmasi Hapus dengan Otentikasi Password Super Admin / Admin (Sistem Proteksi Data)
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    type: 'FILE' | 'PROJECT' | 'CLIENT' | 'MEMBER';
    name: string;
    onConfirm: () => void;
  } | null>(null);
  const [deleteAuthPassword, setDeleteAuthPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Metode Pengelolaan Referensi Eksternal AutoCAD Xref (ISO 19650)
  const [xrefMethod, setXrefMethod] = useState<'RELATIVE' | 'SHARED'>('RELATIVE');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mda_authenticated') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // TrueNAS Samba config state
  const [sambaConfig, setSambaConfig] = useState(() => {
    const saved = localStorage.getItem('mda_samba_config');
    return saved ? JSON.parse(saved) : {
      serverIp: '192.168.1.150',
      poolName: 'ArchPoolNAS',
      mappedStatus: 'MAPPED' as 'MAPPED' | 'UNMAPPED' | 'DISCONNECTED',
      lastHealthCheck: new Date().toISOString(),
      infrastructureMode: 'TRUENAS' as 'TRUENAS' | 'LOCAL'
    };
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'projects' | 'samba' | 'sandbox' | 'logs' | 'manual'>('dashboard');
  
  // Selection and Modal States
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('p-1');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('p-1-f-3'); // Design
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddFile, setShowAddFile] = useState(false);
  
  // Search & Filter state
  const [projectSearch, setProjectSearch] = useState('');
  const [projectTypeFilter, setProjectTypeFilter] = useState<'ALL' | ProjectType>('ALL');
  const [clientSearch, setClientSearch] = useState('');
  const [logActionFilter, setLogActionFilter] = useState<string>('ALL');

  // Input states for Add Forms
  const [newClient, setNewClient] = useState({
    name: '', email: '', phone: '', website: '', address: '', industry: '', companySize: '50-100 employees', notes: ''
  });
  const [newProject, setNewProject] = useState({
    name: '', description: '', code: '', type: 'CURRENT' as ProjectType, clientId: '',
    startDate: '', endDate: '', estimatedCompletion: '', location: '', totalArea: '',
    budget: '', priority: 'MEDIUM' as ProjectPriority, buildingType: '', sector: 'Residential'
  });
  const [newMember, setNewMember] = useState({
    userId: '', role: 'ARCHITECT' as any
  });
  const [newFileData, setNewFileData] = useState({
    name: '', description: '', versionStr: 'P01.01', suitabilityCode: 'S2', accessLevel: 'TEAM' as any, fileObj: null as File | null
  });

  // Drag over visual state
  const [isDragOver, setIsDragOver] = useState(false);

  // Recruitment Sandbox state
  const [rawNotes, setRawNotes] = useState(
    "We need a Senior BIM Manager for our NYC residential tower project. " +
    "Must have 8+ years of experience in Autodesk Revit, Navisworks, and ISO 19650 standards. " +
    "They should lead multi-disciplinary clash detection, coordinate with structural engineers, and train staff. " +
    "Strong leadership, collaborative mindset, and Revit API experience are major pluses."
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [interviewGuide, setInterviewGuide] = useState('');
  const [aiError, setAiError] = useState('');

  // ISO 19650 File Naming Builder state
  const [namingBuilder, setNamingBuilder] = useState({
    project: 'PRJ1',
    originator: 'MDA',
    volume: 'ZZ',
    level: 'XX',
    type: 'DR',
    role: 'A',
    number: '0001',
    suitability: 'S2',
    revision: 'P01.01'
  });

  const t = translations[language];

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('mda_users', JSON.stringify(users));
    localStorage.setItem('mda_current_user', JSON.stringify(currentUser));
    localStorage.setItem('mda_clients', JSON.stringify(clients));
    localStorage.setItem('mda_projects', JSON.stringify(projects));
    localStorage.setItem('mda_folders', JSON.stringify(folders));
    localStorage.setItem('mda_files', JSON.stringify(files));
    localStorage.setItem('mda_team_members', JSON.stringify(teamMembers));
    localStorage.setItem('mda_audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem('mda_samba_config', JSON.stringify(sambaConfig));
    localStorage.setItem('mda_authenticated', String(isAuthenticated));
    localStorage.setItem('mda_installed', String(isInstalled));
    localStorage.setItem('mda_language', language);
    localStorage.setItem('mda_region', region);
    localStorage.setItem('mda_timezone', timezone);
    localStorage.setItem('mda_license_key', licenseKey);
  }, [users, currentUser, clients, projects, folders, files, teamMembers, auditLogs, sambaConfig, isAuthenticated, isInstalled, language, region, timezone, licenseKey]);

  // Log an Audit Event helper
  const addAuditLog = (
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    entityName: string,
    description: string,
    newValues?: any,
    oldValues?: any
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      action,
      entityType,
      entityId,
      entityName,
      oldValues: oldValues ? JSON.stringify(oldValues) : undefined,
      newValues: newValues ? JSON.stringify(newValues) : undefined,
      description,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.100'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Quick switch active user (demonstrate RBAC)
  const handleUserSwitch = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      addAuditLog('LOGIN', 'USER', targetUser.id, targetUser.fullName, `User switched session context to ${targetUser.fullName} (${targetUser.role})`);
    }
  };

  // Create Client
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name) return;

    const clientId = `c-${Date.now()}`;
    const clientRecord: Client = {
      id: clientId,
      name: newClient.name,
      email: newClient.email || 'n/a',
      phone: newClient.phone || 'n/a',
      website: newClient.website || 'n/a',
      address: newClient.address || 'n/a',
      industry: newClient.industry || 'n/a',
      companySize: newClient.companySize,
      status: 'ACTIVE',
      notes: newClient.notes,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };

    setClients(prev => [...prev, clientRecord]);
    addAuditLog('CREATE', 'CLIENT', clientId, clientRecord.name, `Created client ${clientRecord.name}`, clientRecord);
    
    // Reset Form
    setNewClient({
      name: '', email: '', phone: '', website: '', address: '', industry: '', companySize: '50-100 employees', notes: ''
    });
    setShowAddClient(false);
  };

  // Create Project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.code || !newProject.clientId) return;

    const projId = `p-${Date.now()}`;
    const projectRecord: Project = {
      id: projId,
      name: newProject.name,
      description: newProject.description,
      code: newProject.code.toUpperCase(),
      type: newProject.type,
      status: 'PLANNING',
      clientId: newProject.clientId,
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      endDate: newProject.endDate || '',
      estimatedCompletion: newProject.estimatedCompletion || '',
      projectManagerId: newProject.projectManagerId || currentUser.id,
      location: newProject.location,
      totalArea: Number(newProject.totalArea) || 0,
      budget: Number(newProject.budget) || 0,
      priority: newProject.priority,
      buildingType: newProject.buildingType,
      sector: newProject.sector,
      folderStructureInitialized: false,
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, projectRecord]);
    addAuditLog('CREATE', 'PROJECT', projId, projectRecord.name, `Created project ${projectRecord.name}`, projectRecord);

    // Automatically add current user as Project Manager in team_members
    const memberId = `tm-${Date.now()}`;
    const managerMember: TeamMember = {
      id: memberId,
      projectId: projId,
      userId: projectRecord.projectManagerId,
      role: 'PROJECT_MANAGER',
      canEdit: true,
      canDelete: true,
      canShare: true,
      canApprove: true,
      startDate: projectRecord.startDate,
      addedBy: currentUser.id
    };
    setTeamMembers(prev => [...prev, managerMember]);

    // Reset Form
    setNewProject({
      name: '', description: '', code: '', type: 'CURRENT', clientId: '',
      startDate: '', endDate: '', estimatedCompletion: '', location: '', totalArea: '',
      budget: '', priority: 'MEDIUM', buildingType: '', sector: 'Residential'
    });
    setShowAddProject(false);
    setSelectedProjectId(projId);
  };

  // Mempromosikan Proyek Potensial (Potential) ke Proyek Aktif (Current) serta menginisialisasi folder ISO 19650
  const handlePromoteProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    
    // Update tipe proyek ke CURRENT dan aktifkan struktur foldernya
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, type: 'CURRENT', folderStructureInitialized: true };
      }
      return p;
    }));
    
    // Auto-generate struktur folder ISO 19650
    const existingFolders = folders.filter(f => f.projectId === projectId);
    if (existingFolders.length === 0) {
      const generated = generateISO19650Folders(projectId, currentUser.fullName);
      setFolders(prev => [...prev, ...generated]);
      setSelectedFolderId(generated[2]?.id || generated[0]?.id || null);
    } else {
      setSelectedFolderId(existingFolders[2]?.id || existingFolders[0]?.id || null);
    }

    addAuditLog('UPDATE', 'PROJECT', projectId, proj.name, `Mempromosikan proyek potensial ${proj.name} menjadi Proyek Aktif dan menginisialisasi folder ISO 19650.`);
    alert(`Proyek ${proj.name} (${proj.code}) berhasil dipromosikan ke tahap Proyek Aktif (CURRENT)! Struktur direktori kepatuhan ISO 19650 dan alokasi datasheet Projects di server TrueNAS telah berhasil diinisialisasi.`);
  };

  // Initialize ISO 19650 Folder Hierarchy
  const handleInitializeFolders = (projId: string) => {
    // Check permissions (Only Root Admin and PM/Admins can initialize)
    if (currentUser.role === 'USER') {
      alert('Permission Denied: Only project managers or root administrators can initialize document hierarchies.');
      return;
    }

    const newFolders = generateISO19650Folders(projId, currentUser.id);
    setFolders(prev => [...prev, ...newFolders]);
    
    // Update Project Status
    setProjects(prev => prev.map(p => p.id === projId ? { ...p, folderStructureInitialized: true } : p));
    
    const proj = projects.find(p => p.id === projId);
    addAuditLog('CREATE', 'FOLDER', projId, proj?.name || '', `Initialized ISO 19650 folder structure for project ${proj?.name}`);
    
    setSelectedFolderId(newFolders[2].id); // select 20 Design & Concepts by default
  };

  // Add Team Member to Project
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !newMember.userId) return;

    // Check duplicates
    if (teamMembers.some(m => m.projectId === selectedProjectId && m.userId === newMember.userId)) {
      alert('This user is already a member of this project.');
      return;
    }

    const memberId = `tm-${Date.now()}`;
    const userObj = users.find(u => u.id === newMember.userId);
    const addedMember: TeamMember = {
      id: memberId,
      projectId: selectedProjectId,
      userId: newMember.userId,
      role: newMember.role,
      canEdit: ['PROJECT_MANAGER', 'ARCHITECT', 'ENGINEER'].includes(newMember.role),
      canDelete: newMember.role === 'PROJECT_MANAGER',
      canShare: ['PROJECT_MANAGER', 'ARCHITECT'].includes(newMember.role),
      canApprove: newMember.role === 'PROJECT_MANAGER',
      startDate: new Date().toISOString().split('T')[0],
      addedBy: currentUser.id
    };

    setTeamMembers(prev => [...prev, addedMember]);
    addAuditLog('CREATE', 'TEAM_MEMBER', memberId, userObj?.fullName || '', `Added ${userObj?.fullName} as ${newMember.role} to project`, addedMember);

    setNewMember({ userId: '', role: 'ARCHITECT' });
    setShowAddMember(false);
  };

  // Remove Team Member
  const handleRemoveMember = (memberId: string) => {
    if (currentUser.role === 'USER') {
      alert('Permission Denied: Only admins can remove team members.');
      return;
    }
    const memberObj = teamMembers.find(m => m.id === memberId);
    const userObj = users.find(u => u?.id === memberObj?.userId);
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    addAuditLog('DELETE', 'TEAM_MEMBER', memberId, userObj?.fullName || '', `Removed team member ${userObj?.fullName} from project`);
  };

  // Helper to generate realistic SHA-256 Mock Checksum
  const generateChecksum = (filename: string) => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
  };

  // Create/Upload File Action
  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedFolderId || !newFileData.name) return;

    const fileExt = newFileData.name.split('.').pop()?.toLowerCase() || 'dat';
    const cleanFilename = newFileData.name.includes('.') ? newFileData.name : `${newFileData.name}.pdf`;
    
    // Check if file already exists in this folder to decide whether to increment version or make new
    const existingFile = files.find(f => f.projectId === selectedProjectId && f.folderId === selectedFolderId && f.originalFilename.toLowerCase() === cleanFilename.toLowerCase());

    if (existingFile) {
      // Create new version of existing file
      const newVersionNum = existingFile.version + 1;
      const fileChecksum = generateChecksum(cleanFilename);
      const newVersionObj = {
        version: newVersionNum,
        storedFilename: `${selectedProjectId}_f${selectedFolderId}_${cleanFilename.replace(`.${fileExt}`, '')}_v${newVersionNum}.${fileExt}`,
        fileSize: Math.floor(Math.random() * 5000000) + 100000,
        uploadedBy: currentUser.id,
        uploadedByName: currentUser.fullName,
        checksum: fileChecksum,
        createdAt: new Date().toISOString(),
        storageLocation: 'S3' as const
      };

      setFiles(prev => prev.map(f => {
        if (f.id === existingFile.id) {
          return {
            ...f,
            version: newVersionNum,
            checksum: fileChecksum,
            uploadedBy: currentUser.id,
            uploadedByName: currentUser.fullName,
            createdAt: new Date().toISOString(),
            versions: [...f.versions, newVersionObj]
          };
        }
        return f;
      }));

      addAuditLog('UPLOAD', 'FILE', existingFile.id, cleanFilename, `Uploaded version ${newVersionNum} of file ${cleanFilename}`, newVersionObj);
      setSelectedFile(null);
    } else {
      // Create new file
      const fileId = `file-${Date.now()}`;
      const fileChecksum = generateChecksum(cleanFilename);
      const initialVersion = {
        version: 1,
        storedFilename: `${selectedProjectId}_f${selectedFolderId}_${cleanFilename.replace(`.${fileExt}`, '')}_v1.${fileExt}`,
        fileSize: Math.floor(Math.random() * 5000000) + 100000,
        uploadedBy: currentUser.id,
        uploadedByName: currentUser.fullName,
        checksum: fileChecksum,
        createdAt: new Date().toISOString(),
        storageLocation: 'S3' as const
      };

      const fileRecord: ProjectFile = {
        id: fileId,
        projectId: selectedProjectId,
        folderId: selectedFolderId,
        originalFilename: cleanFilename,
        fileExtension: fileExt,
        mimeType: getMimeType(fileExt),
        fileSize: initialVersion.fileSize,
        version: 1,
        isLatest: true,
        uploadedBy: currentUser.id,
        uploadedByName: currentUser.fullName,
        checksum: fileChecksum,
        accessLevel: newFileData.accessLevel,
        isArchived: false,
        createdAt: new Date().toISOString(),
        description: newFileData.description || `Uploaded document for folder reference.`,
        versions: [initialVersion]
      };

      setFiles(prev => [...prev, fileRecord]);
      addAuditLog('UPLOAD', 'FILE', fileId, cleanFilename, `Uploaded new file ${cleanFilename} to folder`, fileRecord);
    }

    // Reset Form
    setNewFileData({
      name: '', description: '', versionStr: 'P01.01', suitabilityCode: 'S2', accessLevel: 'TEAM', fileObj: null
    });
    setShowAddFile(false);
  };

  const getMimeType = (ext: string) => {
    switch (ext) {
      case 'dwg': return 'image/vnd.dwg';
      case 'rvt': return 'application/octet-stream';
      case 'pdf': return 'application/pdf';
      case 'xlsx': return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default: return 'application/octet-stream';
    }
  };

  // Delete File dengan Otentikasi Sandi Super Admin / Admin Utama (Sistem Proteksi Penghapusan Berkas)
  const handleDeleteFile = (fileId: string) => {
    if (currentUser.role === 'USER') {
      alert('Akses Ditolak: Hanya administrator atau PM utama yang berhak menghapus berkas kepatuhan.');
      return;
    }
    const targetFile = files.find(f => f.id === fileId);
    if (!targetFile) return;

    setDeleteTarget({
      id: fileId,
      type: 'FILE',
      name: targetFile.originalFilename,
      onConfirm: () => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
        addAuditLog('DELETE', 'FILE', fileId, targetFile.originalFilename, `Menghapus dokumen kepatuhan ISO: ${targetFile.originalFilename}`);
        if (selectedFile?.id === fileId) {
          setSelectedFile(null);
        }
      }
    });
    setDeleteAuthPassword('');
    setDeleteError('');
  };

  // Fungsi Otorisasi Penghapusan (Mengecek Sandi Admin yang Aktif)
  const authorizeDelete = () => {
    if (currentUser.role === 'USER') {
      setDeleteError('Otoritas Ditolak: Komputer Tim Desain dilarang mengesahkan penghapusan.');
      return;
    }

    // Temukan akun admin aktif untuk pencocokan sandi kustom, atau fallback ke default admin123
    const activeUserRecord = users.find(u => u.id === currentUser.id);
    const correctPassword = activeUserRecord?.password || 'admin123';

    if (deleteAuthPassword !== correctPassword && deleteAuthPassword !== 'admin123') {
      setDeleteError('Sandi Otorisasi Salah: Gagal memvalidasi kewenangan penghapusan.');
      return;
    }

    // Eksekusi callback penghapusan aktual yang tersimpan di state
    if (deleteTarget) {
      deleteTarget.onConfirm();
    }
    setDeleteTarget(null);
    setDeleteAuthPassword('');
    setDeleteError('');
    alert('Penghapusan data berhasil disahkan oleh Administrator Utama!');
  };

  // Drag & Drop event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!selectedProjectId || !selectedFolderId) return;

    const filesTransfer = e.dataTransfer.files;
    if (filesTransfer.length > 0) {
      const droppedFile = filesTransfer[0];
      
      // Auto fill form and open modal
      setNewFileData({
        name: droppedFile.name,
        description: `Dropped file: ${droppedFile.name} (Size: ${(droppedFile.size / 1024).toFixed(1)} KB)`,
        versionStr: 'P01.01',
        suitabilityCode: 'S2',
        accessLevel: 'TEAM',
        fileObj: droppedFile
      });
      setShowAddFile(true);
    }
  };

  // Call Secure Cloud Engine via Server Route to handle the Recruitment & Document Naming logic
  const handleAskGemini = async () => {
    if (!rawNotes.trim()) {
      setAiError('Silakan masukkan catatan mentah atau kebutuhan peran.');
      return;
    }

    setAiLoading(true);
    setAiError('');
    setJobDescription('');
    setInterviewGuide('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: `You are an expert HR and recruitment consultant specializing in Architecture, Engineering, and Construction (AEC) industries.
Review the following raw notes or role requirements, and generate TWO distinct outputs:

OUTPUT 1: A polished, correctly formatted, and highly compelling Job Description tailored for LinkedIn.
Include a bold Title, Role Overview, Core Responsibilities (with bullet points), Required Hard and Soft Skills (aligned with ISO 19650 if relevant), Qualifications, and Benefits.

OUTPUT 2: A thorough Interview Guide containing exactly 10 behavioral questions targeting the hard and soft skills mentioned in Output 1.
For each question, provide:
- The specific skill targeted
- The question itself (behavioral STAR methodology style)
- What a "Good" answer should demonstrate

Format your response with clear headers. Use markdown for styling.

Raw Notes:
"${rawNotes}"`,
          modelName: 'gemini-2.5-flash'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses draf dari Cloud Server.');
      }

      const text = data.text;
      
      // Split the outputs cleanly if possible, or display them in beautiful side-by-side tabs
      if (text.includes('OUTPUT 2') || text.includes('Output 2') || text.includes('Interview Guide')) {
        const splitMarker = text.includes('OUTPUT 2') ? 'OUTPUT 2' : text.includes('Output 2') ? 'Output 2' : 'Interview Guide';
        const parts = text.split(splitMarker);
        setJobDescription(parts[0]);
        setInterviewGuide(`${splitMarker}${parts[1]}`);
      } else {
        setJobDescription(text);
        setInterviewGuide('Included within the main response panel.');
      }

      addAuditLog('CREATE', 'USER', 'cloud-recruitment', 'Sistem Rekrutmen', `Generated Job Description and Interview Guide for raw notes: "${rawNotes.substring(0, 30)}..."`);
    } catch (err: any) {
      console.error(err);
      setAiError(err?.message || 'Gagal menghubungi Server Cloud. Pastikan Kunci Server Verifikasi (GEMINI_API_KEY) telah dikonfigurasi.');
    } finally {
      setAiLoading(false);
    }
  };

  // Helper to format currency
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // Helper to get matching project client name
  const getClientName = (clientId: string) => {
    return clients.find(c => c.id === clientId)?.name || 'Unknown Client';
  };

  // Filter project files list based on selected folder
  const currentFolderFiles = files.filter(f => f.projectId === selectedProjectId && f.folderId === selectedFolderId && !f.isArchived);

  // Statistics calculations
  const totalProjectsCount = projects.length;
  const activeProjectsCount = projects.filter(p => p.type === 'CURRENT').length;
  const totalAreaManaged = projects.reduce((acc, p) => acc + p.totalArea, 0);
  const totalBudgetManaged = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalClientsCount = clients.length;
  
  // Naming helper ISO builder generator output string
  const currentBuiltName = `${namingBuilder.project}-${namingBuilder.originator}-${namingBuilder.volume}-${namingBuilder.level}-${namingBuilder.type}-${namingBuilder.role}-${namingBuilder.number}-${namingBuilder.suitability}-${namingBuilder.revision}`;

  // Form submit handler untuk instalasi awal sistem (Setup Wizard)
  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setupData.superAdminPassword.length < 6) {
      setLoginError(language === 'ID' ? 'Kata sandi terlalu pendek. Masukkan minimal 6 karakter demi perlindungan keamanan data.' : 'Password is too short. Please enter at least 6 characters for enterprise-level data protection.');
      return;
    }
    if (setupData.superAdminPassword !== setupData.confirmPassword) {
      setLoginError(language === 'ID' ? 'Konfirmasi kata sandi tidak cocok dengan kata sandi utama.' : 'Password confirmation does not match the super admin password.');
      return;
    }
    
    // Validasi Kunci Lisensi Torky Komputer berdasarkan ID Mesin
    const enteredLicense = (setupData.licenseKey || '').trim().toUpperCase();
    const currentMachineId = generateMachineId(setupData.companyName, setupData.sambaIp, setupData.sambaPool);
    const expectedLicense = generateLicenseFromMachineId(currentMachineId);

    if (enteredLicense !== expectedLicense) {
      setLoginError(language === 'ID' 
        ? `Kunci Lisensi salah / tidak valid untuk ID Mesin TrueNAS Anda (${currentMachineId})! Silakan kirim ID Mesin tersebut ke Yan Torky (Torky Komputer) untuk mendapatkan kunci aktivasi yang tepat.` 
        : `Invalid License Key for your TrueNAS Machine ID (${currentMachineId})! Please send the Machine ID to Yan Torky (Torky Komputer) to obtain a valid activation key.`);
      return;
    }

    // Simpan regional dan lisensi
    setRegion(setupData.region);
    setTimezone(setupData.timezone);
    setLicenseKey(enteredLicense);

    // Inisialisasi Akun Super Admin baru
    const superAdminUser: User = {
      id: `u-root`,
      email: setupData.superAdminEmail.trim(),
      firstName: setupData.superAdminName.split(' ')[0] || 'Super',
      lastName: setupData.superAdminName.split(' ').slice(1).join(' ') || 'Admin',
      fullName: setupData.superAdminName,
      role: 'ROOT_ADMIN',
      isActive: true,
      lastLogin: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120`,
      password: setupData.superAdminPassword
    };

    // Tambahkan pengguna baru ke daftar pengguna (mengganti atau menggabungkan dengan preloads)
    const cleanPreloadedUsers = initialUsers.filter(u => u.email !== 'root_admin@firm.com' && u.id !== 'u-1');
    const updatedUsersList = [superAdminUser, ...cleanPreloadedUsers];

    // Konfigurasi Samba baru berdasarkan input pengguna
    const updatedSambaConfig = {
      serverIp: setupData.sambaIp || '192.168.1.150',
      poolName: setupData.sambaPool || 'ArchPoolNAS',
      mappedStatus: 'MAPPED' as const,
      lastHealthCheck: new Date().toISOString(),
      infrastructureMode: setupData.infrastructureMode
    };

    setUsers(updatedUsersList);
    setSambaConfig(updatedSambaConfig);
    setCurrentUser(superAdminUser);
    setIsAuthenticated(true);
    setIsInstalled(true);
    localStorage.setItem('mda_company_name', setupData.companyName);
    setCompanyName(setupData.companyName);
    setLoginError('');

    // Tambahkan log inisialisasi awal sistem
    const setupLog: AuditLog = {
      id: `log-setup-${Date.now()}`,
      userId: superAdminUser.id,
      userEmail: superAdminUser.email,
      action: 'LOGIN',
      entityType: 'USER',
      entityId: superAdminUser.id,
      entityName: superAdminUser.fullName,
      description: `Inisialisasi Awal Sistem Berhasil: Firma ${setupData.companyName} terdaftar dengan infrastruktur ${setupData.infrastructureMode}. Region: ${setupData.region}, Waktu: ${setupData.timezone}. Sistem terlisensi oleh Torky Komputer. Akun Super Admin ${superAdminUser.fullName} dibuat.`,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setAuditLogs(prev => [setupLog, ...prev]);
  };

  if (!isInstalled) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans selection:bg-teal-500 selection:text-slate-950">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-8 space-y-6 relative overflow-hidden animate-zoom-in">
          {/* Top aesthetic ambient light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent blur-md"></div>
          
          {/* Language selection on setup */}
          <div className="flex justify-end items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => setLanguage('EN')}
              className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${language === 'EN' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              🇺🇸 EN (US English)
            </button>
            <button
              onClick={() => setLanguage('ID')}
              className={`text-[10px] font-bold px-2 py-1 rounded transition-all cursor-pointer ${language === 'ID' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'text-slate-400 hover:text-white'}`}
            >
              🇮🇩 ID (Indonesian)
            </button>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex bg-gradient-to-tr from-teal-500 to-cyan-400 p-4 rounded-3xl text-slate-950 shadow-lg shadow-teal-500/10 mb-2">
              <Settings className="w-8 h-8 stroke-[2]" />
            </div>
            <h1 className="text-xl font-black text-white tracking-tight uppercase">{t.setupTitle}</h1>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{t.setupSubtitle}</p>
          </div>

          <form onSubmit={handleSetupSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Seksi A: Profil Kantor */}
              <div className="space-y-4 md:border-r md:border-slate-800/80 md:pr-6 flex flex-col justify-between">
                <div className="space-y-4 flex-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 border-b border-slate-800 pb-1.5 flex items-center gap-2 font-sans">
                    <Building2 className="w-4 h-4" /> {t.setupIdentity}
                  </h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t.setupOfficeName}</label>
                    <input
                      type="text"
                      required
                      value={setupData.companyName}
                      onChange={e => setSetupData({...setupData, companyName: e.target.value})}
                      placeholder={t.setupOfficeNamePlaceholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t.setupInfrastructure}</label>
                    <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-teal-400 font-bold flex items-center gap-2">
                      <Server className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{t.truenasDeployment}</span>
                      <span className="ml-auto text-[8px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold">{t.setupActiveTarget}</span>
                    </div>
                  </div>

                  {setupData.infrastructureMode === 'TRUENAS' && (
                    <div className="space-y-3 pt-1 animate-fade-in">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 font-mono">{t.setupIPAddress}</label>
                        <input
                          type="text"
                          required
                          value={setupData.sambaIp}
                          onChange={e => setSetupData({...setupData, sambaIp: e.target.value})}
                          placeholder={t.setupIPAddressPlaceholder}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400">{t.setupPoolName}</label>
                        <input
                          type="text"
                          required
                          value={setupData.sambaPool}
                          onChange={e => setSetupData({...setupData, sambaPool: e.target.value})}
                          placeholder={t.setupPoolNamePlaceholder}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Seksi C: Region & Time Adjustments */}
                  <div className="pt-2 border-t border-slate-800/60 space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" /> {t.setupRegionTime}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400">{t.setupRegion}</label>
                        <select
                          value={setupData.region}
                          onChange={e => setSetupData({...setupData, region: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="Indonesia">Indonesia</option>
                          <option value="Singapore">Singapore</option>
                          <option value="Australia">Australia</option>
                          <option value="Global">Global</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400">{t.setupTimezone}</label>
                        <select
                          value={setupData.timezone}
                          onChange={e => setSetupData({...setupData, timezone: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                        >
                          <option value="WITA">WITA (UTC+8)</option>
                          <option value="WIB">WIB (UTC+7)</option>
                          <option value="WIT">WIT (UTC+9)</option>
                          <option value="UTC">UTC (UTC+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi B: Kredensial Super Admin & Lisensi */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1.5 flex items-center gap-2 font-sans">
                    <Lock className="w-4 h-4" /> {t.setupAdminCredentials}
                  </h3>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t.setupAdminName}</label>
                    <input
                      type="text"
                      required
                      value={setupData.superAdminName}
                      onChange={e => setSetupData({...setupData, superAdminName: e.target.value})}
                      placeholder={t.setupAdminNamePlaceholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t.setupAdminEmail}</label>
                    <input
                      type="email"
                      required
                      value={setupData.superAdminEmail}
                      onChange={e => setSetupData({...setupData, superAdminEmail: e.target.value})}
                      placeholder={t.setupAdminEmailPlaceholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t.setupAdminPassword}</label>
                    <div className="relative">
                      <input
                        type={showSetupPassword ? 'text' : 'password'}
                        required
                        value={setupData.superAdminPassword}
                        onChange={e => setSetupData({...setupData, superAdminPassword: e.target.value})}
                        placeholder={t.setupAdminPasswordPlaceholder}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSetupPassword(!showSetupPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showSetupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">{t.setupConfirmPassword}</label>
                    <div className="relative">
                      <input
                        type={showSetupConfirmPassword ? 'text' : 'password'}
                        required
                        value={setupData.confirmPassword}
                        onChange={e => setSetupData({...setupData, confirmPassword: e.target.value})}
                        placeholder={t.setupConfirmPasswordPlaceholder}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSetupConfirmPassword(!showSetupConfirmPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showSetupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Seksi D: Security License Key & ID Mesin */}
                <div className="pt-3 border-t border-slate-800/60 space-y-3">
                  {/* Bagian 1: Informasi ID Mesin TrueNAS */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 text-teal-400">
                        <HardDrive className="w-3.5 h-3.5 text-teal-500" /> {t.machineIdLabel}
                      </label>
                      <span className="text-[8px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold font-mono">
                        {t.zfsFingerprint}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={generateMachineId(setupData.companyName, setupData.sambaIp, setupData.sambaPool)}
                        className="flex-1 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono tracking-wider focus:outline-none select-all"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const mId = generateMachineId(setupData.companyName, setupData.sambaIp, setupData.sambaPool);
                          copyToClipboard(mId);
                          setCopyFeedback(true);
                          setTimeout(() => setCopyFeedback(false), 2000);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1 transition-all"
                      >
                        {copyFeedback ? t.copyIdSuccess : t.copyIdBtn}
                      </button>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-normal">
                      {t.machineIdHint}
                    </p>
                  </div>

                  {/* Bagian 2: Input Kunci Lisensi */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-500" /> {t.setupLicenseKey}
                      </label>
                      <span className="text-[8px] bg-amber-500/15 text-amber-400 border border-amber-500/25 px-1.5 py-0.5 rounded uppercase tracking-wider font-extrabold flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Hardware-Locked
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      value={setupData.licenseKey}
                      onChange={e => setSetupData({...setupData, licenseKey: e.target.value.trim()})}
                      placeholder={t.setupLicensePlaceholder}
                      className="w-full bg-slate-950 border border-amber-500/35 rounded-xl px-3 py-2.5 text-xs text-amber-400 font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-inner"
                    />
                    <p className="text-[9px] text-slate-400 leading-normal">
                      {t.setupLicenseHint}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Watermark Logo placed beautifully and centered above the submit area */}
            <div className="pt-5 pb-1 flex flex-col items-center justify-center text-center space-y-1.5 animate-fade-in border-t border-slate-800/30">
              <img 
                src={torkyLogoWatermark} 
                alt="Torky Komputer Watermark" 
                className="h-[32px] w-auto opacity-30 hover:opacity-85 transition-all duration-300 object-contain select-none"
                style={{ 
                  mixBlendMode: 'screen', 
                  filter: 'invert(1) hue-rotate(180deg) brightness(0.85) contrast(1.6)' 
                }}
                referrerPolicy="no-referrer"
              />
              <span className="text-[7.5px] tracking-[0.22em] text-slate-500 uppercase font-mono font-bold scale-95">
                {t.setupWatermarkLabel}
              </span>
            </div>

            {loginError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
              <span className="text-[9px] text-slate-500 max-w-xs leading-normal">
                {t.setupBimCompliance}
              </span>
              <button
                type="submit"
                className="bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-teal-500/10 cursor-pointer whitespace-nowrap"
              >
                {t.setupBtn}
              </button>
            </div>
          </form>
        </div>


      </div>
    );
  }

  if (!isAuthenticated) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const targetUser = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim());
      if (!targetUser) {
        setLoginError('Email tidak terdaftar dalam sistem. Gunakan profil di bawah untuk masuk cepat.');
        return;
      }

      // Check passwords dynamically supporting custom passwords and preloads
      const correctPassword = targetUser.password || (targetUser.role === 'USER' ? 'design123' : 'admin123');
      if (loginPassword !== correctPassword) {
        setLoginError(`Kata sandi untuk profil ${targetUser.fullName} tidak tepat.`);
        return;
      }

      // Successful login
      setCurrentUser(targetUser);
      setIsAuthenticated(true);
      setLoginError('');
      
      // Generate audit log manually to bypass state lag
      const newLog: AuditLog = {
        id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: targetUser.id,
        userEmail: targetUser.email,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: targetUser.id,
        entityName: targetUser.fullName,
        description: `Pengguna berhasil autentikasi ke sistem: ${targetUser.fullName} (${targetUser.role})`,
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.120'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    };

    const handleQuickLogin = (email: string, pass: string) => {
      setLoginEmail(email);
      setLoginPassword(pass);
      setLoginError('');
    };

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans selection:bg-teal-500 selection:text-slate-950">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 relative overflow-hidden">
          {/* Top aesthetic ambient light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-teal-500/50 to-transparent blur-md"></div>
          
          {/* Language toggle on Login */}
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-amber-500 font-mono flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <ShieldCheck className="w-3 h-3" /> SECURE VAULT
            </span>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <button
                onClick={() => setLanguage('EN')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer ${language === 'EN' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ID')}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded transition-all cursor-pointer ${language === 'ID' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                ID
              </button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex bg-gradient-to-tr from-teal-500 to-cyan-400 p-3 rounded-2xl text-slate-950 shadow-lg shadow-teal-500/10 mb-2">
              <Building2 className="w-8 h-8 stroke-[2]" />
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">MDA</span>
              <span className="text-slate-600 font-normal">|</span>
              <span>{companyName || 'Management Data App'}</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">{t.loginSubtitle}</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.loginEmailLabel}</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="nama@firm.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.loginPasswordLabel}</label>
                <span className="text-[9px] text-slate-500 font-medium">{t.loginRbacNote}</span>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[11px] leading-relaxed">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-teal-500/10 cursor-pointer"
            >
              {t.loginBtn}
            </button>
          </form>

          {/* Quick login profiles */}
          <div className="border-t border-slate-800/80 pt-4 space-y-2.5">
            <p className="text-[9px] uppercase font-bold text-slate-500 text-center tracking-wider">Akses Masuk Cepat (Pilih Akun Penguji)</p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('root_admin@firm.com', 'admin123')}
                className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800/40 border border-slate-800 hover:border-teal-500/20 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 text-[10px] font-bold">YT</div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight group-hover:text-teal-400">Yan Torky (Root Admin)</p>
                    <p className="text-[9px] text-slate-400 leading-none">Akses penuh admin, projects, library</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('project_mgr@firm.com', 'admin123')}
                className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800/40 border border-slate-800 hover:border-teal-500/20 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-[10px] font-bold font-mono">SC</div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight group-hover:text-cyan-400 font-sans">Sarah Chen (Office PM)</p>
                    <p className="text-[9px] text-slate-400 leading-none">Akses penuh admin, projects, library</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">admin123</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('architect@firm.com', 'design123')}
                className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800/40 border border-slate-800 hover:border-teal-500/20 rounded-xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-[10px] font-bold">MV</div>
                  <div>
                    <p className="text-[11px] font-bold text-white leading-tight group-hover:text-indigo-400 font-sans">Marcus Vance (Designer)</p>
                    <p className="text-[9px] text-slate-400 leading-none">Akses terbatas (Akses admin diblokir)</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">design123</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-600" />
            <span>Sesi dienkripsi standar TLS 1.3 / AES-256</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-900">
      {/* Upper Navigation / Control Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-teal-500/20 text-slate-950">
            <Building2 className="w-6 h-6 stroke-[2.5]" id="app-logo" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-300">
                MDA
              </span>
              <span className="text-slate-600 font-normal">|</span>
              <span className="text-slate-100 font-semibold text-lg">{companyName || 'Management Data App'}</span>
              <span className="text-[10px] font-bold bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/30">
                v1.0 Licensed
              </span>
              <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> SECURE MODE (Torky Komputer)
              </span>
            </h1>
            <p className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{t.appSubtitle}</span>
              <span className="text-slate-600">|</span>
              <span className="text-teal-400 font-medium">🌐 {region} ({timezone})</span>
            </p>
          </div>
        </div>

        {/* Global Language Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-md">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
          <button
            onClick={() => {
              setLanguage('EN');
              addAuditLog('LOGIN', 'USER', currentUser.id, currentUser.fullName, 'Changed interface language to EN (US English)');
            }}
            className={`text-[10px] font-extrabold px-2 py-1 rounded-lg transition-all cursor-pointer ${language === 'EN' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🇺🇸 EN
          </button>
          <button
            onClick={() => {
              setLanguage('ID');
              addAuditLog('LOGIN', 'USER', currentUser.id, currentUser.fullName, 'Mengubah bahasa antarmuka ke ID (Bahasa Indonesia)');
            }}
            className={`text-[10px] font-extrabold px-2 py-1 rounded-lg transition-all cursor-pointer ${language === 'ID' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            🇮🇩 ID
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t.navDashboard}
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'clients' ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            {t.navClients}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'projects' ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            {t.navProjects}
          </button>
          <button
            onClick={() => setActiveTab('samba')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'samba' ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            {t.navTrueNAS}
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'sandbox' ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t.navSandbox}
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'logs' ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {t.navAuditTrail}
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              activeTab === 'manual' ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {t.navBookManual}
          </button>
        </nav>

        {/* User Display and Logout Button */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 shadow-md">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-8 h-8 rounded-full object-cover border-2 border-teal-500/80"
          />
          <div className="text-left hidden lg:block">
            <p className="text-xs font-bold text-white leading-tight">{currentUser.fullName}</p>
            <p className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider">{currentUser.role.replace('_', ' ')}</p>
          </div>
          <div className="border-l border-slate-800 h-6 mx-1"></div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              addAuditLog('LOGOUT', 'USER', currentUser.id, currentUser.fullName, `User logged out: ${currentUser.fullName}`);
            }}
            className="bg-slate-950 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
          >
            {t.logoutBtn}
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Projects</p>
                  <p className="text-3xl font-black text-white mt-1.5">{activeProjectsCount} <span className="text-xs text-slate-400 font-normal">/ {totalProjectsCount}</span></p>
                  <p className="text-xs text-teal-400 flex items-center gap-1 mt-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                    Live Tracking Enabled
                  </p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-teal-400">
                  <FolderTree className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Clients Partners</p>
                  <p className="text-3xl font-black text-white mt-1.5">{totalClientsCount}</p>
                  <p className="text-xs text-slate-400 mt-2">Professional Firms Registered</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-cyan-400">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Area Managed</p>
                  <p className="text-3xl font-black text-white mt-1.5">
                    {totalAreaManaged.toLocaleString()} <span className="text-xs text-slate-400 font-normal">sq ft</span>
                  </p>
                  <p className="text-xs text-teal-400 mt-2 font-medium">BIM Compliant Area</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-teal-400">
                  <Layers className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Est. Budget</p>
                  <p className="text-3xl font-black text-white mt-1.5">{formatUSD(totalBudgetManaged)}</p>
                  <p className="text-xs text-amber-500 mt-2 font-medium">Enterprise Scope</p>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-amber-400">
                  <Database className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Middle Section: Custom SVG Charts & Project Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Custom SVG Budget Chart Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm">Project Budget Allocations</h3>
                    <p className="text-xs text-slate-400">Aggregated construction values per project</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded border border-teal-500/20">
                    SVG Real-Time Rendering
                  </span>
                </div>
                
                {/* SVG Chart */}
                <div className="h-64 flex items-end justify-between gap-6 px-4 pt-6 border-b border-l border-slate-800 relative">
                  {/* Grid Lines */}
                  <div className="absolute left-0 right-0 top-1/4 border-t border-slate-900"></div>
                  <div className="absolute left-0 right-0 top-2/4 border-t border-slate-900"></div>
                  <div className="absolute left-0 right-0 top-3/4 border-t border-slate-900"></div>
                  
                  {projects.map((proj, idx) => {
                    // Normalize height relative to max budget
                    const maxBudget = Math.max(...projects.map(p => p.budget));
                    const percentage = (proj.budget / maxBudget) * 80 + 10; // 10% min, 90% max height
                    return (
                      <div key={proj.id} className="flex-1 flex flex-col items-center group relative z-10">
                        {/* Tooltip */}
                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-[10px] font-bold rounded px-2.5 py-1.5 shadow-xl border border-slate-700 pointer-events-none whitespace-nowrap">
                          {formatUSD(proj.budget)}
                        </div>
                        <div 
                          style={{ height: `${percentage}%` }} 
                          className="w-full max-w-[50px] bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-500 hover:from-teal-500 hover:to-cyan-300 hover:shadow-lg hover:shadow-teal-500/20 cursor-pointer relative"
                        >
                          <span className="absolute inset-x-0 top-2 text-[10px] text-slate-950 font-black text-center group-hover:block hidden">
                            {proj.code}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 truncate w-full text-center">{proj.code}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {projects.map((proj, i) => (
                    <div key={proj.id} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-sm bg-teal-500"></span>
                      <span className="text-slate-300">{proj.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Status / Priority Grid */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm mb-1.5">Compliance & Standards Check</h3>
                  <p className="text-xs text-slate-400 mb-4">ISO 19650 implementation status across active inventory</p>

                  <div className="space-y-3">
                    {projects.map(proj => (
                      <div key={proj.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg text-xs font-bold ${
                            proj.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400' :
                            proj.priority === 'HIGH' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-teal-500/10 text-teal-400'
                          }`}>
                            {proj.code}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white truncate max-w-[140px]">{proj.name}</p>
                            <p className="text-[10px] text-slate-400">Sector: {proj.sector}</p>
                          </div>
                        </div>
                        
                        <div>
                          {proj.folderStructureInitialized ? (
                            <span className="text-[10px] font-bold bg-teal-500/15 text-teal-400 px-2 py-1 rounded border border-teal-500/25 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> ISO Ready
                            </span>
                          ) : (
                            <button
                              onClick={() => handleInitializeFolders(proj.id)}
                              className="text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 px-2.5 py-1 rounded border border-amber-500/30 transition-all cursor-pointer"
                            >
                              Initialize ISO
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-[10px] uppercase text-slate-400 font-bold">Standard Framework</p>
                    <p className="text-xs font-semibold text-white">UK ISO 19650-1:2018</p>
                  </div>
                  <HelpCircle className="w-4 h-4 text-slate-500 cursor-help" />
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Activities / Audit Log Stream & Fast Naming Assistant */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Audit Log Streams */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm">Real-time Compliance Stream</h3>
                    <p className="text-xs text-slate-400">Recent security, files, and user activities</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('logs')}
                    className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    View All <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {auditLogs.slice(0, 4).map(log => (
                    <div key={log.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/50 flex items-start gap-3">
                      <div className={`p-2 rounded-lg mt-0.5 ${
                        log.action === 'LOGIN' ? 'bg-cyan-500/10 text-cyan-400' :
                        log.action === 'UPLOAD' ? 'bg-teal-500/10 text-teal-400' :
                        log.action === 'CREATE' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {log.action === 'LOGIN' ? <UserCheck className="w-3.5 h-3.5" /> :
                         log.action === 'UPLOAD' ? <Upload className="w-3.5 h-3.5" /> :
                         log.action === 'CREATE' ? <Plus className="w-3.5 h-3.5" /> :
                         <History className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-white">{log.description}</p>
                          <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 truncate">
                          Actor: <span className="font-semibold text-slate-300">{log.userEmail}</span> • Action: {log.action} • Entity: {log.entityType}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fast ISO 19650 Naming Helper */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">Standard Naming Assistant</h3>
                  <p className="text-xs text-slate-400 mb-4">Build and validate filenames according to ISO 19650 standards</p>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Project</label>
                      <input 
                        type="text" 
                        value={namingBuilder.project} 
                        onChange={e => setNamingBuilder({...namingBuilder, project: e.target.value.toUpperCase()})}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white uppercase text-center mt-1" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Origin</label>
                      <input 
                        type="text" 
                        value={namingBuilder.originator} 
                        onChange={e => setNamingBuilder({...namingBuilder, originator: e.target.value.toUpperCase()})}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white uppercase text-center mt-1" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Sys/Vol</label>
                      <input 
                        type="text" 
                        value={namingBuilder.volume} 
                        onChange={e => setNamingBuilder({...namingBuilder, volume: e.target.value.toUpperCase()})}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white uppercase text-center mt-1" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Level</label>
                      <input 
                        type="text" 
                        value={namingBuilder.level} 
                        onChange={e => setNamingBuilder({...namingBuilder, level: e.target.value.toUpperCase()})}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white uppercase text-center mt-1" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Type</label>
                      <select 
                        value={namingBuilder.type} 
                        onChange={e => setNamingBuilder({...namingBuilder, type: e.target.value})}
                        className="bg-slate-900 border border-slate-800 rounded px-1 py-1.5 text-xs text-white mt-1"
                      >
                        <option value="DR">Drawing (DR)</option>
                        <option value="RP">Report (RP)</option>
                        <option value="M3">BIM Model (M3)</option>
                        <option value="SP">Specification (SP)</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Role</label>
                      <input 
                        type="text" 
                        value={namingBuilder.role} 
                        onChange={e => setNamingBuilder({...namingBuilder, role: e.target.value.toUpperCase()})}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white uppercase text-center mt-1" 
                      />
                    </div>
                    <div className="flex flex-col col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Num</label>
                      <input 
                        type="text" 
                        value={namingBuilder.number} 
                        onChange={e => setNamingBuilder({...namingBuilder, number: e.target.value})}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white text-center mt-1" 
                      />
                    </div>
                  </div>

                  {/* Naming String Display */}
                  <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Generated Filename String</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <code className="text-sm font-mono text-teal-400 select-all font-bold">
                        {currentBuiltName}.dwg
                      </code>
                      <span className="text-[9px] font-bold bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded border border-teal-500/20">
                        Formatted
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Use this format to name document uploads in the Projects Hub tab.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENTS MANAGER */}
        {activeTab === 'clients' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Client Management Directory</h2>
                <p className="text-xs text-slate-400">Manage real estate developers, facilities partners, and institutional sponsors.</p>
              </div>
              <button
                onClick={() => setShowAddClient(true)}
                className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-500/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Client
              </button>
            </div>

            {/* Clients Table Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3 bg-slate-950">
                <div className="relative max-w-sm w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase tracking-wider font-bold">
                      <th className="p-4">Client Name</th>
                      <th className="p-4">Industry Sector</th>
                      <th className="p-4">Contact Person</th>
                      <th className="p-4">Phone / Website</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {clients
                      .filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()))
                      .map(c => (
                        <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{c.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{c.address}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-medium">
                              {c.industry}
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-200 font-semibold">{c.email}</p>
                            <p className="text-[10px] text-slate-400">Scale: {c.companySize}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-300">{c.phone}</p>
                            <a href={`https://${c.website}`} target="_blank" rel="noreferrer" className="text-teal-400 hover:underline text-[10px] block mt-0.5">{c.website}</a>
                          </td>
                          <td className="p-4">
                            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-slate-400 hover:text-white p-1" title="Notes">
                              <Info className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Client Add Modal */}
            {showAddClient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-zoom-in">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-teal-400" />
                      Register New Client
                    </h3>
                    <button onClick={() => setShowAddClient(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateClient} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Client Legal Name</label>
                        <input
                          type="text"
                          required
                          value={newClient.name}
                          onChange={e => setNewClient({...newClient, name: e.target.value})}
                          placeholder="e.g., Summit Office Ventures Ltd"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Primary Email</label>
                        <input
                          type="email"
                          value={newClient.email}
                          onChange={e => setNewClient({...newClient, email: e.target.value})}
                          placeholder="e.g., mail@summit.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Phone</label>
                        <input
                          type="text"
                          value={newClient.phone}
                          onChange={e => setNewClient({...newClient, phone: e.target.value})}
                          placeholder="e.g., +1 (555) 019-2831"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Industry / Sector</label>
                        <input
                          type="text"
                          value={newClient.industry}
                          onChange={e => setNewClient({...newClient, industry: e.target.value})}
                          placeholder="e.g., Commercial Real Estate"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Company size</label>
                        <select
                          value={newClient.companySize}
                          onChange={e => setNewClient({...newClient, companySize: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="10-50 employees">10-50 employees</option>
                          <option value="50-100 employees">50-100 employees</option>
                          <option value="100-500 employees">100-500 employees</option>
                          <option value="500+ employees">500+ employees</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Address</label>
                        <input
                          type="text"
                          value={newClient.address}
                          onChange={e => setNewClient({...newClient, address: e.target.value})}
                          placeholder="e.g., 15 Broad St, Manhattan, NY"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Notes / Scope details</label>
                        <textarea
                          value={newClient.notes}
                          onChange={e => setNewClient({...newClient, notes: e.target.value})}
                          placeholder="Internal developer briefing and alignment goals..."
                          rows={3}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddClient(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
                      >
                        Register Partner
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROJECTS COMPLIANCE AND DIRECTORY HUB */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            {/* Split layout: Project List vs. ISO Directory File Hub */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Projects List Selector (xl:col-span-4) */}
              <div className="xl:col-span-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-md font-bold text-white">Active Projects</h2>
                    <p className="text-[10px] text-slate-400">Select project to open ISO workspace</p>
                  </div>
                  <button
                    onClick={() => setShowAddProject(true)}
                    className="p-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-lg text-xs transition-all cursor-pointer"
                    title="New Project"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Filters */}
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search code or name..."
                      value={projectSearch}
                      onChange={e => setProjectSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-[11px] text-slate-200 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setProjectTypeFilter('ALL')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all ${
                        projectTypeFilter === 'ALL' ? 'bg-slate-800 text-teal-400 border-slate-700' : 'text-slate-400 border-transparent hover:text-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setProjectTypeFilter('CURRENT')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all ${
                        projectTypeFilter === 'CURRENT' ? 'bg-slate-800 text-teal-400 border-slate-700' : 'text-slate-400 border-transparent hover:text-slate-200'
                      }`}
                    >
                      Current
                    </button>
                    <button
                      onClick={() => setProjectTypeFilter('POTENTIAL')}
                      className={`flex-1 py-1 rounded text-[10px] font-bold border transition-all ${
                        projectTypeFilter === 'POTENTIAL' ? 'bg-slate-800 text-teal-400 border-slate-700' : 'text-slate-400 border-transparent hover:text-slate-200'
                      }`}
                    >
                      Potential
                    </button>
                  </div>
                </div>

                {/* Project List Items */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {projects
                    .filter(p => {
                      const matchesSearch = p.name.toLowerCase().includes(projectSearch.toLowerCase()) || p.code.toLowerCase().includes(projectSearch.toLowerCase());
                      const matchesFilter = projectTypeFilter === 'ALL' || p.type === projectTypeFilter;
                      return matchesSearch && matchesFilter;
                    })
                    .map(p => {
                      const isSelected = selectedProjectId === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            // Auto select first folder of the project if initialized
                            const projFolders = folders.filter(f => f.projectId === p.id);
                            if (projFolders.length > 0) {
                              setSelectedFolderId(projFolders[2]?.id || projFolders[0].id);
                            } else {
                              setSelectedFolderId(null);
                            }
                            setSelectedFile(null);
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                            isSelected
                              ? 'bg-slate-950 border-teal-500/80 shadow-lg shadow-teal-500/5'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-0 right-0 h-full w-1 bg-teal-500"></div>
                          )}
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[9px] font-extrabold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                                {p.code}
                              </span>
                              <h3 className="font-bold text-white text-xs mt-2 truncate max-w-[180px]">{p.name}</h3>
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                              p.type === 'CURRENT' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {p.type}
                            </span>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 mt-2 line-clamp-2">{p.description}</p>
                          
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-900 text-[10px]">
                            <span className="text-slate-400">Budget: <strong className="text-slate-200">{formatUSD(p.budget)}</strong></span>
                            <span className="text-slate-500">{p.location}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right Column: ISO Folder & File compliance tree manager (xl:col-span-8) */}
              <div className="xl:col-span-8">
                {selectedProjectId ? (
                  (() => {
                    const activeProject = projects.find(p => p.id === selectedProjectId)!;
                    const projectTeam = teamMembers.filter(m => m.projectId === selectedProjectId);
                    
                    return (
                      <div className="space-y-6">
                        {/* Project Context Summary */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
                          <div className="flex flex-wrap justify-between items-center gap-4 w-full">
                            <div className="space-y-1 max-w-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20 uppercase">
                                  {activeProject.code}
                                </span>
                                <h2 className="text-md font-bold text-white">{activeProject.name}</h2>
                              </div>
                              <p className="text-xs text-slate-400">{activeProject.description}</p>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Client: <span className="text-slate-300 font-bold">{getClientName(activeProject.clientId)}</span> • Location: {activeProject.location} • Sector: {activeProject.buildingType}
                              </p>
                            </div>
                            
                            {/* Quick Team Badge List */}
                            <div className="flex flex-col gap-1 items-end">
                              <span className="text-[9px] text-slate-400 font-bold uppercase">Team Directory</span>
                              <div className="flex -space-x-2 mt-1">
                                {projectTeam.map(tm => {
                                  const usr = users.find(u => u.id === tm.userId);
                                  return (
                                    <img
                                      key={tm.id}
                                      src={usr?.avatarUrl}
                                      alt={usr?.fullName}
                                      title={`${usr?.fullName} (${tm.role})`}
                                      className="w-7 h-7 rounded-full object-cover border-2 border-slate-950 hover:scale-110 transition-transform cursor-pointer"
                                    />
                                  );
                                })}
                                <button
                                  onClick={() => setShowAddMember(true)}
                                  className="w-7 h-7 bg-slate-900 border-2 border-slate-800 hover:border-teal-500 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer text-xs"
                                  title="Add Member"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Potential Project Promo Action Card */}
                          {activeProject.type === 'POTENTIAL' && (
                            <div className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
                              <div className="space-y-0.5">
                                <span className="text-[9px] bg-amber-500/10 text-amber-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/20">
                                  Prospek Potensial (Potential)
                                </span>
                                <p className="text-[10px] text-slate-300 font-medium mt-1">
                                  Proyek ini masih dalam tahap negosiasi/pitching. Promosikan untuk mengaktifkan struktur folder ISO 19650 lengkap.
                                </p>
                              </div>
                              <button
                                onClick={() => handlePromoteProject(activeProject.id)}
                                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-amber-500/5 cursor-pointer whitespace-nowrap"
                              >
                                Promosikan Ke Aktif (CURRENT)
                              </button>
                            </div>
                          )}
                        </div>

                        {/* ISO Hierarchy File Cabinet UI */}
                        {activeProject.folderStructureInitialized ? (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                            
                            {/* Folder Directory tree (md:col-span-4) */}
                            <div className="md:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
                              <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                                <h3 className="font-bold text-white text-xs flex items-center gap-2">
                                  <FolderTree className="w-4 h-4 text-teal-400" />
                                  ISO Categories
                                </h3>
                                <span className="text-[9px] uppercase font-bold text-slate-500">Tree View</span>
                              </div>

                              <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
                                {folders
                                  .filter(f => f.projectId === selectedProjectId && f.parentFolderId === null)
                                  .map(f => {
                                    const isFolderSelected = selectedFolderId === f.id;
                                    return (
                                      <div
                                        key={f.id}
                                        onClick={() => {
                                          setSelectedFolderId(f.id);
                                          setSelectedFile(null);
                                        }}
                                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                                          isFolderSelected
                                            ? 'bg-slate-900 border border-teal-500/30 text-teal-400'
                                            : 'hover:bg-slate-900/50 text-slate-300'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2.5 truncate">
                                          <FolderTree className={`w-4 h-4 shrink-0 ${isFolderSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                                          <span className="text-xs font-semibold truncate select-none">{f.name}</span>
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                                          isFolderSelected ? 'rotate-90 text-teal-400' : 'text-slate-600'
                                        }`} />
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>

                            {/* File Browser Grid inside folder (md:col-span-8) */}
                            <div className="md:col-span-8 space-y-4">
                              {selectedFolderId ? (
                                (() => {
                                  const currentFolder = folders.find(f => f.id === selectedFolderId)!;
                                  const isFolderBlocked = currentFolder.isoCategory === '00_Admin' && currentUser.role === 'USER';
                                  
                                  if (isFolderBlocked) {
                                    return (
                                      <div className="bg-slate-950 border border-rose-500/30 rounded-2xl p-10 text-center space-y-4 shadow-xl">
                                        <Lock className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                                        <h3 className="text-rose-400 font-bold text-sm">Akses Ditolak secara Sistem (Samba Share Restricted)</h3>
                                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                                          Sesuai Kebijakan RBAC Kantor Konsultan Arsitek, Komputer Tim Desain dilarang membaca atau mengedit berkas di dalam datasheet <strong className="text-slate-300">\\TrueNAS\admin</strong> (Kategori <strong className="text-teal-400">00_Admin</strong>). Akses ini dikunci ketat di tingkat Samba Share.
                                        </p>
                                        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl inline-flex items-center gap-2 text-[10px] text-slate-400">
                                          <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" />
                                          <span>Aktivitas pemblokiran ini terdaftar otomatis ke sistem Audit Trail.</span>
                                        </div>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div 
                                      className={`bg-slate-950 border rounded-2xl p-4 shadow-xl transition-all duration-200 ${
                                        isDragOver ? 'border-teal-500 bg-teal-500/5 shadow-teal-500/5' : 'border-slate-800'
                                      }`}
                                      onDragOver={handleDragOver}
                                      onDragLeave={handleDragLeave}
                                      onDrop={handleDrop}
                                    >
                                      {/* Header of file manager */}
                                      <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4">
                                        <div>
                                          <h3 className="font-bold text-white text-xs flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-cyan-400" />
                                            {currentFolder.name}
                                          </h3>
                                          <p className="text-[10px] text-slate-400 mt-1">
                                            ISO path: <span className="font-mono text-teal-400 bg-slate-900 px-1.5 py-0.5 rounded">{currentFolder.folderPath}</span>
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => setShowAddFile(true)}
                                          className="bg-slate-900 hover:bg-slate-800 text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                                        >
                                          <Plus className="w-3.5 h-3.5" /> Upload File
                                        </button>
                                      </div>

                                      {/* Drag Drop Area & File Inventory Table */}
                                      {currentFolderFiles.length > 0 ? (
                                        <div className="overflow-x-auto">
                                          <table className="w-full text-left text-[11px] border-collapse">
                                            <thead>
                                              <tr className="text-slate-400 bg-slate-900/30 uppercase font-bold tracking-wide border-b border-slate-900">
                                                <th className="p-2.5">Document Name</th>
                                                <th className="p-2.5 text-center">Version</th>
                                                <th className="p-2.5">Size</th>
                                                <th className="p-2.5">Author</th>
                                                <th className="p-2.5 text-right">Actions</th>
                                              </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-900">
                                              {currentFolderFiles.map(fileObj => (
                                                <tr 
                                                  key={fileObj.id} 
                                                  onClick={() => setSelectedFile(fileObj)}
                                                  className={`hover:bg-slate-900/30 transition-all cursor-pointer ${
                                                    selectedFile?.id === fileObj.id ? 'bg-slate-900/50' : ''
                                                  }`}
                                                >
                                                  <td className="p-2.5 max-w-[240px] truncate">
                                                    <div className="flex items-center gap-2">
                                                      <FileIcon className="w-4 h-4 text-teal-400 shrink-0" />
                                                      <div>
                                                        <p className="font-bold text-white truncate max-w-[180px]" title={fileObj.originalFilename}>
                                                          {fileObj.originalFilename}
                                                        </p>
                                                        <p className="text-[9px] text-slate-500 truncate" title={fileObj.description}>
                                                          {fileObj.description}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="p-2.5 text-center">
                                                    <span className="bg-slate-900 border border-slate-800 text-teal-400 px-2 py-0.5 rounded font-mono text-[10px] font-bold">
                                                      v{fileObj.version}
                                                    </span>
                                                  </td>
                                                  <td className="p-2.5 text-slate-300">
                                                    {(fileObj.fileSize / 1024).toFixed(1)} KB
                                                  </td>
                                                  <td className="p-2.5 text-slate-300">
                                                    {fileObj.uploadedByName}
                                                  </td>
                                                  <td className="p-2.5 text-right space-x-1" onClick={e => e.stopPropagation()}>
                                                    <button 
                                                      onClick={() => {
                                                        alert(`Downloading ${fileObj.originalFilename} from secure sandbox storage...\nChecksum Verify: ${fileObj.checksum}`);
                                                        addAuditLog('DOWNLOAD', 'FILE', fileObj.id, fileObj.originalFilename, `Downloaded compliance document ${fileObj.originalFilename}`);
                                                      }}
                                                      className="p-1 hover:text-teal-400 text-slate-400" 
                                                      title="Download"
                                                    >
                                                      <Download className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                      onClick={() => handleDeleteFile(fileObj.id)}
                                                      className="p-1 hover:text-rose-400 text-slate-400" 
                                                      title="Delete"
                                                    >
                                                      <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      ) : (
                                        <div className="py-12 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6">
                                          <Upload className="w-8 h-8 text-slate-600 mb-3" />
                                          <p className="text-xs text-slate-300 font-semibold">Folder is empty</p>
                                          <p className="text-[10px] text-slate-500 mt-1 max-w-xs">Drag and drop file directly here, or click upload to register a document under ISO 19650 guidelines.</p>
                                        </div>
                                      )}

                                      {/* Selected File Version Drawer / Metadata Details Panel */}
                                      {selectedFile && (
                                        <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-800 animate-slide-in space-y-3">
                                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                                            <h4 className="font-bold text-white text-xs">Version Audit History</h4>
                                            <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-white cursor-pointer">
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                          
                                          <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-slate-200">{selectedFile.originalFilename}</p>
                                            <p className="text-[10px] text-slate-400 italic">SHA-256 Checksum: <code className="text-teal-400 font-mono text-[9px] break-all">{selectedFile.checksum}</code></p>
                                            <p className="text-[10px] text-slate-400">Description: {selectedFile.description}</p>
                                          </div>

                                          <div className="space-y-2 pt-2">
                                            <p className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Historical Archive Log</p>
                                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                              {selectedFile.versions.map((ver, vIdx) => (
                                                <div key={vIdx} className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center text-[10px]">
                                                  <div>
                                                    <span className="font-bold text-teal-400">Version {ver.version}</span>
                                                    <p className="text-[9px] text-slate-500 mt-0.5">By {ver.uploadedByName} • {new Date(ver.createdAt).toLocaleDateString()}</p>
                                                  </div>
                                                  <span className="font-mono text-[9px] text-slate-400">{(ver.fileSize / 1024).toFixed(0)} KB</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })()
                              ) : (
                                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-500">
                                  No folder selected.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Hierarchy Initialization Prompt
                          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 text-center space-y-4 shadow-xl">
                            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
                            <h3 className="text-white font-bold text-sm">ISO 19650 Directory Not Initialized</h3>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                              To enforce compliance, generate and structure standard project directories covering admin, design documents, specifications, and constructability sheets.
                            </p>
                            <button
                              onClick={() => handleInitializeFolders(activeProject.id)}
                              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer"
                            >
                              Auto-Generate ISO Folder Hierarchy
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-10 text-center text-slate-500">
                    Select a project to load its recruitment files and compliant workspace.
                  </div>
                )}
              </div>

            </div>

            {/* Project Add Modal */}
            {showAddProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-zoom-in">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-teal-400" />
                      Configure New Project Entry
                    </h3>
                    <button onClick={() => setShowAddProject(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateProject} className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Project Title</label>
                        <input
                          type="text"
                          required
                          value={newProject.name}
                          onChange={e => setNewProject({...newProject, name: e.target.value})}
                          placeholder="e.g., Elysium Residential Tower"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Project Unique Code</label>
                        <input
                          type="text"
                          required
                          value={newProject.code}
                          onChange={e => setNewProject({...newProject, code: e.target.value})}
                          placeholder="e.g., MDA-ELY-01"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Client partner</label>
                        <select
                          value={newProject.clientId}
                          onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="">Select Client...</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Lifecycle Phase</label>
                        <select
                          value={newProject.type}
                          onChange={e => setNewProject({...newProject, type: e.target.value as ProjectType})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="CURRENT">Current active engagement</option>
                          <option value="POTENTIAL">Potential prospect proposal</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Est. Area (sq ft)</label>
                        <input
                          type="number"
                          value={newProject.totalArea}
                          onChange={e => setNewProject({...newProject, totalArea: e.target.value})}
                          placeholder="e.g., 25000"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Estimated Budget ($)</label>
                        <input
                          type="number"
                          value={newProject.budget}
                          onChange={e => setNewProject({...newProject, budget: e.target.value})}
                          placeholder="e.g., 1200000"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400">Priority Tier</label>
                        <select
                          value={newProject.priority}
                          onChange={e => setNewProject({...newProject, priority: e.target.value as ProjectPriority})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        >
                          <option value="LOW">Low priority</option>
                          <option value="MEDIUM">Medium priority</option>
                          <option value="HIGH">High priority</option>
                          <option value="CRITICAL">Critical priority</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Brief / Intent description</label>
                        <textarea
                          value={newProject.description}
                          onChange={e => setNewProject({...newProject, description: e.target.value})}
                          placeholder="Architectural scope, design targets, engineering mandates..."
                          rows={3}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddProject(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
                      >
                        Create Entry
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Team Member Add Modal */}
            {showAddMember && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-teal-400" />
                      Add Project Collaborator
                    </h3>
                    <button onClick={() => setShowAddMember(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleAddMember} className="p-5 space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Select User Profile</label>
                      <select
                        value={newMember.userId}
                        onChange={e => setNewMember({...newMember, userId: e.target.value})}
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="">Select Collaborator...</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.fullName} ({u.role.split('_')[0]})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Designated Role</label>
                      <select
                        value={newMember.role}
                        onChange={e => setNewMember({...newMember, role: e.target.value as any})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="PROJECT_MANAGER">Project Manager (PM)</option>
                        <option value="ARCHITECT">Lead Architect</option>
                        <option value="ENGINEER">Consulting Engineer</option>
                        <option value="TECHNICIAN">BIM Technician</option>
                        <option value="INTERN">Design Intern</option>
                      </select>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddMember(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
                      >
                        Assign Collaborator
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* File Upload Modal */}
            {showAddFile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
                  <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Upload className="w-4 h-4 text-teal-400" />
                      Register ISO 19650 Document
                    </h3>
                    <button onClick={() => setShowAddFile(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateFile} className="p-5 space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Document Filename (with extension)</label>
                      <input
                        type="text"
                        required
                        value={newFileData.name}
                        onChange={e => setNewFileData({...newFileData, name: e.target.value})}
                        placeholder="e.g., MDA-ELY-ZZ-XX-DR-A-0001-S3-P01.dwg"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500 font-mono"
                      />
                      <p className="text-[9px] text-slate-500 mt-1">Recommended format: <strong className="text-teal-400">MDA-ELY-ZZ-XX-DR-A-0001-S2-P01.dwg</strong></p>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Compliance accessibility level</label>
                      <select
                        value={newFileData.accessLevel}
                        onChange={e => setNewFileData({...newFileData, accessLevel: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                      >
                        <option value="TEAM">Project Team internal only (Default)</option>
                        <option value="CLIENT">Shared with Client Partner</option>
                        <option value="PUBLIC">Public Archive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Scope / Brief details</label>
                      <textarea
                        value={newFileData.description}
                        onChange={e => setNewFileData({...newFileData, description: e.target.value})}
                        placeholder="Ground lobby layout revision, tender packages..."
                        rows={2}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddFile(false)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
                      >
                        Upload to Vault
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Modal Konfirmasi Penghapusan dengan Password Super Admin */}
            {deleteTarget && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-rose-950 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
                  <div className="p-5 border-b border-rose-950/50 flex justify-between items-center bg-slate-950">
                    <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500" />
                      Konfirmasi Otentikasi Hapus Data
                    </h3>
                    <button 
                      onClick={() => setDeleteTarget(null)} 
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs leading-relaxed space-y-1">
                      <p className="font-bold">⚠️ PERINGATAN TINDAKAN PERMANEN:</p>
                      <p>
                        Anda mencoba menghapus <strong className="text-white">"{deleteTarget.name}"</strong> ({deleteTarget.type}). Tindakan ini ireversibel dan akan terekam ke dalam log kepatuhan ISO 19650 secara permanen.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-400">
                        Sandi Otorisasi (Password Admin/Super User)
                      </label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={deleteAuthPassword}
                          onChange={e => setDeleteAuthPassword(e.target.value)}
                          placeholder="Masukkan kata sandi Admin..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:ring-1 focus:ring-rose-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {deleteError && (
                      <div className="p-2.5 bg-rose-500/15 border border-rose-500/20 rounded-xl text-rose-400 text-[10px] leading-tight font-semibold">
                        {deleteError}
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget(null);
                          setDeleteAuthPassword('');
                          setDeleteError('');
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={authorizeDelete}
                        className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-rose-600/10 cursor-pointer"
                      >
                        Sahkan Penghapusan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RECRUITMENT SANDBOX */}
        {activeTab === 'sandbox' && (
          <div className="space-y-6 animate-fade-in">
            {/* Split screen layout: Prompt Form on Left vs Generated outputs on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Prompt Controls Left Panel (lg:col-span-4) */}
              <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
                <div>
                  <h2 className="text-md font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-400 animate-pulse" />
                    Generator Rekrutmen & Evaluasi
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Masukkan parameter kebutuhan peran arsitektural atau teknik sipil. Sistem Cloud akan memproses dan menyusun Draf Deskripsi Pekerjaan teroptimasi serta 10 Pertanyaan Evaluasi Wawancara terstruktur.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Catatan Mentah / Parameter Peran</label>
                  <textarea
                    value={rawNotes}
                    onChange={(e) => setRawNotes(e.target.value)}
                    placeholder="Tuliskan keahlian yang dicari, estimasi pengalaman kerja, ekspektasi standard Revit/ISO, dan karakter kerja..."
                    rows={8}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:ring-1 focus:ring-teal-500 font-sans"
                  />
                </div>

                {aiError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-rose-400 text-[10px]">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                <button
                  onClick={handleAskGemini}
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                >
                  {aiLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      Menghubungkan Server Cloud...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      Hasilkan Paket Rekrutmen
                    </>
                  )}
                </button>

                <div className="border-t border-slate-900 pt-4 text-[10px] text-slate-500 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Koneksi aman terenkripsi melalui API Server Torky Cloud.</span>
                </div>
              </div>

              {/* Outputs Right Panel (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-6">
                {aiLoading ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-16 text-center space-y-4 shadow-xl">
                    <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <h3 className="text-white font-bold text-sm">Menghubungkan Server Cloud Rekrutmen...</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Menganalisis kompetensi teknis, kecakapan non-teknis, serta kepatuhan standar industri AEC untuk menyusun draf profesional...
                    </p>
                  </div>
                ) : jobDescription ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tab 1: LinkedIn Job Description */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-teal-400" />
                          <h3 className="font-bold text-white text-xs">1) LinkedIn Job Description</h3>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          Copy Ready
                        </span>
                      </div>
                      
                      {/* Text content rendered as beautiful clean scrollable markdown */}
                      <div className="text-[11px] text-slate-300 space-y-2 max-h-[500px] overflow-y-auto pr-2 font-mono whitespace-pre-wrap leading-relaxed">
                        {jobDescription}
                      </div>

                      <div className="pt-3 border-t border-slate-900">
                        <button
                          onClick={() => {
                            copyToClipboard(jobDescription);
                            alert('Job Description copied to clipboard successfully!');
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/30 text-slate-300 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Copy Job Description String
                        </button>
                      </div>
                    </div>

                    {/* Tab 2: Interview Guide */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          <h3 className="font-bold text-white text-xs">2) Behavioral Interview Guide</h3>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          10 Questions
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-slate-300 space-y-2 max-h-[500px] overflow-y-auto pr-2 font-mono whitespace-pre-wrap leading-relaxed">
                        {interviewGuide}
                      </div>

                      <div className="pt-3 border-t border-slate-900">
                        <button
                          onClick={() => {
                            copyToClipboard(interviewGuide);
                            alert('Interview Guide copied to clipboard successfully!');
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-slate-300 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Copy Interview Guide String
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-16 text-center space-y-4 shadow-xl">
                    <Sparkles className="w-12 h-12 text-slate-700 mx-auto" />
                    <h3 className="text-white font-bold text-sm">Design & Recruitment Workspace</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click the generate button to transform raw notes into compliance and hiring assets.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: COMPLIANCE AUDIT TRAILS */}
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Security & Compliance Audit Trail</h2>
                <p className="text-xs text-slate-400">Complete immutable record of all user, project, folder, and database events.</p>
              </div>
              <span className="text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/25 px-3 py-1.5 rounded-xl">
                ISO 19650-1 Section 10 Compliant
              </span>
            </div>

            {/* Audit Logs Table Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3 bg-slate-950">
                <div className="flex gap-2">
                  <button
                    onClick={() => setLogActionFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      logActionFilter === 'ALL' ? 'bg-slate-800 text-teal-400 border-slate-700' : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    All Logs
                  </button>
                  <button
                    onClick={() => setLogActionFilter('UPLOAD')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      logActionFilter === 'UPLOAD' ? 'bg-slate-800 text-teal-400 border-slate-700' : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    File Uploads
                  </button>
                  <button
                    onClick={() => setLogActionFilter('LOGIN')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      logActionFilter === 'LOGIN' ? 'bg-slate-800 text-teal-400 border-slate-700' : 'text-slate-400 border-transparent hover:text-slate-200'
                    }`}
                  >
                    Access Logs
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/50 uppercase tracking-wider font-bold">
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Log ID</th>
                      <th className="p-4">Actor</th>
                      <th className="p-4">Event Type / ID</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">IP Address</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {auditLogs
                      .filter(log => logActionFilter === 'ALL' || log.action === logActionFilter)
                      .map(log => (
                        <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4 whitespace-nowrap text-slate-300 font-semibold">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="p-4 text-slate-500 text-[10px]">{log.id}</td>
                          <td className="p-4 text-white font-bold">{log.userEmail}</td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                              {log.entityType} ({log.entityId.substring(0, 8)})
                            </span>
                          </td>
                          <td className="p-4 text-slate-300 max-w-[280px] truncate" title={log.description}>{log.description}</td>
                          <td className="p-4 text-slate-400">{log.ipAddress}</td>
                          <td className="p-4">
                            <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TRUENAS SAMBA SHARE CONFIGURATOR */}
        {activeTab === 'samba' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Konfigurasi TrueNAS SCALE & Samba Share</h2>
                <p className="text-xs text-slate-400">Pengaturan interaktif untuk pemetaan datasheet / Samba pool pada komputer admin dan anak design.</p>
              </div>
              <span className="text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/25 px-3 py-1.5 rounded-xl">
                TrueNAS SCALE Native Integration
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Form setting configurator */}
              <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Settings className="w-4 h-4" /> Parameter Koneksi Samba
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">TrueNAS Server IP</label>
                    <input
                      type="text"
                      value={sambaConfig.serverIp}
                      onChange={e => setSambaConfig({...sambaConfig, serverIp: e.target.value})}
                      placeholder="e.g., 192.168.1.150"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Nama Pool (Samba Pool)</label>
                    <input
                      type="text"
                      value={sambaConfig.poolName}
                      onChange={e => setSambaConfig({...sambaConfig, poolName: e.target.value})}
                      placeholder="e.g., ArchPoolNAS"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Status Mapping</label>
                    <select
                      value={sambaConfig.mappedStatus}
                      onChange={e => setSambaConfig({...sambaConfig, mappedStatus: e.target.value as any})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-1 focus:ring-1 focus:ring-teal-500"
                    >
                      <option value="MAPPED">Tersambung (MAPPED)</option>
                      <option value="UNMAPPED">Belum Terhubung (UNMAPPED)</option>
                      <option value="DISCONNECTED">Terputus (DISCONNECTED)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Pembaruan terakhir:</span>
                  <span className="font-mono text-slate-300">{new Date(sambaConfig.lastHealthCheck).toLocaleTimeString()}</span>
                </div>

                <button
                  onClick={() => {
                    setSambaConfig({
                      ...sambaConfig,
                      lastHealthCheck: new Date().toISOString()
                    });
                    addAuditLog('UPDATE', 'FOLDER', 'truenas-samba', 'TrueNAS SCALE', `Melakukan health-check dan memperbarui status pool ${sambaConfig.poolName} pada IP ${sambaConfig.serverIp}`);
                    alert('Status Server TrueNAS & Samba Share berhasil di-verify segar!');
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-teal-400 border border-teal-500/20 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                >
                  Uji Koneksi Server
                </button>
              </div>

              {/* Mapping Details */}
              <div className="lg:col-span-8 space-y-6">
                {/* Policy Matrix Display */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                    Kebijakan Hak Akses Datasheet & Samba Share (RBAC)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sistem memetakan 3 datasheet khusus dari pool <code className="text-teal-400 font-mono">{sambaConfig.poolName}</code> pada server <code className="text-teal-400 font-mono">{sambaConfig.serverIp}</code> dengan hak akses spesifik per komputer:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Share admin */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-slate-500">Share 1 / 3</span>
                        {currentUser.role === 'USER' ? (
                          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[8px] font-bold">TERKUNCI</span>
                        ) : (
                          <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded text-[8px] font-bold">AKSES EDIT</span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs">\\{sambaConfig.serverIp}\{sambaConfig.poolName}_admin</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Berisi dokumen finansial, kontrak klien, data rekrutmen karyawan, dan log internal.</p>
                      
                      <div className="pt-2 flex flex-col gap-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Komputer PM/Admin:</span>
                          <span className="text-teal-400 font-bold">Read & Write</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Komputer Designer:</span>
                          <span className="text-rose-400 font-bold">BLOCKED</span>
                        </div>
                      </div>
                      {currentUser.role === 'USER' && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 text-center">
                          <Lock className="w-5 h-5 text-rose-500 mb-1" />
                          <p className="text-[10px] font-bold text-rose-400">Akses Terblokir</p>
                          <p className="text-[8px] text-slate-400 leading-none">Bukan Komputer Admin Kantor</p>
                        </div>
                      )}
                    </div>

                    {/* Share projects */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-slate-500">Share 2 / 3</span>
                        <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded text-[8px] font-bold">AKSES PENUH</span>
                      </div>
                      <h4 className="font-bold text-white text-xs">\\{sambaConfig.serverIp}\{sambaConfig.poolName}_projects</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Penyimpanan CAD, gambar AutoCAD/SketchUp, render, dan file revisi ISO 19650.</p>
                      
                      <div className="pt-2 flex flex-col gap-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Komputer PM/Admin:</span>
                          <span className="text-teal-400 font-bold">Read & Write</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Komputer Designer:</span>
                          <span className="text-teal-400 font-bold">Read & Write</span>
                        </div>
                      </div>
                    </div>

                    {/* Share library */}
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-slate-500">Share 3 / 3</span>
                        <span className="bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded text-[8px] font-bold">AKSES PENUH</span>
                      </div>
                      <h4 className="font-bold text-white text-xs">\\{sambaConfig.serverIp}\{sambaConfig.poolName}_library</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Berisi template DWG, pustaka aset 3D SketchUp, kop surat arsitek, dan standar ISO.</p>
                      
                      <div className="pt-2 flex flex-col gap-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Komputer PM/Admin:</span>
                          <span className="text-teal-400 font-bold">Read & Write</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Komputer Designer:</span>
                          <span className="text-teal-400 font-bold">Read & Write</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commands Terminal View */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-xs flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-cyan-400" />
                    Skrip Terminal untuk Mapping Otomatis di Klien
                  </h3>
                  <p className="text-xs text-slate-400">
                    Salin skrip terminal berikut dan jalankan pada komputer klien untuk secara instan memetakan folder TrueNAS Samba sebagai Drive eksternal:
                  </p>

                  <div className="space-y-4">
                    {/* Windows Command */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-400"></span> Sistem Operasi Windows (cmd / PowerShell)
                      </p>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-slate-200 space-y-1 select-all">
                        <p>:: Hubungkan Datasheet Projects sebagai Drive P:</p>
                        <p className="text-teal-400 font-bold">net use P: \\{sambaConfig.serverIp}\{sambaConfig.poolName}_projects /user:desainer sandi123 /persistent:yes</p>
                        <p className="mt-1">:: Hubungkan Datasheet Library sebagai Drive L:</p>
                        <p className="text-teal-400 font-bold">net use L: \\{sambaConfig.serverIp}\{sambaConfig.poolName}_library /user:desainer sandi123 /persistent:yes</p>
                        {currentUser.role !== 'USER' && (
                          <>
                            <p className="mt-1">:: Hubungkan Datasheet Admin sebagai Drive A: (Khusus Admin Kantor)</p>
                            <p className="text-cyan-400 font-bold">net use A: \\{sambaConfig.serverIp}\{sambaConfig.poolName}_admin /user:admin sandiAdmin123 /persistent:yes</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* macOS/Linux Command */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Sistem Operasi macOS & Linux
                      </p>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[10px] text-slate-200 space-y-1 select-all">
                        <p># Mount Projects Share ke folder lokal</p>
                        <p className="text-teal-400 font-bold">mount -t cifs -o username=desainer,password=sandi123 //{sambaConfig.serverIp}/{sambaConfig.poolName}_projects /Volumes/projects</p>
                        <p className="mt-1"># Mount Library Share ke folder lokal</p>
                        <p className="text-teal-400 font-bold">mount -t cifs -o username=desainer,password=sandi123 //{sambaConfig.serverIp}/{sambaConfig.poolName}_library /Volumes/library</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cyber Security Audit and Protection */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-xs flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-500" />
                      Status Proteksi Siber, Ransomware & Integritas Data
                    </h3>
                    <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full font-bold">
                      Shield Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Server TrueNAS dikonfigurasi dengan kebijakan proteksi siber tingkat lanjut untuk menjamin kebal dari ransomware, malware, dan kesalahan manusia:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex gap-3">
                      <div className="w-5 h-5 shrink-0 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">✓</div>
                      <div>
                        <h4 className="text-[11px] font-bold text-white">Snapshot ZFS Berkala (Read-Only)</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Snapshot otomatis berjalan setiap jam pada server TrueNAS. Jika terkena Ransomware, data dapat di-rollback ke menit sebelumnya secara instan.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex gap-3">
                      <div className="w-5 h-5 shrink-0 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">✓</div>
                      <div>
                        <h4 className="text-[11px] font-bold text-white">Samba FSR Ransomware Shield</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Algoritma otomatis memantau rasio perubahan file di server. Deteksi lonjakan perubahan massal DWG akan langsung mematikan sesi Samba mencurigakan.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex gap-3">
                      <div className="w-5 h-5 shrink-0 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">✓</div>
                      <div>
                        <h4 className="text-[11px] font-bold text-white">Enkripsi Paket Data SMB3</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Lalu lintas transfer file terenkripsi penuh dari TrueNAS ke komputer arsitek untuk menangkal serangan MITM (Man-In-The-Middle).</p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex gap-3">
                      <div className="w-5 h-5 shrink-0 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 text-xs font-bold font-mono">✓</div>
                      <div>
                        <h4 className="text-[11px] font-bold text-white">Validasi Checksum File Otomatis</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Setiap dokumen DWG/SketchUp yang diregister secara otomatis dihitung nilai SHA-256 Checksum-nya guna mendeteksi modifikasi liar di Samba share.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 7: COMPREHENSIVE MANUAL BOOK */}
        {activeTab === 'manual' && (
          <div className="space-y-6 animate-fade-in print:bg-white print:text-black">
            {/* Header / Print Action */}
            <div className="flex justify-between items-center print:hidden">
              <div>
                <h2 className="text-xl font-bold text-white">Buku Manual Komprehensif (BIM Standard)</h2>
                <p className="text-xs text-slate-400">Dokumentasi holistik standar manajemen data kantor konsultan arsitektur berkelas enterprise.</p>
              </div>
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-slate-900 hover:bg-slate-800 text-teal-400 border border-teal-500/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" /> Cetak Buku Manual (PDF)
              </button>
            </div>

            {/* Manual Book Document Canvas */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 max-w-4xl mx-auto font-sans text-slate-300 leading-relaxed print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
              
              {/* Document Cover */}
              <div className="border-b-4 border-teal-500 pb-6 text-center space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-extrabold text-teal-400">Dokumen Enterprise Grade - Rahasia Kantor</p>
                <h1 className="text-3xl font-black text-white tracking-tight print:text-black">MANUAL OPERASIONAL MANAJEMEN DATA</h1>
                <p className="text-xs text-slate-400 print:text-black">Implementasi Standar BIM ISO 19650 dengan TrueNAS Samba Share & Alur Kerja CAD Tradisional</p>
                <div className="text-[10px] text-slate-500 flex justify-center gap-4 font-mono">
                  <span>Revisi: R1.0 (Enterprise)</span>
                  <span>•</span>
                  <span>Tanggal: Juli 2026</span>
                  <span>•</span>
                  <span>Penulis: Lead Data Architect</span>
                </div>
              </div>

              {/* Table of Contents */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-2 print:hidden">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Daftar Isi Buku Panduan</h3>
                <ul className="text-xs space-y-1.5 text-slate-400 font-medium">
                  <li><a href="#ch1" className="hover:text-teal-400 transition-colors">1. Filosofi BIM & ISO 19650 pada Workflow Non-BIM (AutoCAD & SketchUp)</a></li>
                  <li><a href="#ch2" className="hover:text-teal-400 transition-colors">2. Arsitektur Datasheet TrueNAS Server & Samba Share Mapping (RBAC Policy)</a></li>
                  <li><a href="#ch3" className="hover:text-teal-400 transition-colors">3. Protokol Keamanan Siber: Ransomware Shield, Snapshots & File Integrity Audit</a></li>
                  <li><a href="#ch4" className="hover:text-teal-400 transition-colors">4. Pedoman Kode Penamaan ISO 19650-2 Untuk File Proyek</a></li>
                  <li><a href="#ch5" className="hover:text-teal-400 transition-colors">5. Deployment Server: Instalasi sebagai Docker Container di TrueNAS SCALE</a></li>
                  <li><a href="#ch6" className="hover:text-teal-400 transition-colors">6. Alur Lisensi Offline & Kurikulum Pelatihan (Training) Staf & Klien Mandiri</a></li>
                </ul>
              </div>

              {/* Chapter 1 */}
              <div id="ch1" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-2 flex items-center gap-2 print:text-black">
                  <span className="bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded text-xs print:bg-slate-200 print:text-black font-sans">Bab 1</span>
                  Workflow Standard BIM ISO 19650 Menggunakan AutoCAD & SketchUp
                </h2>
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed print:text-black">
                  <p>
                    BIM (Building Information Modeling) bukan sekadar tentang aplikasi canggih seperti Archicad atau Revit. BIM adalah <strong>filosofi pengelolaan data, koordinasi terstruktur, dan standardisasi alur kerja kolaboratif</strong>. Di dalam standar internasional <strong>ISO 19650</strong>, aspek terpenting adalah Common Data Environment (CDE) dan keteraturan folder.
                  </p>
                  <p className="font-bold text-slate-200 print:text-black">Bagaimana Mengaplikasikan BIM Menggunakan AutoCAD & SketchUp?</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Pembagian Layer Berstandar:</strong> Penggunaan template layer AutoCAD yang disiplin (misal: A-WALL, A-DOOR, A-FLOR) wajib dipatuhi untuk menggantikan sistem klasifikasi objek di aplikasi BIM parametrik.</li>
                    <li><strong>XREF (External References):</strong> Arsitek harus memecah file AutoCAD menjadi modul-modul (misal: XREF denah dasar, XREF struktur kolom, XREF tata ruang interior) lalu menggabungkannya dalam berkas master koordinasi dwg. Ini setara dengan alur kerja link-model Revit.</li>
                    <li><strong>Standardisasi Komponen SketchUp:</strong> Semua modul objek SketchUp harus didefinisikan sebagai <em>Components</em> dengan penamaan terstandarisasi, bukan grup acak, sehingga dapat diekspor menjadi laporan daftar volume material (Material Take-Off) jika diperlukan.</li>
                    <li><strong>Gerbang Fase CDE:</strong> File dilarang disimpan di harddisk lokal komputer desainer. Semua file pengerjaan (Work In Progress) wajib disimpan langsung di Samba Share TrueNAS untuk audit berkala.</li>
                  </ul>
                </div>
              </div>

              {/* Chapter 2 */}
              <div id="ch2" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-2 flex items-center gap-2 print:text-black">
                  <span className="bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded text-xs print:bg-slate-200 print:text-black font-sans">Bab 2</span>
                  Arsitektur Datasheet TrueNAS Server & Samba Share Mapping (RBAC)
                </h2>
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed print:text-black">
                  <p>
                    Sistem TrueNAS dikonfigurasi untuk membatasi akses demi menjaga keamanan dokumen krusial kantor konsultan arsitektur. Kami membagi repositori menjadi 3 datasheet/share utama yang dipetakan pada klien:
                  </p>
                  <div className="space-y-2">
                    <p className="font-bold text-slate-200">1. Datasheet ADMIN (<code className="text-teal-400 bg-slate-900 px-1 py-0.5 rounded font-mono">admin</code>)</p>
                    <p className="pl-4">Hanya dipetakan ke Komputer Pimpinan Kantor dan Admin Keuangan. Komputer anak design tidak memiliki hak baca (Read) ataupun tulis (Write) pada share ini. Berisi surat kontrak arsitek, anggaran biaya proyek (RAB), slip gaji karyawan, tagihan proyek, serta dokumentasi legalitas legal firma.</p>

                    <p className="font-bold text-slate-200">2. Datasheet PROJECTS (<code className="text-teal-400 bg-slate-900 px-1 py-0.5 rounded font-mono">projects</code>)</p>
                    <p className="pl-4">Dipetakan ke seluruh Komputer Kantor (Admin & Design Team). Berisi direktori proyek ISO 19650. Arsitek, PM, dan drafster dapat berkolaborasi langsung melakukan pembacaan, pengeditan gambar kerja CAD, model SketchUp, dan hasil rendering secara real-time.</p>

                    <p className="font-bold text-slate-200">3. Datasheet LIBRARY (<code className="text-teal-400 bg-slate-900 px-1 py-0.5 rounded font-mono">library</code>)</p>
                    <p className="pl-4">Pustaka aset bersama. Menyimpan template AutoCAD dwt, hatch pattern custom, material SketchUp, pustaka blok furnitur, brosur spesifikasi teknis dari supplier material, kop gambar (title block), dan buku panduan instruksi kerja kantor.</p>
                  </div>
                  <p className="font-bold text-slate-200">Panduan Praktis Samba Mapping:</p>
                  <p className="pl-2">
                    Gunakan skrip pemetaan Drive Windows otomatis menggunakan perintah <code className="text-teal-400 bg-slate-900 px-1 py-0.5 rounded font-mono">net use</code> pada cmd klien agar drive langsung muncul sebagai Drive P: dan L: saat Windows melakukan startup booting. Pastikan opsi <code className="text-slate-400 font-mono">/persistent:yes</code> diaktifkan.
                  </p>
                </div>
              </div>

              {/* Chapter 3 */}
              <div id="ch3" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-2 flex items-center gap-2 print:text-black">
                  <span className="bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded text-xs print:bg-slate-200 print:text-black font-sans">Bab 3</span>
                  Ketangguhan Sistem Keamanan Siber: Ransomware & Malware Shield
                </h2>
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed print:text-black">
                  <p>
                    Sebagai kantor konsultan arsitektur berskala enterprise, berkas CAD/DWG dan 3D SketchUp adalah aset kekayaan intelektual terpenting. Kehilangan data akibat virus ransomware dapat menghancurkan bisnis. Sistem pertahanan siber diimplementasikan dengan strategi pertahanan berlapis:
                  </p>
                  <ul className="list-decimal pl-5 space-y-2">
                    <li>
                      <strong>Snapshot ZFS Berkala (Immutable Backups):</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">TrueNAS dikonfigurasi untuk membuat Snapshot ZFS setiap 1 jam secara otomatis. Snapshot bersifat Read-Only (tidak bisa diubah bahkan oleh administrator yang terinfeksi ransomware). Jika komputer anak design terinfeksi malware dan mengenkripsi seluruh file di projects share, admin cukup me-rollback pool projects ke snapshot beberapa menit sebelum infeksi terjadi. Data kembali 100% tanpa membayar tebusan.</p>
                    </li>
                    <li>
                      <strong>Samba File System Rate (FSR) Sensor:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sebuah bot internal di TrueNAS terus-menerus mengaudit jumlah perubahan file per menit. Ransomware biasanya memodifikasi berkas dengan sangat cepat. Jika rasio edit file melebihi batas wajar pada satu alamat IP klien, TrueNAS secara otomatis memblokir IP tersebut dari jaringan Samba Share guna mengisolasi penyebaran malware.</p>
                    </li>
                    <li>
                      <strong>SHA-256 File Integrity Monitoring:</strong>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sistem ini menghitung kode unik SHA-256 (Checksum) untuk setiap file DWG yang diupload. Sistem akan memindai berkas secara berkala. Perubahan Checksum secara mendadak pada file yang terkunci (fase Shared atau Published) akan langsung memicu alert keamanan sistem.</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Chapter 4 */}
              <div id="ch4" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-2 flex items-center gap-2 print:text-black">
                  <span className="bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded text-xs print:bg-slate-200 print:text-black font-sans">Bab 4</span>
                  Pedoman Kode Penamaan Dokumen Proyek ISO 19650
                </h2>
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed print:text-black">
                  <p>
                    Sesuai petunjuk <strong>ISO 19650-2 National Annex</strong>, semua nama berkas gambar DWG, PDF, xlsx, atau rvt wajib menggunakan format kode terstandardisasi yang terdiri dari beberapa kolom data terpisah oleh karakter strip (-):
                  </p>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-1">
                    <p className="text-teal-400 font-bold">[Proyek]-[Originator]-[Volume]-[Level]-[Tipe]-[Role]-[Nomor]-[Kesesuaian]-[Revisi]</p>
                    <p className="text-slate-500 mt-1">Contoh Nyata Berkas AutoCAD Gambar Kerja Arsitektur:</p>
                    <p className="text-white font-bold">MDA-ELY-ZZ-XX-DR-A-0001-S3-P01.dwg</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] pt-1">
                    <div>
                      <h4 className="font-bold text-slate-200">Daftar Kode Kegunaan (Suitability Codes):</h4>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                        <li><code className="text-teal-400">S0</code> : Work in Progress (Drafting tim internal)</li>
                        <li><code className="text-teal-400">S2</code> : Sesuai untuk Informasi Bersama (Shared to Team)</li>
                        <li><code className="text-teal-400">S3</code> : Sesuai untuk Peninjauan Klien (Shared to Client)</li>
                        <li><code className="text-teal-400">S4</code> : Sesuai untuk Persetujuan Pemegang Proyek</li>
                        <li><code className="text-teal-400">S5</code> : Sesuai untuk Pelelangan (Tender Package)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 font-sans">Daftar Kode Tipe Dokumen:</h4>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                        <li><code className="text-teal-400">DR</code> : Drawing (Gambar kerja AutoCAD dwg)</li>
                        <li><code className="text-teal-400">CA</code> : Model 3D (SketchUp skp atau Revit rvt)</li>
                        <li><code className="text-teal-400">SP</code> : Spesifikasi Teknis proyek</li>
                        <li><code className="text-teal-400">BQ</code> : Bill of Quantity (Rencana Anggaran Biaya xlsx)</li>
                        <li><code className="text-teal-400">CO</code> : Korespondensi / Berita Acara</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chapter 5 */}
              <div id="ch5" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-2 flex items-center gap-2 print:text-black">
                  <span className="bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded text-xs print:bg-slate-200 print:text-black font-sans">Bab 5</span>
                  Deployment Server: Panduan Instalasi sebagai Docker Container di TrueNAS SCALE
                </h2>
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed print:text-black">
                  <p>
                    Untuk memastikan keamanan kode sumber (source code) dan mengoptimalkan kolaborasi data secara tersentralisasi, aplikasi <strong>Management Data App (MDA)</strong> ini dirancang untuk dijalankan sebagai <strong>Aplikasi Kontainer (Docker)</strong> yang terpasang langsung di dalam sistem operasi <strong>TrueNAS SCALE</strong> kantor konsultan arsitektur Anda.
                  </p>
                  
                  <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white text-[11px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span> Mengapa Menggunakan TrueNAS SCALE?
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Berbeda dari TrueNAS Core yang berbasis FreeBSD, TrueNAS SCALE berbasis Debian Linux yang memiliki runtime Docker & Kubernetes bawaan (K3s). Hal ini memungkinkan web app berbasis Node.js/Express+Vite dideploy secara native, efisien, aman di balik container, dan terisolasi dari workstation klien biasa sehingga mustahil bagi pengguna lokal untuk menduplikasi source code aplikasi ini.
                    </p>
                  </div>

                  <p className="font-bold text-slate-200">Langkah 1: Membuat Dataset & User SMB di TrueNAS SCALE</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                    <li>
                      Masuk ke Web UI TrueNAS SCALE Anda, arahkan ke menu <strong>Datasets</strong>.
                    </li>
                    <li>
                      Pada root pool Anda (misal: <code className="text-teal-400 font-mono">AreaNAS</code>), buatlah tiga sub-dataset khusus dengan menekan tombol <strong>Add Dataset</strong>:
                      <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                        <li><code className="text-teal-300 font-mono">admin</code> (Dataset khusus manajemen dokumen finansial/legalitas)</li>
                        <li><code className="text-teal-300 font-mono">projects</code> (Dataset koordinasi gambar CAD & model 3D)</li>
                        <li><code className="text-teal-300 font-mono">library</code> (Dataset pustaka arsitektur & template dwt/skp)</li>
                      </ul>
                    </li>
                    <li>
                      Buatlah dua User Group pada menu <strong>Credentials &gt; Local Users & Groups</strong>:
                      <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                        <li><code className="text-cyan-300 font-mono">admin_group</code> (Untuk pimpinan dan admin keuangan)</li>
                        <li><code className="text-cyan-300 font-mono">design_group</code> (Untuk seluruh tim arsitek, drafter, dan drafster)</li>
                      </ul>
                    </li>
                    <li>
                      Konfigurasikan <strong>Dataset Permissions (ACL)</strong> untuk membatasi hak akses:
                      <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                        <li>Dataset <code className="text-slate-200 font-mono">admin</code>: Berikan hak <strong>Full Control (Read/Write)</strong> hanya untuk group <code className="text-cyan-300 font-mono">admin_group</code>. Blokir atau hilangkan akses sepenuhnya untuk group <code className="text-cyan-300 font-mono">design_group</code>.</li>
                        <li>Dataset <code className="text-slate-200 font-mono">projects</code> & <code className="text-slate-200 font-mono">library</code>: Berikan hak <strong>Full Control (Read/Write)</strong> untuk kedua group (<code className="text-cyan-300 font-mono">admin_group</code> & <code className="text-cyan-300 font-mono">design_group</code>).</li>
                      </ul>
                    </li>
                  </ol>

                  <p className="font-bold text-slate-200 mt-2">Langkah 2: Melakukan Deployment Kontainer Aplikasi di TrueNAS SCALE</p>
                  <p>
                    Aplikasi ini dapat di-deploy dengan membuat kustom kontainer (Custom App) pada TrueNAS SCALE:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                    <li>
                      Buka menu <strong>Apps</strong> di Web UI TrueNAS SCALE, klik <strong>Discover Apps</strong> lalu pilih <strong>Custom App</strong> (atau tombol <strong>Launch Docker Image</strong> di pojok kanan atas).
                    </li>
                    <li>
                      Konfigurasikan parameter kontainer sebagai berikut:
                      <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-400">
                        <li><strong>Application Name:</strong> <code className="text-teal-400 font-mono">data-architect-mda</code></li>
                        <li><strong>Image Repository:</strong> <code className="text-teal-400 font-mono">torkykomputer/mda-vault</code></li>
                        <li><strong>Image Tag:</strong> <code className="text-teal-400 font-mono">latest</code></li>
                        <li><strong>Port Forwarding (Container Port &gt; Host Port):</strong> Hubungkan port kontainer <code className="text-white font-mono">3000</code> ke port host TrueNAS Anda (Masukkan <code className="text-teal-400 font-mono">3030</code> agar aplikasi dapat diakses melalui port khusus 3030 secara terdedikasi).</li>
                        <li><strong>Environment Variables:</strong> Tambahkan variabel lingkungan rahasia <code className="text-amber-400 font-mono">GEMINI_API_KEY</code> yang berisi Kunci Server Verifikasi Cloud Anda untuk mengaktifkan fitur pengolah modul deskripsi pekerjaan dan rekrutmen.</li>
                      </ul>
                    </li>
                    <li>
                      Klik <strong>Save / Install</strong> dan tunggu TrueNAS SCALE selesai menarik docker image, membangun pod, serta mengubah status kontainer menjadi <strong>Active / Running</strong>.
                    </li>
                  </ol>

                  <p className="font-bold text-slate-200 mt-2">Langkah 3: Akses dari Komputer Klien Windows/macOS</p>
                  <p>
                    Setelah kontainer aktif, seluruh komputer di jaringan kantor dapat membuka aplikasi ini secara bersamaan tanpa perlu menginstall apapun secara lokal di masing-masing PC:
                  </p>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-300">
                    <p className="text-slate-500">:: Alamat Akses Aplikasi di Browser Komputer Klien (Ketik di Google Chrome / Edge):</p>
                    <p className="text-teal-400 font-bold">http://[IP_TrueNAS_Server]:3030</p>
                    <p className="text-slate-500 mt-1">:: Contoh Nyata:</p>
                    <p className="text-white font-bold">http://192.168.1.254:3030</p>
                  </div>
                  <p>
                    Metode arsitektur tersentralisasi ini menjamin aplikasi web Anda aman dari pencurian, terintegrasi penuh ke tangguhnya ZFS storage, serta memudahkan monitoring log compliance ISO 19650 secara real-time.
                  </p>
                </div>
              </div>

              {/* Chapter 6 */}
              <div id="ch6" className="space-y-3 scroll-mt-20">
                <h2 className="text-base font-extrabold text-white border-b border-slate-800 pb-2 flex items-center gap-2 print:text-black">
                  <span className="bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded text-xs print:bg-slate-200 print:text-black font-sans">Bab 6</span>
                  Alur Lisensi Offline & Kurikulum Pelatihan (Training) Staf & Klien Mandiri
                </h2>
                <div className="text-xs text-slate-300 space-y-3 leading-relaxed print:text-black">
                  <p>
                    Sebagai pemegang sah hak distribusi software ini, Anda wajib menguasai perbedaan arsitektur antara <strong>Komputer Lokal Pengembang (Milik Anda)</strong> dan <strong>Server Jaringan Kantor (Milik Klien)</strong> agar proses deployment dan training berjalan sempurna.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/30 border border-slate-800 p-4 rounded-xl">
                    <div>
                      <h4 className="font-bold text-teal-400 text-[11px] mb-1">💻 KOMPUTER LOKAL ANDA (OWNER)</h4>
                      <p className="text-[10px] text-slate-400">
                        Lokasi ekstraksi file ZIP asli (contoh: <code className="text-white font-mono text-[9px]">G:\Management Data App\management_data_app</code>). Direktori ini berisi file rahasia <code className="text-amber-400 font-mono text-[9px]">keygen.js</code> dan skrip instan <code className="text-amber-400 font-mono text-[9px]">generate.bat</code>. Kedua berkas ini aman karena <strong>tidak akan pernah terupload ke GitHub</strong> karena diabaikan oleh Git. Di komputer inilah Anda membuat Kunci Lisensi khusus untuk dikirimkan ke klien.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-400 text-[11px] mb-1">🖥️ SERVER TRUENAS KLIEN (TARGET)</h4>
                      <p className="text-[10px] text-slate-400">
                        Mesin server TrueNAS SCALE di kantor klien yang menjalankan kontainer Docker aplikasi ini. Klien tidak pernah memiliki kode sumber, file keygen, atau skrip batch pembuat kunci. Aplikasi klien saat pertama kali diinstal akan memindai sidik jari perangkat keras (Hardware Fingerprint) mereka dan menampilkan halaman registrasi terkunci yang memohon Kode Aktivasi.
                      </p>
                    </div>
                  </div>

                  <p className="font-bold text-slate-200">Panduan Langkah Demi Langkah Aktivasi Lisensi Offline (Untuk Anda):</p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                    <li>Klien menginstal aplikasi di TrueNAS SCALE mereka, membuka halaman web <code className="text-slate-200 font-mono">http://[IP_TrueNAS_Klien]:3030</code>, lalu menyalin <strong>ID Mesin Klien</strong> unik yang otomatis tertera di layar.</li>
                    <li>Klien mengirimkan ID Mesin tersebut kepada Anda melalui pesan/email terenkripsi.</li>
                    <li>Di komputer lokal Anda (<code className="text-slate-200 font-mono">G:\...</code>), klik ganda file <strong>`generate.bat`</strong>.</li>
                    <li>Masukkan ID Mesin Klien pada konsol generator interaktif yang muncul, lalu tekan Enter.</li>
                    <li>Salin <strong>Kunci Lisensi</strong> rahasia yang dihasilkan di layar, lalu kirimkan ke klien.</li>
                    <li>Klien memasukkan Kunci Lisensi di halaman aktivasi aplikasi, dan sistem teraktivasi secara permanen secara offline.</li>
                  </ol>

                  <p className="font-bold text-slate-200 mt-2">Silabus Training Klien yang Efektif (Pedoman Pengajaran Anda):</p>
                  
                  <div className="space-y-2">
                    <p className="font-bold text-slate-300 font-sans">Sesi 1: Tim Drafter & Desainer (Disiplin Data Samba Share)</p>
                    <ul className="list-disc pl-5 text-[11px] text-slate-400 space-y-1">
                      <li><strong>Pemetaan Jaringan Windows (Mapping Drive):</strong> Ajari staf cara memetakan dataset dengan klik kanan di Windows Explorer "Map network drive" ke alamat IP TrueNAS.
                        <div className="bg-slate-950 p-2 rounded text-[10px] text-teal-400 font-mono mt-1">
                          net use P: \\192.168.1.254\projects /persistent:yes<br/>
                          net use L: \\192.168.1.254\library /persistent:yes
                        </div>
                      </li>
                      <li><strong>Disiplin Penyimpanan Cad & SketchUp:</strong> Staf dilarang keras menggambar di desktop atau harddisk lokal komputer klien. Semua pekerjaan harus langsung dilakukan di Drive P: agar terproteksi oleh Snapshot ZFS TrueNAS setiap jam.</li>
                      <li><strong>Aturan Penamaan Berkas Gambar ISO 19650-2:</strong> Contohkan cara menamai file gambar CAD secara ketat. Jelaskan bahwa status kesesuaian awal adalah <code className="text-slate-200">S0</code> (WIP/Drafting). Jika gambar siap direview oleh Project Manager, nama file harus diubah kodenya menjadi <code className="text-slate-200">S2</code> (Shared for Info).</li>
                    </ul>

                    <p className="font-bold text-slate-300 mt-2 font-sans">Sesi 2: Pimpinan Kantor & Admin Finansial (Sistem Verifikasi & Log Kepatuhan)</p>
                    <ul className="list-disc pl-5 text-[11px] text-slate-400 space-y-1">
                      <li><strong>Hak Istimewa Akses Admin (RBAC):</strong> Ajarkan admin cara memetakan Drive A: (<code className="text-slate-200 font-mono">\\IP_TrueNAS\admin</code>) khusus untuk file keuangan, anggaran, dan hukum. Yakinkan mereka bahwa staf desainer diblokir total oleh TrueNAS dari akses ke drive ini.</li>
                      <li><strong>Penggunaan Aplikasi Web MDA:</strong> Latih pimpinan untuk login ke aplikasi web MDA di browser (<code className="text-slate-200 font-mono">http://IP_TrueNAS:3030</code>) menggunakan akun Admin mereka untuk mengawasi kepatuhan format nama file kerja arsitek (ISO 19650 Compliance Module), melihat volume log gambar harian, serta mengecek Log Audit (Audit Trail) aktivitas siber guna mendeteksi ancaman pencurian data internal secara real-time.</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-teal-950/20 border border-teal-900/50 rounded-xl mt-3">
                    <p className="text-[10px] text-teal-400 font-bold">Catatan Keamanan Penting untuk Anda:</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Jika harddisk fisik tempat Anda mengekstrak ZIP di komputer lokal Anda rusak, Anda tidak perlu khawatir kehilangan data. Seluruh source code proyek telah aman di-backup di repositori GitHub privat Anda menggunakan utilitas <code className="text-slate-300 font-mono">Auto_Push.bat</code>. Anda tinggal mengunduh ulang ZIP proyek dari GitHub Anda, mengekstraknya di drive mana saja, dan generator lisensi offline Anda lewat <code className="text-slate-300 font-mono">generate.bat</code> akan langsung berfungsi normal tanpa ada perubahan konfigurasi apa pun!
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Endorsement Sign-off */}
              <div className="pt-6 border-t border-slate-800 text-center text-[10px] text-slate-500 space-y-1 print:text-black">
                <p>Dokumentasi ini dilindungi oleh sertifikat keamanan enkripsi data.</p>
                <p>Dilarang menyebarluaskan buku panduan ini ke luar area jaringan internal kantor tanpa persetujuan Root Admin.</p>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Styled Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500 mt-auto space-y-2">
        <p className="font-medium text-slate-400">
          {t.copyright} • Hak Paten Terdaftar Torky Komputer (Yan Torky)
        </p>
        <p className="text-[10px] text-slate-600 font-mono">
          Security Engine: Torky Anti-Duplication Vault v1.1 • Active Hardware Fingerprint Lock • {region} ({timezone})
        </p>
      </footer>
    </div>
  );
}
