/**
 * GET method to /projects/:projectId/directories.
 */
export interface CrowdinDirectoriesGET {
  data: {
    data: {
      id: number;
      projectId: number;
      branchId: number;
      directoryId: number;
      name: string;
      title: string;
      exportPattern: string;
      priority: string;
      createdAt: string;
      updatedAt: string;
    };
  }[];
  pagination: {
    offset: number;
    limit: number;
  };
}

/**
 * POST method to /projects/:projectId/directories.
 */
export interface CrowdinDirectoriesPOST {
  data: {
    id: number;
    projectId: number;
    branchId: number;
    directoryId: number;
    name: string;
    title: string;
    exportPattern: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CrowdinFilesGET {
  data: {
    data: {
      id: number;
      projectId: number;
      branchId: number;
      directoryId: number;
      name: string;
      title: string;
      type: string;
      path: string;
      status: string;
    };
  }[];
  pagination: {
    offset: number;
    limit: number;
  };
}

/**
 * POST method to /projects/:projectId/files.
 * PUT method to /projects/:projectId/files/:fileId.
 */
export interface CrowdinFilesPOST {
  data: {
    id: number;
    projectId: number;
    branchId: number;
    directoryId: number;
    name: string;
    title: string;
    type: string;
    path: string;
    status: string;
    revisionId: number;
    priority: string;
    importOptions: Record<string, unknown>;
    exportOptions: Record<string, unknown>;
    excludedTargetLanguages: string[];
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * GET method to /projects/:projectId.
 */
export interface CrowdinProjectGET {
  id: number;
  userId: number;
  sourceLanguageId: string;
  targetLanguageIds: string[];
  languageAccessPolicy: string;
  name: string;
  cname: string;
  identifier: string;
  description: string;
  visibility: string;
  logo: string;
  publicDownloads: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
  targetLanguages: Record<string, unknown>;
}

/**
 * POST method to /storages.
 */
export interface CrowdinStoragePOST {
  data: {
    id: number;
    fileName: string;
  };
}

/**
 * GET method to /projects/:projectId/strings.
 */
export interface CrowdinStringsGET {
  data: {
    data: {
      id: number;
      projectId: number;
      fileId: number;
      branchId: number;
      directoryId: number;
      identifier: string;
      text: string;
      type: string;
      context: string;
      maxLength: number;
      isHidden: boolean;
      revision: number;
      hasPlurals: boolean;
      isIcu: boolean;
      labelIds: number[];
      createdAt: string;
      updatedAt: string;
    };
  }[];
  pagination: {
    offset: number;
    limit: number;
  };
}

/**
 * PATCH method to /projects/:projectId/strings/:stringId.
 */
export interface CrowdinStringsPATCH {
  data: {
    id: number;
    projectId: number;
    fileId: number;
    branchId: number;
    directoryId: number;
    identifier: string;
    text: string;
    type: string;
    context: string;
    maxLength: number;
    isHidden: boolean;
    revision: number;
    hasPlurals: boolean;
    isIcu: boolean;
    labelIds: number[];
    createdAt: string;
    updatedAt: string;
  };
}
