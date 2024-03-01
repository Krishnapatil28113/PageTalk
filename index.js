const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

async function run() {
  try {
    app.get("/", (req, res) => {
      res.send("Hello from Sever!!");
    });

    app.get("/fetchData", async (req, res) => {
      const { data, error } = await supabase.from("user").select();
      //console.log("DATAAA", data);
      if (error) {
        return res
          .status(500)
          .json({ error: "Failed to fetch data from Supabase" });
      }
      res.json(data);
    });

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {}
}
run();

module.exports = app;
