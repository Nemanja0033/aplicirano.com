import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!;
// ili ANON key ako je bucket public  

export const supabaseStorage = createClient(
  supabaseUrl,
  serviceRole
);
