const supabase = require("../../../supabase/supabaseClient");
const axios = require("axios");
exports.send = async (req, res) => {
  try {
    const { content, isModelResponse } = req.body;

    const { data, error } = await supabase.from("message").insert([
      {
        content: content,

        isModelResponse: isModelResponse,
      },
    ]);

    if (error) {
      throw error;
    }
    const res1 = await getBotMessage(content);
    console.log("VEDYAA", res1);

    const { data1, error1 } = await supabase.from("message").insert([
      {
        content: res1.completion,

        isModelResponse: true,
      },
    ]);
    res
      .status(201)
      .json({ success: true, message: "Data saved successfully", ans: res1 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to save data" });
  }
};

const getBotMessage = async (content) => {
  try {
    console.log("CONTENTT", content);
    const resp = await axios.post("http://localhost:8000/completion", {
      message: content,
      flag: "1",
    });

    console.log("");

    if (resp.error) {
      console.log(resp.error);
    }
    console.log(resp);
    return resp.data;
  } catch (error) {
    console.log(error);
  }
};

exports.getAllMessages = async (req, res) => {
  try {
    //const pdf_id = req.query.pdf_id;
    //console.log("IDDD RECEV", pdf_id);
    const { data, error } = await supabase
      .from("message")
      .select("content, isModelResponse");
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
