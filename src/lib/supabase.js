




import { createClient } from "@supabase/supabase-js";

// Initialize Supabase
const supabaseUrl = "https://axqvjvdshchyuyuyshdz.supabase.co"; // Replace with your actual Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4cXZqdmRzaGNoeXV5dXlzaGR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0NzYxODYsImV4cCI6MjA1NjA1MjE4Nn0.SSMZf-vjhIqi2YMErj4-r0RRWsRFeMq7i9Nis-P43t4"; // Replace with your actual Anon key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to upload image and return the URL
const uploadImageAndGetURL = async (file) => {
  if (!file) return { error: "No file selected" };

  const filePath = `avatar/${Date.now()}`;

  const { data, error } = await supabase.storage
    .from("upload-bucket") // Replace with your actual bucket name
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }

  // Get the public URL of the uploaded image
  const { data: urlData } = supabase.storage
    .from("upload-bucket")
    .getPublicUrl(filePath);

  return  urlData.publicUrl
};

export default uploadImageAndGetURL;





