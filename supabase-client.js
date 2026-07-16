/*
  ============================================================
  SUPABASE SETUP — read this first
  ============================================================
  This project is already created and connected below:
    Project: jordan-cole-academic (internal project name —
    the site itself is branded as Trevor Travis)
    Region: us-east-1

  The database tables (profiles, projects) and their security
  rules are already live on Supabase's side — nothing more to
  run in the SQL Editor unless you want to add the storage
  bucket for file uploads later (see supabase-schema.sql).

  NOTE: login.html, signup.html, and dashboard.html load the
  Supabase library from a local file (supabase-js.min.js)
  rather than a CDN. This avoids "Cannot access 'supabaseClient'
  before initialization" errors caused by ad blockers or
  browser privacy shields (e.g. Brave Shields) blocking the
  external cdn.jsdelivr.net request. Keep supabase-js.min.js
  in the same folder as these HTML files.
  ============================================================
*/

const SUPABASE_URL = "https://nuhjkabtcnazwrxzfgvz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51aGprYWJ0Y25hendyeHpmZ3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwNTU3MDMsImV4cCI6MjA5OTYzMTcwM30.VoFgrq0Kz-Vf970zPyfz2LrV78FU3Ru0rqqr3AOj5Lo";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---------- Auth helpers used by login.html / signup.html / dashboard.html ---------- */

async function signUpClient({ email, password, fullName, role }) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: role || "client" },
    },
  });
  if (error) throw error;

  // Note: the matching row in the "profiles" table is created
  // automatically by a database trigger (see supabase-schema.sql),
  // not here — this works reliably even when email confirmation
  // delays the user's first active session.
  return data;
}

async function signInClient({ email, password }) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOutClient() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) return null;
  return data.user;
}

// Redirects to login.html if no one is signed in. Call this at the
// top of any page that should be members-only (like dashboard.html).
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login";
  }
  return user;
}

function friendlyAuthError(error) {
  const msg = (error && error.message) || "Something went wrong. Please try again.";
  if (msg.includes("already registered")) return "That email is already registered — try signing in instead.";
  if (msg.includes("Invalid login credentials")) return "Incorrect email or password.";
  if (msg.includes("Password should be")) return "Password must be at least 8 characters.";
  return msg;
}

/* ---------- File upload helpers (used by dashboard.html) ---------- */

// Accepted file types for project attachments.
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

// Uploads a file into the private "drafts" bucket, inside a folder
// named after the user's id (required by the storage security
// policies in supabase-schema.sql, which only allow a user to
// read/write inside their own folder). Returns the storage path,
// which gets saved on the project row (see projects.file_path).
async function uploadDraftFile(userId, file) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error("Only PDF, PNG, JPEG, or WEBP files are allowed.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large — please keep uploads under 20MB.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;

  const { error } = await supabaseClient.storage.from("drafts").upload(path, file);
  if (error) throw error;

  return path;
}

// The "drafts" bucket is private, so files aren't reachable by a
// plain URL — this generates a temporary signed link (valid for
// 1 hour) each time someone wants to view/download a file.
async function getDraftFileUrl(path) {
  const { data, error } = await supabaseClient.storage
    .from("drafts")
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

