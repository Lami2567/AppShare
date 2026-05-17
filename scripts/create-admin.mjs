import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";

const [email, password] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs admin@example.com strong-password");
  process.exit(1);
}

if (!process.env.NEON_DATABASE_URL) {
  console.error("NEON_DATABASE_URL is required.");
  process.exit(1);
}

const sql = neon(process.env.NEON_DATABASE_URL);
const passwordHash = await bcrypt.hash(password, 12);

await sql`
  insert into admins (email, password_hash)
  values (${email.toLowerCase()}, ${passwordHash})
  on conflict (email) do update set password_hash = excluded.password_hash
`;

console.log(`Admin ready: ${email.toLowerCase()}`);
