
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};
