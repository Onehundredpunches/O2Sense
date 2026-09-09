# O2Learn - Cổng Học Cơ Chế OSA & Luyện Phỏng Vấn Tránh Bẫy Suy Diễn

Web app cá nhân dành riêng cho Founder startup nghiên cứu wearable SpO2 (O2Ring). Ứng dụng phục vụ song song 2 mục tiêu ngang hàng:
1. **HỌC & HIỂU THẬT**: Hiểu đúng bản chất sinh lý bệnh OSA / hô hấp / SpO2 để tự giải thích được bằng lời của mình cho người thân lớn tuổi.
2. **ÁP DỤNG ĐÚNG KHI PHỎNG VẤN**: Tự động nhận diện bẫy suy diễn khi phỏng vấn người dùng thật, kể cả khi chỉ có 5 phút chuẩn bị trên điện thoại di động.

> ⚠️ **CẢNH BÁO BẮT BUỘC**: *Công cụ học tập cá nhân — KHÔNG dùng để chẩn đoán, KHÔNG thay thế tư vấn y tế.*

---

## 🚀 Tính Năng Chính

### 1. Ôn Nhanh 5 Phút Trước Phỏng Vấn (Quick Review Mode)
- Nút 1-chạm nổi bật trên màn hình chính và thanh điều hướng.
- Ngẫu nhiên 4-5 thẻ bẫy suy diễn từ Module A + 1 kịch bản phỏng vấn thực tế từ Module B.
- Tối ưu cho founder khi đang trên đường gặp khách hàng hoặc cầm điện thoại trước buổi phỏng vấn.

### 2. Module A: Bẫy Suy Diễn (Mobile-First Flashcards)
- 8 cặp thẻ bài trùng: **"Quan sát được"** vs **"KHÔNG được kết luận"**.
- Hiệu ứng lật thẻ mượt mà, phân tích bản chất sinh lý bệnh và thống kê.
- Cung cấp câu hỏi phỏng vấn an toàn thay thế (không mớm cung, không gán nhãn).
- Nút **"Nguồn y khoa"** ở mỗi thẻ dẫn trực tiếp tới bài báo khoa học (AASM, NHLBI, JAMA, USPSTF).
- Đánh dấu trạng thái *"Đã hiểu"* hoặc *"Cần ôn lại"*, lọc theo danh mục chủ đề.

### 3. Module B: Roleplay Phỏng Vấn Người Dùng Ảo (Text-based Simulator)
- 6 kịch bản hội thoại với người dùng ảo nói lời tự nhiên:
  1. *Tuấn (32t, IT)*: Than mệt sáng, smartwatch báo SpO2 88%, tưởng do chạy sprint thức khuya.
  2. *Anh Hùng (48t, Sales)*: Vợ phàn nàn ngáy, bản thân thấy ngủ "say như chết", không buồn ngủ ban ngày.
  3. *Chị Mai (46t, Kế toán)*: Mất ngủ giữa đêm, đau đầu sáng, đang uống thuốc an thần.
  4. *Hoàng (29t, PT Gym)*: 6 múi cơ bắp, huyết áp 145/95 kháng trị, bạn gái bảo ngủ thở dốc.
  5. *Bác Bình (66t, Hưu trí)*: Đi tiểu đêm 3-4 lần, khô đắng họng, tưởng bệnh tiền liệt tuyến.
  6. *Lan (27t, Văn phòng)*: Hoảng loạn vì SpO2 rớt 78%, hướng dẫn nhận diện nhiễu cơ học cảm biến.
- 3-4 lựa chọn câu hỏi tiếp theo được phân loại: *An toàn* vs *Gán nhãn bệnh* vs *Dẫn dắt mớm cung* vs *Kết luận sớm* vs *Tư vấn y tế trái phép* vs *Mù quáng tin cảm biến*.
- **Bước tổng hợp bắt buộc**: Founder phải tự gõ 2-3 câu đúc kết trước khi hoàn tất tình huống. Dữ liệu lưu vào `localStorage`.

### 4. Module C: Minh Họa Cơ Chế Sinh Lý Động 2D/2.5D (Animated SVG)
- 5 bước hoạt cảnh trực quan:
  1. *Hít thở bình thường & Thông khí phế nang* ($P_{crit} < -4\text{ cmH}_2\text{O}$).
  2. *Trao đổi khí qua màng phế nang & Hemoglobin vận chuyển oxy* ($Hb(O_2)_4$).
  3. *Sập cơ học đường thở trên trong OSA* (Áp lực âm hút bẹp thành hầu mềm như ống hút giấy).
  4. *Chuỗi thiếu $O_2$, tích $CO_2$ & Phản xạ vi tỉnh thức (Micro-arousal)*: Xác nhận chuẩn xác chiều phản xạ thần kinh — thiếu oxy/ứ $CO_2$ kích thích chemoreceptors $\rightarrow$ kích hoạt vi tỉnh thức vỏ não 3-15s để phục hồi trương lực cơ cằm-lưỡi (Genioglossus) mở đường thở, chứ *không phải* làm ngủ sâu hơn.
  5. *Mở lại đường thở, thông khí bù & Vòng lặp bệnh lý* (Thở dốc bù oxy, nhịp tim vọt 95 bpm do bão giao cảm, lặp lại 20-60 lần/đêm).
- Nút chuyển đổi 2 chế độ:
  - 🗣️ **"Dành cho người nhà"**: Ví von đời thường (ống hút bẹp, xe tải chở khách oxy...).
  - 🔬 **"Cơ chế chuyên sâu"**: Thuật ngữ sinh lý học chuẩn xác ($P_{crit}$, loop gain, chemoreceptors...).

---

## 🛠️ Kiến Trúc Dữ Liệu Generic (Mở Rộng Bệnh Lý Khác)

Toàn bộ nội dung bệnh lý được tách biệt hoàn toàn khỏi component UI, lưu tại `src/data/osa.json` theo interface `DiseaseData` (`src/types/disease.ts`).

Khi muốn bổ sung bệnh lý mới (ví dụ COPD, Suy tim, Hen suyễn):
1. Tạo file dữ liệu mới: `src/data/copd.json` tuân theo interface `DiseaseData`.
2. Truyền file data vào component mà không cần sửa đổi bất kỳ dòng code UI nào.

---

## 💻 Cài Đặt & Chạy Cục Bộ

```bash
# Cài đặt dependencies
npm install

# Chạy server phát triển
npm run dev

# Build bản production tĩnh
npm run build
```

---

## 🌐 Triển Khai Lên Vercel (Static Deployment)

Dự án là Single Page Application (SPA) hoàn toàn tĩnh (React + Vite + Tailwind CSS), không cần backend database.

1. Đẩy code lên GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "feat: O2Learn web app for founder"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Đăng nhập [Vercel](https://vercel.com), chọn **Add New Project** $\rightarrow$ Import repository vừa tạo.
3. Framework Preset: **Vite**.
4. Bấm **Deploy**. Vercel sẽ tự động build qua lệnh `npm run build` và deploy thư mục `dist/`.
