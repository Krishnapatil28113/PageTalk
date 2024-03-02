const express = require("express");
const router = express();
const supabase = require("./../../../supabase/supabaseClient");

router.get("/fetchPDF", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pdf_det")
      .select("id")
      .order("id", { ascending: true })
      .limit(1);

    if (error) {
      return res
        .status(500)
        .json({ error: "Failed to fetch data from Supabase" });
    }

    // Extract the id from the first row (if any)
    const latestId = data.length > 0 ? data[0].id : null;

    res.json({ latestId });
  } catch (error) {
    console.error("Error fetching latest PDF id:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/postPDF", async (req, res) => {
  try {
    const { download_url, id } = req.body; // Assuming the request body contains download_url and id

    // Insert the download_url and id into the pdf_det table
    const { data, error } = await supabase
      .from("pdf_det")
      .insert([{ id, download_url }]);

    if (error) {
      return res
        .status(500)
        .json({ error: "Failed to insert data into Supabase" });
    }

    res.status(200).json({ message: "PDF details inserted successfully" });
  } catch (error) {
    console.error("Error inserting PDF details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
