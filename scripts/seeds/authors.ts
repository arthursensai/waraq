import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BATCH_SIZE = 50;
const TARGET_COUNT = 1000;
const DELAY_BETWEEN_REQUESTS_MS = 300;
const DELAY_BETWEEN_BATCHES_MS = 1000;
const RATE_LIMIT_WAIT_MS = 5000;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ===========================
// Types
// ===========================
interface OpenLibraryAuthor {
  key: string;
  name: string;
  bio?: string | { value: string };
  photos?: number[];
}

// ===========================
// Helpers
// ===========================
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const extractBio = (bio: OpenLibraryAuthor["bio"]): string => {
  if (!bio) return "";
  if (typeof bio === "string") return bio.trim();
  return (bio.value ?? "").trim();
};

const getPhotoUrl = (_olid: string, photoId: number): string => {
  return `https://covers.openlibrary.org/a/id/${photoId}-L.jpg`;
};

const extractOlid = (key: string): string => {
  return key.replace("/authors/", "").replace("/", "");
};

// ===========================
// Fetch author details — مع retry عند 429
// ===========================
const fetchAuthorDetails = async (
  authorKey: string,
  retries = 3,
): Promise<OpenLibraryAuthor | null> => {
  const path = authorKey.startsWith("/") ? authorKey : `/authors/${authorKey}`;
  const url = `https://openlibrary.org${path}.json`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60000) });

      if (res.status === 429) {
        console.warn(`⏳ Rate limited (${authorKey}), waiting ${RATE_LIMIT_WAIT_MS / 1000}s...`);
        await sleep(RATE_LIMIT_WAIT_MS);
        continue;
      }

      if (res.status === 404) return null;

      if (!res.ok) {
        console.error(`❌ Details failed for ${authorKey}: ${res.status}`);
        return null;
      }

      return await res.json();
    } catch (err) {
      if (attempt === retries) {
        console.error(`❌ Details fetch error for ${authorKey} after ${retries} attempts:`, err);
        return null;
      }
      console.warn(`⚠️  Attempt ${attempt} failed for ${authorKey}, retrying...`);
      await sleep(1000 * attempt);
    }
  }

  return null;
};

// ===========================
// Fetch author keys page
// ===========================
const fetchAuthorsPage = async (
  offset: number,
  limit: number,
): Promise<string[]> => {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const letter = letters[Math.floor(offset / limit) % letters.length];
  const pageOffset = offset % limit;
  const url = `https://openlibrary.org/search/authors.json?q=${letter}&limit=${limit}&offset=${pageOffset}`;

  try {
    console.log(`🌐 Fetching page: letter=${letter} offset=${pageOffset}`);
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) });

    if (res.status === 429) {
      console.warn(`⏳ Rate limited on page fetch, waiting...`);
      await sleep(RATE_LIMIT_WAIT_MS);
      return fetchAuthorsPage(offset, limit);
    }

    if (!res.ok) {
      console.error(`❌ Page fetch failed: ${res.status}`);
      return [];
    }

    const json = await res.json();
    const keys = (json.docs ?? []).map((a: { key: string }) => a.key);
    console.log(`📚 Found: ${json.numFound} total | this page: ${keys.length}`);
    return keys;
  } catch (err) {
    console.error("❌ Page fetch error:", err);
    return [];
  }
};

// ===========================
// Insert author + image
// ===========================
const insertAuthorWithImage = async (
  author: OpenLibraryAuthor,
): Promise<boolean> => {
  if (!author.name?.trim()) return false;

  const olid = extractOlid(author.key);
  const bio = extractBio(author.bio);
  const photoId = author.photos?.[0];
  const finalBio = bio || "No biography available.";

  try {
    const { data: authorData, error: authorError } = await supabase
      .from("authors")
      .insert({
        full_name: author.name.trim(),
        biography: finalBio,
        type: "public",
        user_id: null,
      })
      .select()
      .single();

    if (authorError) {
      if (authorError.code === "23505") return false; // duplicate
      console.error(`❌ Author insert error (${author.name}):`, authorError.message);
      return false;
    }

    if (photoId && photoId > 0) {
      const imageUrl = getPhotoUrl(olid, photoId);
      const { error: imageError } = await supabase.from("images").insert({
        url: imageUrl,
        key: null,
        type: "public",
        owner_id: authorData.id,
        owner_type: "author",
        user_id: null,
      });

      if (imageError) {
        console.warn(`⚠️  Image insert failed for ${author.name}:`, imageError.message);
      }
    }

    return true;
  } catch (err) {
    console.error(`❌ Unexpected error for ${author.name}:`, err);
    return false;
  }
};

// ===========================
// Main
// ===========================
const main = async () => {
  console.log("🚀 Starting author seed script...\n");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("💥 Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
  }

  let totalInserted = 0;
  let totalFetched = 0;
  let offset = 0;

  while (totalInserted < TARGET_COUNT) {
    console.log(`\n📦 Batch — offset: ${offset} | inserted: ${totalInserted}/${TARGET_COUNT}`);

    const authorKeys = await fetchAuthorsPage(offset, BATCH_SIZE);
    if (authorKeys.length === 0) {
      console.log("⚠️  No more authors found, stopping.");
      break;
    }

    totalFetched += authorKeys.length;
    offset += BATCH_SIZE;

    // ✅ واحد بواحد لتجنب 429
    for (const key of authorKeys) {
      if (totalInserted >= TARGET_COUNT) break;

      const author = await fetchAuthorDetails(key);
      await sleep(DELAY_BETWEEN_REQUESTS_MS);

      if (!author) continue;

      const bio = extractBio(author.bio);
      console.log(`👤 ${author.name} | bio: ${!!bio} | photo: ${!!author.photos?.[0]}`);

      const success = await insertAuthorWithImage(author);
      if (success) {
        totalInserted++;
        console.log(`✅ [${totalInserted}/${TARGET_COUNT}] ${author.name}`);
      }
    }

    console.log(`\n📊 Progress: ${totalInserted}/${TARGET_COUNT} inserted`);
    await sleep(DELAY_BETWEEN_BATCHES_MS);
  }

  console.log("\n🎉 Seed complete!");
  console.log(`   Total fetched : ${totalFetched}`);
  console.log(`   Total inserted: ${totalInserted}`);
};

main().catch((err) => {
  console.error("💥 Fatal error:", err);
  process.exit(1);
});