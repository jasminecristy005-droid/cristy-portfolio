console.log("ÉLORA SUPABASE CONFIG LOADED");
const SUPABASE_URL = "https://gmiksxbnsoiahnuoayfa.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_AZeAastat3MZICK41MvYxQ_fOQd5WUR";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);