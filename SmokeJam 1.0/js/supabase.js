import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://ilqpxtkpvgdzfzzbqiet.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_mB_nofyQG-qOVxS5gFprxg_V9LLwgq7";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);