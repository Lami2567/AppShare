export type AppVersion = {
  id: string;
  app_id: string;
  version_name: string;
  changelog: string;
  file_url: string | null;
  file_key?: string | null;
  file_size: number;
  has_download_password?: boolean;
  created_at: string;
};

export type AppRecord = {
  id: string;
  name: string;
  description: string;
  icon_url?: string | null;
  created_at: string;
  updated_at: string;
  current_version?: string | null;
  version_count?: number;
  protected_version_count?: number;
  latest_file_url?: string | null;
  latest_version_id?: string | null;
};

export type AppDetail = AppRecord & {
  versions: AppVersion[];
};
