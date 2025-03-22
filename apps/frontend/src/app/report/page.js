"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ReportPage() {
  const searchParams = useSearchParams();
  const reported_user = Number(searchParams.get("uid")) || null;

  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reported_user) {
      setMessage("Thiếu reported_user trên URL (?uid=...)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          details,
          reported_by: 1, // ⚠️ Tạm hardcode, bạn có thể lấy từ session/token sau
          reported_user,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(" Gửi báo cáo thành công!");
      } else {
        setMessage(` Lỗi: ${data.error}`);
      }
    } catch (err) {
      setMessage(" Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4"> Báo cáo người dùng ID {reported_user}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="space-y-2">
          <legend className="font-semibold">Chọn lý do:</legend>
          {["spam", "abuse", "fake_profile", "inappropriate", "other"].map((r) => (
            <label key={r} className="block">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
              />{" "}
              {r === "other" ? "Khác" : r}
            </label>
          ))}
        </fieldset>

        {reason === "other" && (
          <textarea
            placeholder="Nhập lý do chi tiết..."
            className="w-full border rounded p-2"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        )}

        {reason !== "other" && (
          <input
            type="hidden"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        )}

        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang gửi..." : "Gửi báo cáo"}
        </button>
      </form>

      {message && <p className="mt-4 font-medium">{message}</p>}
    </main>
  );
}
