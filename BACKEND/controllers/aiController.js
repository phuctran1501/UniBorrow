const Groq = require("groq-sdk");
const Sach = require("../models/Sach");

const chatWithAI = async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Vui lòng nhập tin nhắn" });
    }

    try {
        console.log("--- Bắt đầu yêu cầu Groq AI ---");
        console.log("Tin nhắn từ người dùng:", message);

        // Kiểm tra Groq API Key
        const apiKey = process.env.GROQ_API_KEY?.trim();
        if (!apiKey || apiKey === "your_groq_key_here") {
            return res.status(500).json({ 
                message: "Hệ thống AI chưa được cấu hình GROQ_API_KEY. Vui lòng liên hệ Admin." 
            });
        }

        // Lấy danh sách sách từ database để làm ngữ cảnh
        const allBooks = await Sach.find({}, "TenSach TacGia TheLoai MoTa");
        const bookContext = allBooks.map((b, i) => 
            `${i + 1}. ${b.TenSach} - Tác giả: ${b.TacGia} - Thể loại: ${b.TheLoai}`
        ).join("\n");

        // Khởi tạo Groq SDK
        const groq = new Groq({ apiKey });

        // Chuyển đổi lịch sử chat sang định dạng OpenAI/Groq
        const messages = [
            {
                role: "system",
                content: `Bạn là thủ thư ảo thông minh của thư viện UniBorrow. 
                Nhiệm vụ của bạn là giúp độc giả tìm sách, gợi ý sách dựa trên sở thích và trả lời các câu hỏi về thư viện.
                
                Dưới đây là danh sách các cuốn sách hiện có trong thư viện UniBorrow:
                ${bookContext}
                
                Quy tắc trả lời:
                - Luôn thân thiện, lịch sự và súc tích.
                - Ưu tiên gợi ý các cuốn sách có trong danh sách trên.
                - Nếu độc giả hỏi về sách không có trong danh sách, hãy phản hồi khéo léo rằng hiện tại thư viện chưa có nhưng bạn có thể gợi ý các cuốn tương tự có sẵn.
                - Trả lời bằng tiếng Việt.`
            },
            ...(history || []).map(m => ({
                role: m.role === "user" ? "user" : "assistant",
                content: m.parts ? m.parts[0].text : m.content
            })),
            { role: "user", content: message }
        ];

        // Gửi yêu cầu tới Groq Cloud
        console.log("Đang gửi yêu cầu tới Groq (Model: Llama 3.3 70B)...");
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "";
        console.log("AI trả lời thành công!");

        res.json({ reply });

    } catch (error) {
        console.error("--- LỖI GROQ ASSISTANT ---");
        console.error("Chi tiết lỗi:", error.message);
        res.status(500).json({ 
            message: "Đã xảy ra lỗi khi kết nối với Groq AI Assistant.",
            error: error.message 
        });
    }
};

module.exports = {
    chatWithAI
};
