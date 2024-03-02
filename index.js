const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const userRoutes = require("./routes/workspaceRoutes/userRoutes/userRoutes");
const saveNotesRoute = require("./routes/workspaceRoutes/notesRoutes/notesRoutes");
const chatRoutes = require("./routes/workspaceRoutes/chatRoutes/chatRoutes");
const pdfRoutes = require("./routes/homeRoutes/pdfRoutes/pdfRoutes");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(userRoutes);
app.use(saveNotesRoute); // TESTED
app.use(chatRoutes);
app.use(pdfRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
