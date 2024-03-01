const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(userRoutes);
// async function run() {
//   try {
//     app.get("/", (req, res) => {
//       res.send("Hello from Sever!!");
//     });

//     app.get("/fetchData", async (req, res) => {
//       const { data, error } = await supabase.from("user").select();
//       //console.log("DATAAA", data);
//       if (error) {
//         return res
//           .status(500)
//           .json({ error: "Failed to fetch data from Supabase" });
//       }
//       res.json(data);
//     });

//     app.post("/api/newUser", async (req, res) => {
//       try {
//         const { email, name, phone } = req.body;
//         const { data, error } = await supabase.from('user').insert([{ email, phone, name, content }]);
//         if (error) {
//           throw error;
//         }
//         res.status(201).json({ success: true, data });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, error: 'Internal Server Error'});
//     }
//     });

//     app.listen(port, () => {
//       console.log(`Server listening on port ${port}`);
//     });
//   } catch (error) {}
// }
// run();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
