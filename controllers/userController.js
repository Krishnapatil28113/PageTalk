const supabase = require("./../supabase/supabaseClient");

exports.getAllusers = async (req, res) => {
  try {
    {
      const { data, error } = await supabase.from("user").select("*");
      //console.log("DATAAA", data);
      if (error) {
        return res
          .status(500)
          .json({ error: "Failed to fetch data from Supabase" });
      }
      res.json(data);
    }
  } catch (error) {}
};

exports.addUser = async (req, res) => {
  try {
    const { data, error: dbError } = await supabase
      .from("user")
      .insert([req.body]);
    if (dbError) {
      throw new Error(dbError.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
