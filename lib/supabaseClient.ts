import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yiccjijuhnyjmfihawcc.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpY2NqaWp1aG55am1maWhhd2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MTEwODMsImV4cCI6MjA3NzQ4NzA4M30.OqwVK_tgSq7qPRc-VqziSh9JIgOg6M_xmB2xExUVgd8"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);