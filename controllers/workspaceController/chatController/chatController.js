const supabase = require("../../../supabase/supabaseClient");

exports.send = async (req, res) => {
  try {
    const { content, pdf_id, isModelResponse } = req.body;

    const { data, error } = await supabase.from("message").insert([
      {
        content: content,
        pdf_id: pdf_id,
        isModelResponse: isModelResponse,
      },
    ]);

    if (error) {
      throw error;
    }

    res.status(201).json({ success: true, message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to save data" });
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    const { pdf_id } = req.body;

    const { data, error } = await supabase
      .from("message")
      .select("content")
      .eq("pdf_id", pdf_id);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

exports.createChat = async (req, res) => {
  try {
    const { messages, chat_id } = req.body;

    const { data, error } = await supabase.from("chat").insert({
      messages,
      chat_id,
    });

    if (error) {
      throw error;
    }

    res
      .status(201)
      .json({ success: true, message: "Chat created successfully", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to create chat" });
  }
};
