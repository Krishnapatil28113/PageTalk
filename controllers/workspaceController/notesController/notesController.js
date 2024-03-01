const supabase = require("../../../supabase/supabaseClient");

exports.saveNote = async (req, res) => {
  try {
    const { data } = req.body;

    const { error } = await supabase.from("notes").insert(data);

    if (error) {
      throw error;
    }
    res.status(201).json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to save data" });
  }
};
