import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL =
    "https://tkzbittdiqqcfamfnmqx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_Wi0bQCaEpIchH5W6d_P_yg_9vElOS5S";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
