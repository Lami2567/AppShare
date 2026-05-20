import { neon } from "@neondatabase/serverless";
import type { AppDetail, AppRecord, AppVersion } from "@/lib/types";

const databaseUrl = process.env.NEON_DATABASE_URL;

export function getSql() {
  if (!databaseUrl) {
    throw new Error("NEON_DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

export async function listApps(): Promise<AppRecord[]> {
  const sql = getSql();
  const rows = await sql`
    select
      a.id,
      a.name,
      a.description,
      a.icon_url,
      a.created_at,
      a.updated_at,
      latest.version_name as current_version,
      case when latest.download_password_hash is null then latest.file_url else null end as latest_file_url,
      latest.id as latest_version_id,
      count(v.id)::int as version_count,
      count(v.id) filter (where v.download_password_hash is not null)::int as protected_version_count
    from apps a
    left join lateral (
      select id, version_name, file_url, download_password_hash
      from app_versions
      where app_id = a.id
      order by created_at desc
      limit 1
    ) latest on true
    left join app_versions v on v.app_id = a.id
    group by a.id, latest.id, latest.version_name, latest.file_url, latest.download_password_hash
    order by a.updated_at desc
  `;

  return rows as AppRecord[];
}

export async function getAppById(id: string): Promise<AppDetail | null> {
  const sql = getSql();
  const apps = (await sql`
    select
      a.id,
      a.name,
      a.description,
      a.icon_url,
      a.created_at,
      a.updated_at,
      latest.version_name as current_version,
      case when latest.download_password_hash is null then latest.file_url else null end as latest_file_url,
      latest.id as latest_version_id,
      count(v.id)::int as version_count,
      count(v.id) filter (where v.download_password_hash is not null)::int as protected_version_count
    from apps a
    left join lateral (
      select id, version_name, file_url, download_password_hash
      from app_versions
      where app_id = a.id
      order by created_at desc
      limit 1
    ) latest on true
    left join app_versions v on v.app_id = a.id
    where a.id = ${id}
    group by a.id, latest.id, latest.version_name, latest.file_url, latest.download_password_hash
  `) as AppRecord[];

  if (!apps[0]) {
    return null;
  }

  const versions = (await sql`
    select
      id,
      app_id,
      version_name,
      changelog,
      file_url,
      file_key,
      file_size,
      download_password_hash is not null as has_download_password,
      created_at
    from app_versions
    where app_id = ${id}
    order by created_at desc
  `) as AppVersion[];

  return { ...apps[0], versions };
}

export async function createApp(input: {
  name: string;
  description: string;
  iconUrl?: string | null;
}) {
  const sql = getSql();
  const rows = await sql`
    insert into apps (name, description, icon_url)
    values (${input.name}, ${input.description}, ${input.iconUrl ?? null})
    returning id, name, description, icon_url, created_at, updated_at
  `;
  return rows[0] as AppRecord;
}

export async function updateApp(
  id: string,
  input: { name: string; description: string; iconUrl?: string | null }
) {
  const sql = getSql();
  const rows = await sql`
    update apps
    set name = ${input.name}, description = ${input.description}, icon_url = ${input.iconUrl ?? null}
    where id = ${id}
    returning id, name, description, icon_url, created_at, updated_at
  `;
  return (rows[0] as AppRecord | undefined) ?? null;
}

export async function deleteApp(id: string) {
  const sql = getSql();
  await sql`delete from apps where id = ${id}`;
}

export async function deleteVersion(id: string) {
  const sql = getSql();
  const rows = await sql`
    delete from app_versions
    where id = ${id}
    returning file_key
  `;
  return (rows[0] as { file_key?: string | null } | undefined) ?? null;
}

export async function createVersion(input: {
  appId: string;
  versionName: string;
  changelog: string;
  fileUrl: string;
  fileKey?: string | null;
  fileSize: number;
  downloadPasswordHash?: string | null;
}) {
  const sql = getSql();
  const rows = await sql`
    insert into app_versions (app_id, version_name, changelog, file_url, file_key, file_size, download_password_hash)
    values (
      ${input.appId},
      ${input.versionName},
      ${input.changelog},
      ${input.fileUrl},
      ${input.fileKey ?? null},
      ${input.fileSize},
      ${input.downloadPasswordHash ?? null}
    )
    returning
      id,
      app_id,
      version_name,
      changelog,
      file_url,
      file_key,
      file_size,
      download_password_hash is not null as has_download_password,
      created_at
  `;
  return rows[0] as AppVersion;
}

export async function getVersionForDownload(id: string) {
  const sql = getSql();
  const rows = await sql`
    select id, file_url, file_key, download_password_hash
    from app_versions
    where id = ${id}
    limit 1
  `;
  return (rows[0] as {
    id: string;
    file_url: string;
    file_key?: string | null;
    download_password_hash?: string | null;
  } | undefined) ?? null;
}
