import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROFILE_CACHE_COOKIE = "profile_complete";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 300;

async function fetchProfileWithRetry(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  retries = MAX_RETRIES
): Promise<boolean | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", userId)
        .single();

      if (!error) return !!data?.username;
      
      if (error.code === "PGRST116") return false;
      
      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS * (attempt + 1)));
      }
    } catch {
      if (attempt < retries - 1) {
        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS * (attempt + 1)));
      }
    }
  }

  return null;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (
    pathname !== "/" &&
    !user &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const isOnboarding = pathname === "/onboarding";
    const isPublic =
      pathname.startsWith("/auth") ||
      pathname.startsWith("/api") ||
      pathname === "/";

    if (!isPublic) {
      const cached = request.cookies.get(PROFILE_CACHE_COOKIE)?.value;

      let isComplete: boolean;

      if (cached === "true") {
        isComplete = true;
      } else {
        const result = await fetchProfileWithRetry(supabase, user.id);

        if (result === null) {
          return supabaseResponse;
        }

        isComplete = result;

        if (isComplete) {
          supabaseResponse.cookies.set(PROFILE_CACHE_COOKIE, "true", {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 5,
          });
        }
      }

      if (!isComplete && !isOnboarding) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }

      if (isComplete && isOnboarding) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
  return null;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (
    pathname !== "/" &&
    !user &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    const isOnboarding = pathname === "/onboarding";
    const isPublic =
      pathname.startsWith("/auth") ||
      pathname.startsWith("/api") ||
      pathname === "/";

    if (!isPublic) {
      const cached = request.cookies.get(PROFILE_CACHE_COOKIE)?.value;

      let isComplete: boolean;

      if (cached !== undefined) {
        isComplete = cached === "true";
      } else {
        const result = await fetchProfileWithRetry(supabase, user.id);

        if (result === null) {
          return supabaseResponse;
        }

        isComplete = result;

        supabaseResponse.cookies.set(PROFILE_CACHE_COOKIE, String(isComplete), {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 5,
        });
      }

      if (!isComplete && !isOnboarding) {
        const url = request.nextUrl.clone();
        url.pathname = "/onboarding";
        return NextResponse.redirect(url);
      }

      if (isComplete && isOnboarding) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
