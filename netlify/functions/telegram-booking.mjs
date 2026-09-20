export default async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const { name, phone, date, time, service, message } = await req.json();
    if (!name || !phone || !date || !time) {
      return Response.json({ ok: false, error: "Заповніть обов’язкові поля." }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
      return Response.json({ ok: false, error: "Telegram ще не налаштований." }, { status: 503 });
    }

    const text = [
      "🚗 Нова заявка на СТО АТМ",
      "",
      `👤 Ім’я: ${name}`,
      `📞 Телефон: ${phone}`,
      `📅 Дата: ${date}`,
      `🕒 Час: ${time}`,
      `🔧 Послуга: ${service || "Не вказано"}`,
      `💬 Коментар: ${message || "—"}`
    ].join("\n");

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    if (!response.ok) throw new Error(`Telegram API: ${response.status}`);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false, error: "Не вдалося надіслати заявку." }, { status: 500 });
  }
};

export const config = { path: "/api/telegram-booking" };
