export interface HotspotPin {
  id: number;
  label: string;
  xPercent: number;
  yPercent: number;
  description: string;
  actionHint: string;
}

export interface LogicPoint {
  title: string;
  content: string;
  formulaOrCode?: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  subtitle: string;
  category: 'Cơ bản' | 'Mô phỏng' | 'Phân tích' | 'Lâm sàng' | 'Nâng cao';
  targetTab: 'home' | 'story' | 'waveforms' | 'knowledge' | 'cases';
  imageSrc: string;
  badges: string[];
  hotspots: HotspotPin[];
  actionSteps: {
    stepNumber: number;
    action: string;
    detail: string;
  }[];
  logicExplanations: LogicPoint[];
  proTips: string[];
  commonMistakes: string[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'quick-start',
    title: 'Khởi Động Nhanh & Cá Nhân Hóa Trải Nghiệm',
    subtitle: 'Nắm bắt các chế độ hiển thị, chuyển đổi góc nhìn và tùy biến giao diện O2Sense',
    category: 'Cơ bản',
    targetTab: 'home',
    imageSrc: './help_guide/desktop_1_home.png',
    badges: ['Giao diện', 'Dịu mắt', 'Bản Chuyên Sâu', 'Tiến độ học'],
    hotspots: [
      {
        id: 1,
        label: 'Thanh Điều Hướng 6 Module Chính',
        xPercent: 47,
        yPercent: 8,
        description: 'Chuyển đổi tức thì giữa 6 góc nhìn: Tổng quan, 1 Đêm thở nghẽn 3D, Đồ thị SpO2, Bách khoa y học, 6 Tình huống thực tế, và Cẩm nang vận hành.',
        actionHint: 'Click chuột hoặc nhấn phím số 1, 2, 3, 4, 5, 6 trên bàn phím'
      },
      {
        id: 2,
        label: 'Chuyển Đổi Góc Nhìn: Phổ Thông vs Chuyên Sâu',
        xPercent: 78,
        yPercent: 8,
        description: 'Chế độ Phổ thông dùng ngôn ngữ đời thường, ẩn dụ trực quan. Chế độ Chuyên sâu mở rộng cơ chế sinh lý vi mô, tham chiếu AASM và tư duy hệ thống.',
        actionHint: 'Bấm nút "Chế độ: Phổ thông" trên thanh công cụ hoặc nhấn phím M'
      },
      {
        id: 3,
        label: 'Giao Diện Sáng Dịu Mắt & Ban Đêm',
        xPercent: 86,
        yPercent: 8,
        description: 'Giao diện Sáng sử dụng tông nền be ngà dịu mắt (#f7f6f2) chống mỏi điều tiết khi đọc lâu. Giao diện Tối tối ưu quan sát đồ thị huỳnh quang ban đêm.',
        actionHint: 'Bấm icon Mặt trời / Mặt trăng hoặc nhấn phím T'
      },
      {
        id: 4,
        label: 'Ôn Nhanh 5 Phút Phản Xạ An Toàn',
        xPercent: 91,
        yPercent: 8,
        description: 'Mở nhanh bộ câu hỏi ôn tập phản xạ 5 phút giúp rèn luyện khả năng nhận diện bẫy suy diễn và củng cố kiến thức.',
        actionHint: 'Bấm nút màu cam "Ôn nhanh 5p" hoặc nhấn phím Q'
      },
      {
        id: 5,
        label: 'Nút Mở Hành Trình 1 Đêm Thở Nghẽn 3D',
        xPercent: 24,
        yPercent: 48,
        description: 'Nút hành động chính dẫn đường đưa bạn bắt đầu từ bài học cơ bản nhất đến mô hình giải phẫu động 3D.',
        actionHint: 'Bấm nút "Khám phá 1 Đêm Thở Nghẽn (3D)" để vào thẳng mô hình'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Chọn chế độ học phù hợp với bạn',
        detail: 'Nếu bạn là người mới tìm hiểu hoặc muốn hiểu bệnh để chăm sóc người thân, chọn "Chế độ Phổ thông". Nếu bạn là nhân viên y tế hoặc muốn đào sâu thuật toán, bật "Chế độ Chuyên sâu".'
      },
      {
        stepNumber: 2,
        action: 'Điều chỉnh ánh sáng đọc tài liệu',
        detail: 'Bấm nút đổi giao diện ở góc trên cùng bên phải. App sẽ lưu sở thích của bạn và duy trì trong các lần truy cập tiếp theo.'
      },
      {
        stepNumber: 3,
        action: 'Lần lượt trải nghiệm 5 module theo luồng sư phạm',
        detail: 'Khởi hành từ Tổng quan ➔ Xem cơ chế 3D ➔ Tập đọc đồ thị sóng ➔ Mở rộng kiến thức chuyên sâu ➔ Thực hành với 6 tình huống thực tế.'
      }
    ],
    logicExplanations: [
      {
        title: 'Cơ chế lưu trữ trạng thái cục bộ (Client-side Persistence)',
        content: 'Toàn bộ tùy chọn cá nhân hóa (Giao diện Sáng/Tối, Chế độ Chuyên sâu, Danh sách tình huống thực tế đã hoàn thành, Điểm số bài quiz) được tự động mã hóa và lưu trữ tức thời trong LocalStorage của trình duyệt. Không cần tạo tài khoản mật khẩu, dữ liệu vẫn được bảo toàn nguyên vẹn.',
        formulaOrCode: 'localStorage.setItem("o2sense_theme", "light");\nlocalStorage.setItem("o2sense_mode", "founder");'
      },
      {
        title: 'Triết lý Giảm tải nhận thức (Cognitive Load Reduction)',
        content: 'Giao diện áp dụng tỷ lệ tương phản chuẩn WCAG AAA với bảng màu dịu mắt (Eye-Care warm palette, #f7f6f2 kết hợp slate-800) giúp võng mạc không bị chói lóa ánh sáng xanh như các website nền trắng tinh (#ffffff) thông thường.'
      }
    ],
    proTips: [
      'Nhấn phím số 1 đến 5 trên bàn phím máy tính để chuyển tab siêu tốc mà không cần với chuột.',
      'Khi gặp bất kỳ thuật ngữ y khoa lạ lẫm nào có dấu gạch chân, bạn chỉ cần click trực tiếp vào chữ đó để xem ngay giải thích ngắn.'
    ],
    commonMistakes: [
      'Nhiều người bỏ qua Chế độ Chuyên sâu vì nghĩ quá khó: Thực tế ở chế độ này, bạn sẽ thấy thêm các thông số kỹ thuật lâm sàng rất giá trị cho việc đối chiếu đơn thuốc và kết quả đo đa ký giấc ngủ.'
    ]
  },
  {
    id: 'module-story-3d',
    title: 'Hành Trình 1 Đêm Thở Nghẽn (3D / 2.5D)',
    subtitle: 'Quan sát trực quan giải phẫu đường thở và diễn tiến mô hình 5 bước sinh lý hô hấp khi ngủ',
    category: 'Mô phỏng',
    targetTab: 'story',
    imageSrc: './help_guide/desktop_2_story_3d.png',
    badges: ['WebGL 3D', 'Sinh lý học', 'Dự trữ oxy (FRC)', 'Tương tác 360°'],
    hotspots: [
      {
        id: 1,
        label: 'Mô Hình Giải Phẫu Đường Thở 2.5D / 3D',
        xPercent: 32,
        yPercent: 88,
        description: 'Mô phỏng không gian giải phẫu vòm họng, lưỡi gà và khí quản chuyển động co thắt theo từng nhịp thở.',
        actionHint: 'Quan sát các cấu trúc cơ học và điểm xẹp hẹp đường thở'
      },
      {
        id: 2,
        label: 'Chuyển Đổi Góc Nhìn 3D / 2.5D',
        xPercent: 42,
        yPercent: 74,
        description: 'Chuyển đổi linh hoạt giữa Mặt Cắt Y Khoa 2.5D rõ nét và Không Gian 3D WebGL xoay 360 độ.',
        actionHint: 'Bấm nút "Mặt Cắt Y Khoa 2.5D" hoặc "3D WebGL"'
      },
      {
        id: 3,
        label: 'Thanh Dòng Thời Gian 5 Bước Sinh Lý',
        xPercent: 35,
        yPercent: 41,
        description: 'Theo dõi diễn tiến: 1. Hít thở bình thường ➔ 2. Hẹp đường thở & ngáy ➔ 3. Xẹp & tắc nghẽn ➔ 4. Thiếu oxy & ứ CO₂ ➔ 5. Tái mở đường thở.',
        actionHint: 'Click trực tiếp vào các nút [1] đến [5] trên thanh bước'
      },
      {
        id: 4,
        label: 'Bảng Thông Số Sinh Hiệu Mô Phỏng',
        xPercent: 32,
        yPercent: 58,
        description: 'Phản ánh các chỉ số mô phỏng theo từng bước: Luồng khí (%), SpO₂ (%), Nhịp tim và Điện não (giá trị giả lập minh họa cơ chế, thay đổi tùy theo từng cá thể và từng đêm).',
        actionHint: 'Quan sát sự biến thiên của các đồng hồ đo khi bạn chuyển bước'
      },
      {
        id: 5,
        label: 'Ẩn Dụ Đời Thường & Lời Giải Thích Bình Dân',
        xPercent: 74,
        yPercent: 57,
        description: 'Khung ẩn dụ trực quan (Đường hầm thông suốt, Ống hút bị bẹp, v.v.) và cách giải thích dễ hiểu dành cho người nhà không chuyên môn.',
        actionHint: 'Đọc phần ẩn dụ để nắm bản chất sinh lý bệnh'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Bước 1: Hít thở bình thường & thông khí phế nang',
        detail: 'Đường thở mở thông thoáng, không khí lưu thông êm ả vào phổi và trương lực cơ giãn đường thở trên duy trì ổn định.'
      },
      {
        stepNumber: 2,
        action: 'Bước 2: Hẹp đường thở & ngáy',
        detail: 'Mô mềm hầu họng chùng xuống làm hẹp đường thở; luồng khí đi qua gây rung các cấu trúc mô mềm tạo tiếng ngáy.'
      },
      {
        stepNumber: 3,
        action: 'Bước 3: Xẹp và tắc nghẽn cơ học đường thở trên',
        detail: 'Đường thở bị tắc nghẽn, nỗ lực hô hấp vẫn tiếp diễn tạo áp lực âm trong lồng ngực nhưng luồng khí bị cản trở.'
      },
      {
        stepNumber: 4,
        action: 'Bước 4: Tụt oxy máu & ứ CO₂',
        detail: 'Thông khí ngừng trệ làm biến động khí máu, kích thích thụ thể hóa học làm tăng dần tín hiệu điều khiển hô hấp. (Các chỉ số SpO₂ và nhịp tim hiển thị là giá trị mô phỏng minh họa, không phải ngưỡng cố định).'
      },
      {
        stepNumber: 5,
        action: 'Bước 5: Tái mở đường thở & thông khí bù',
        detail: 'Luồng khí có thể phục hồi nhờ gia tăng tín hiệu điều khiển hô hấp và huy động các cơ giãn đường thở trên; vi thức giấc vỏ não có thể đi kèm và làm tăng đáp ứng nhưng không bắt buộc trong mọi biến cố.'
      }
    ],
    logicExplanations: [
      {
        title: 'Cơ chế trễ đáp ứng SpO₂ ngoại vi (Thời gian trễ tuần hoàn)',
        content: 'SpO₂ ở ngón tay phản ứng trễ so với thay đổi hô hấp do thời gian tuần hoàn từ phổi đến ngoại vi và quá trình lọc tín hiệu. Sau khi luồng khí phục hồi, SpO₂ ngoại vi vẫn có thể tiếp tục giảm trước khi chạm đáy rồi mới tăng trở lại. Khoảng trễ thay đổi theo từng cá thể và thiết bị.',
        formulaOrCode: 'Lung-to-finger circulation time (LFCT) ~ Transit time + Sensor signal processing'
      },
      {
        title: 'Đáp ứng tim mạch và thần kinh tự chủ quanh biến cố ngưng thở',
        content: 'Khi đường thở bị tắc nghẽn, nỗ lực hô hấp và biến động khí máu có thể gây dao động nhịp tim. Khi đường thở mở lại và luồng khí phục hồi, tăng hoạt tính giao cảm có thể làm nhịp tim và huyết áp tăng thoáng qua. Luồng khí có thể phục hồi nhờ gia tăng tín hiệu điều khiển hô hấp và huy động các cơ giãn đường thở trên; vi thức giấc vỏ não có thể đi kèm và làm tăng đáp ứng nhưng không bắt buộc trong mọi biến cố. Mức biến thiên sinh hiệu trên mô phỏng chỉ mang tính minh họa, thực tế thay đổi đáng kể giữa các cá thể và từng đêm.'
      }
    ],
    proTips: [
      'Trên điện thoại, bạn dùng 1 ngón tay để xoay mô hình và 2 ngón tay chụm lại để phóng to/thu nhỏ cực kỳ mượt mà.',
      'Hãy chú ý đến màu sắc của biểu tượng lá phổi: Chuyển từ xanh ngọc ➔ vàng cam ➔ đỏ tía khi oxy suy kiệt.'
    ],
    commonMistakes: [
      'Nghĩ rằng ngưng thở khi ngủ là bệnh nhân không hít thở: Thực tế lồng ngực và bụng bệnh nhân vẫn phập phồng gắng sức rất mạnh, nhưng đường thở bị tắc cơ học nên không có dòng khí lưu thông.'
    ]
  },
  {
    id: 'module-waveforms',
    title: 'Kính Lúp Sóng Thở & Giải Mã Đồ Thị SpO2',
    subtitle: 'Đọc hiểu đồ thị đa ký hô hấp, phân tích dạng sóng răng cưa và bóc tách chỉ số ODI',
    category: 'Phân tích',
    targetTab: 'waveforms',
    imageSrc: './help_guide/desktop_3_waveforms_sawtooth.png',
    badges: ['Đồ thị răng cưa', 'Tiêu chuẩn AASM', 'Chỉ số ODI', 'Chẩn đoán phân biệt'],
    hotspots: [
      {
        id: 1,
        label: 'Bộ Chọn 4 Dạng Sóng SpO2 Lâm Sàng Mẫu',
        xPercent: 19,
        yPercent: 60,
        description: 'Lựa chọn giữa 4 hình thái: 1. Giảm–phục hồi lặp lại, 2. Trũng sâu kéo dài, 3. Đường oxy tương đối ổn định, 4. Dao động chu kỳ.',
        actionHint: 'Click vào 1 trong 4 thẻ dạng sóng để tải mô hình đối chiếu'
      },
      {
        id: 2,
        label: 'Quy Tắc Nội Bộ O2Sense CMC-09 & Dạng sóng ≠ Chẩn đoán bệnh',
        xPercent: 82,
        yPercent: 78,
        description: 'Nguyên tắc an toàn cốt lõi: Dạng sóng SpO₂ giúp quan sát hình thái dao động nhưng không đủ để tự chẩn đoán hoặc loại trừ bệnh lý hô hấp.',
        actionHint: 'Ghi nhớ nguyên tắc Dạng sóng ≠ Chẩn đoán bệnh khi đối chiếu dữ liệu'
      },
      {
        id: 3,
        label: 'Màn Hình Dao Động Ký & Diễn Giải Chi Tiết',
        xPercent: 23,
        yPercent: 94,
        description: 'Biểu đồ biểu diễn dao động SpO2 theo chu kỳ thời gian thực, có mốc chuẩn 90% và phân tích cơ chế hình thành dạng sóng.',
        actionHint: 'Quan sát các chu kỳ sụt giảm và hồi phục trên đồ thị'
      },
      {
        id: 4,
        label: 'Thông Điệp An Tâm & Kế Hoạch Hành Động',
        xPercent: 75,
        yPercent: 94,
        description: 'Thông điệp an tâm giúp tránh hoảng hốt, kèm kế hoạch hành động thực tế 3 bước (việc làm ngay tối nay, theo dõi nhiều đêm, khi nào cần gặp bác sĩ).',
        actionHint: 'Đọc kế hoạch hành động thực tế để định hướng an toàn'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Chọn mẫu "Sóng Răng Cưa (OSA điển hình)"',
        detail: 'Quan sát minh họa chu kỳ sụt giảm SpO2 (ví dụ mô phỏng từ 95% rơi xuống 82% rồi hồi phục). Ví dụ mô phỏng — thời gian, độ sâu và hình dạng tín hiệu thực tế thay đổi giữa từng người và từng đêm; không dùng mẫu này để tự chẩn đoán.'
      },
      {
        stepNumber: 2,
        action: 'Dùng Kính lúp đo thời gian 1 chu kỳ sóng',
        detail: 'Nhận diện ví dụ chu kỳ kéo dài từ 40 đến 90 giây: pha tụt dốc chậm và pha hồi phục nhanh. Ví dụ mô phỏng — thời gian, độ sâu và hình dạng tín hiệu thực tế thay đổi giữa từng người và từng đêm; không dùng mẫu này để tự chẩn đoán.'
      },
      {
        stepNumber: 3,
        action: 'So sánh với mẫu "Tín Hiệu Nhiễu / Tuột Cảm Biến"',
        detail: 'Thấy ngay sự khác biệt: Tín hiệu nhiễu rơi thẳng đứng 90 độ xuống 0% hoặc mất sóng hoàn toàn, không có dạng chu kỳ sinh lý.'
      }
    ],
    logicExplanations: [
      {
        title: 'Công thức tính Chỉ số mất bão hòa Oxy (ODI - Oxygen Desaturation Index)',
        content: 'Theo chuẩn của Viện Hàn lâm Y học Giấc ngủ Hoa Kỳ (AASM), chỉ số ODI là tiêu chí định lượng quan trọng nhất trên bản ghi SpO2 ban đêm để chẩn đoán mức độ nặng của hội chứng ngưng thở khi ngủ.',
        formulaOrCode: 'ODI = (Tổng số lần sụt giảm SpO2 ≥ 3% hoặc ≥ 4%) / (Tổng số giờ ngủ ghi nhận)\n\n• Bình thường: ODI < 5 lần/giờ\n• Nhẹ: 5 ≤ ODI < 15 lần/giờ\n• Trung bình: 15 ≤ ODI < 30 lần/giờ\n• Nặng: ODI ≥ 30 lần/giờ'
      },
      {
        title: 'Cơ chế tạo hình Răng cưa (Sawtooth Morphology)',
        content: 'Hình răng cưa bất đối xứng (Asymmetric Sawtooth) là do tốc độ tụt dốc chậm (Desaturation dốc thoải vì lượng oxy trong máu giảm dần theo tỷ lệ chuyển hóa cơ bản) nhưng tốc độ hồi phục rất dốc (Resaturation dốc đứng vì khi thở gấp sau ngạt, thông khí tăng gấp 3-4 lần bình thường làm máu được bão hòa oxy cấp tốc).'
      }
    ],
    proTips: [
      'Nếu bạn có thiết bị đeo đo SpO2 qua đêm, dạng sóng răng cưa chỉ mang tính gợi ý quan sát dao động. Ví dụ mô phỏng — thời gian, độ sâu và hình dạng tín hiệu thực tế thay đổi giữa từng người và từng đêm; không dùng mẫu này để tự chẩn đoán.',
      'Sóng võng sâu kéo dài nhiều giờ (không có phục hồi răng cưa) thường là dấu hiệu của bệnh phổi mạn tính (COPD) hoặc béo phì giảm thông khí (OHS), không phải ngưng thở tắc nghẽn đơn thuần.'
    ],
    commonMistakes: [
      'Nhầm lẫn giữa tụt oxy do lạnh tay (co mạch ngoại vi) với ngưng thở thật: Khi lạnh tay, đường sóng mạch (Plethysmogram) sẽ bị dẹt, còn nhịp tim không biến thiên theo chu kỳ ngạt.'
    ]
  },
  {
    id: 'module-knowledge',
    title: 'Bách Khoa Y Học & Mạng Lưới Cơ Chế Sâu',
    subtitle: 'Khám phá mối tương tác nhân quả đa hệ cơ quan: Hô hấp - Tim mạch - Thần kinh - Chuyển hóa',
    category: 'Nâng cao',
    targetTab: 'knowledge',
    imageSrc: './help_guide/desktop_4_knowledge.png',
    badges: ['Bách khoa toàn thư', 'Sơ đồ nhân quả', 'Thiết bị CPAP', 'Biến chứng'],
    hotspots: [
      {
        id: 1,
        label: 'Bộ Phân Loại 5 Chủ Đề Tri Thức',
        xPercent: 20,
        yPercent: 42,
        description: 'Chia nhỏ kiến thức thành 5 phân nhánh: 1. Định nghĩa & AHI, 2. Bản đồ triệu chứng Ngày & Đêm, 3. Phân biệt các bệnh lý hô hấp, 4. Nguyên lý cảm biến PPG, 5. Biến chứng tim mạch.',
        actionHint: 'Bấm chọn từng nút subtab để tải nội dung tương ứng'
      },
      {
        id: 2,
        label: 'Thẻ Tri Thức Đa Tầng & Ẩn Dụ Chiếc Ống Nước Mềm',
        xPercent: 50,
        yPercent: 81,
        description: 'Mỗi chủ đề giải thích bản chất y học đơn giản hóa kết hợp ẩn dụ đời thường dễ nhớ, có phần mở rộng cơ chế chuyên sâu.',
        actionHint: 'Cuộn đọc để nắm vững bản chất bệnh học'
      },
      {
        id: 3,
        label: 'Hộp Tra Cứu Trực Tiếp Từ Điển Ẩn Dụ',
        xPercent: 78,
        yPercent: 27,
        description: 'Nút mở nhanh Từ điển ẩn dụ (15 thuật ngữ then chốt) giúp tra cứu tức thì ngay trong trang.',
        actionHint: 'Bấm nút "Từ Điển Ẩn Dụ (15 Thuật Ngữ)" để mở modal tra cứu'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Mở phân mục "Cơ chế bù trừ & Vòng xoắn bệnh lý"',
        detail: 'Theo dõi cách cơ thể phản ứng: Thiếu oxy và/hoặc tăng CO₂, đặc biệt khi kéo dài hoặc lặp lại trong bối cảnh phù hợp, có thể góp phần gây co mạch phổi và tăng gánh cho thất phải.'
      },
      {
        stepNumber: 2,
        action: 'Xem phân mục "Giải pháp & Thiết bị CPAP"',
        detail: 'Hiểu nguyên lý hoạt động của máy áp lực dương liên tục CPAP như một "chiếc nẹp khí ảo" nâng đỡ thành họng không bị xẹp.'
      }
    ],
    logicExplanations: [
      {
        title: 'Cơ chế Co mạch phổi do thiếu oxy (HPV - Phản xạ co mạch bảo vệ)',
        content: 'HPV (Hypoxic Pulmonary Vasoconstriction - Co mạch phổi do thiếu oxy): Ở các cơ quan khác, thiếu oxy làm mạch máu giãn ra để đón máu. Nhưng ở phổi thì ngược lại: phế nang nào thiếu oxy sẽ co mạch lại để chuyển dòng máu sang vùng phổi thông khí tốt hơn (phản xạ Euler-Liljestrand). Thiếu oxy và/hoặc tăng CO₂, đặc biệt khi kéo dài hoặc lặp lại trong bối cảnh phù hợp, có thể góp phần gây co mạch phổi và tăng gánh cho tâm thất phải. Hiện tượng này không tự động xảy ra tức thì ở mọi biến cố ngưng thở đơn lẻ mà phụ thuộc vào thời lượng, độ sâu và bệnh nền tim phổi kèm theo.',
        formulaOrCode: 'Kéo dài/lặp lại: Thiếu oxy + Tăng CO₂ ➔ Có thể góp phần tăng sức cản mạch phổi (PVR - Pulmonary Vascular Resistance) & gánh tâm thất phải'
      },
      {
        title: 'Tại sao ngưng thở lúc ngủ lại gây Đái tháo đường & Béo phì kháng trị?',
        content: 'Mỗi cơn ngạt đêm kích hoạt giải phóng Cortisol và Catecholamine (hormone stress). Cortisol kéo dài làm kháng Insulin ở gan và cơ, đồng thời phá hủy cấu trúc giấc ngủ sâu sóng chậm (SWS - Slow Wave Sleep, giai đoạn ngủ sâu phục hồi thể chất), làm giảm hormone Leptin (tạo cảm giác no) và tăng Ghrelin (gây thèm ăn tinh bột và đường vào ban ngày).'
      }
    ],
    proTips: [
      'OSA có liên quan với tăng nguy cơ tim mạch và tai nạn do buồn ngủ, nhưng mức nguy cơ khác nhau giữa từng kết cục, từng nhóm người bệnh và từng nghiên cứu.',
      'Nếu CPAP đã được bác sĩ/chuyên gia y tế chỉ định, kiến thức trong mục này có thể giúp giải thích vì sao việc sử dụng đều đặn theo hướng dẫn là quan trọng. Không dùng O2Sense để tự quyết định mình hoặc người khác cần CPAP.'
    ],
    commonMistakes: [
      'Nghĩ rằng ngưng thở khi ngủ chỉ là "chuyện ngáy to": Ngáy chỉ là triệu chứng cơ học âm thanh, sự thiếu oxy ngắt quãng và stress oxy hóa phá hủy tế bào nội mạc mạch máu mới là sát thủ thầm lặng.'
    ]
  },
  {
    id: 'module-cases',
    title: '6 Tình Huống Thực Tế & Giao Tiếp An Toàn',
    subtitle: '6 tình huống thực tế giúp luyện cách đặt câu hỏi trung lập, nhận diện bẫy suy diễn và giao tiếp an toàn mà không tự chẩn đoán hoặc đưa ra chỉ định điều trị.',
    category: 'Lâm sàng',
    targetTab: 'cases',
    imageSrc: './help_guide/desktop_5_cases.png',
    badges: ['6 Tình huống thực tế', 'Giao tiếp an toàn', 'Bẫy suy diễn', 'Tự đánh giá'],
    hotspots: [
      {
        id: 1,
        label: 'Thanh Chọn 6 Tình Huống Thực Tế',
        xPercent: 44,
        yPercent: 50,
        description: 'Bao gồm 6 tình huống thường gặp: 1. Tuấn (IT thức khuya sprint), 2. Anh Hùng (ngáy to rung nhà), 3. Chị Mai (mất ngủ & đau đầu), 4. Hoàng (gymer huyết áp cao), 5. Bác Bình (tiểu đêm nhiều lần), 6. Lan (hoảng loạn vì app báo SpO₂ rớt 78%).',
        actionHint: 'Bấm chọn từng tình huống để đọc chia sẻ của người dùng'
      },
      {
        id: 2,
        label: 'Hồ Sơ Người Dùng & Lời Chia Sẻ Thực Tế',
        xPercent: 29,
        yPercent: 90,
        description: 'Cung cấp thông tin: Tuổi, nghề nghiệp, thiết bị sử dụng, câu nói thực tế của người dùng và bối cảnh sinh hoạt.',
        actionHint: 'Đọc kỹ lời chia sẻ trước khi chọn cách phản hồi'
      },
      {
        id: 3,
        label: 'Bộ Chuyển Đổi: 8 Hiểu Lầm vs 6 Tình Huống',
        xPercent: 61,
        yPercent: 19,
        description: 'Chuyển đổi linh hoạt giữa 8 thẻ bài lật phá giải hiểu lầm (MythBusters) và 6 kịch bản hội thoại thực tế.',
        actionHint: 'Click chọn subtab ở trên cùng'
      },
      {
        id: 4,
        label: 'Lựa Chọn Phản Hồi & Đặt Câu Hỏi An Toàn',
        xPercent: 70,
        yPercent: 87,
        description: 'Đưa ra các phương án phản hồi: đâu là cách đặt câu hỏi mở, trung lập và giao tiếp an toàn thay vì tự chẩn đoán hay vội vã đưa ra lời khuyên?',
        actionHint: 'Click chọn phương án phản hồi bạn cho là an toàn nhất'
      },
      {
        id: 5,
        label: 'Phân Tích Bẫy Giao Tiếp & Cơ Chế Y Khoa',
        xPercent: 70,
        yPercent: 74,
        description: 'Hiển thị nhận xét về câu trả lời (An toàn, Bẫy gán nhãn, Bẫy dẫn dắt hay Can thiệp trái thẩm quyền) kèm cơ chế sinh lý và tư duy giao tiếp an toàn.',
        actionHint: 'Đọc kỹ phần phân tích lý do tại sao các cách hỏi khác tiềm ẩn rủi ro'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Chọn tình huống thực tế và lắng nghe chia sẻ',
        detail: 'Đọc kỹ bối cảnh và câu nói thực tế của người dùng, liên kết triệu chứng ban ngày với dữ liệu quan sát được mà không vội vàng phán xét.'
      },
      {
        stepNumber: 2,
        action: 'Lựa chọn phương án phản hồi an toàn',
        detail: 'Chọn cách đặt câu hỏi trung lập và giao tiếp an toàn, nhận diện các bẫy suy diễn hoặc can thiệp vượt thẩm quyền mà không tự chẩn đoán hay đưa ra chỉ định điều trị.'
      },
      {
        stepNumber: 3,
        action: 'Đúc kết bài học và tự đánh giá',
        detail: 'Đọc kỹ phân tích cơ chế giao tiếp an toàn, bấm "Đã hiểu thấu" hoặc "Cần ôn lại" để theo dõi tiến độ cá nhân.'
      }
    ],
    logicExplanations: [
      {
        title: 'Bẫy tử vong: Cho thở oxy liều cao ở bệnh nhân Hội chứng chồng lấp (Overlap Syndrome: COPD + OSA)',
        content: 'Ở người bình thường, kích thích thở chính là nồng độ CO₂ trong máu tăng. Nhưng ở bệnh nhân COPD nặng, não đã quen với CO₂ cao liên tục, nên phản xạ thở chuyển sang phụ thuộc hoàn toàn vào Tình trạng kích thích thở do thiếu oxy (Hypoxic Drive - phản xạ hô hấp dự phòng kích hoạt khi oxy máu giảm sâu). Nếu thấy SpO₂ thấp mà vội vàng cho thở oxy liều cao không kiểm soát, nồng độ oxy máu tăng vọt sẽ triệt tiêu phản xạ kích thích thở này ➔ Bệnh nhân ngưng thở hoàn toàn và hôn mê do ngộ độc khí carbonic (CO₂ Narcosis - toan hô hấp cấp gây ức chế não bộ)!',
        formulaOrCode: 'FiO₂ cao không kiểm soát (không dùng CPAP) ➔ Triệt tiêu phản xạ kích thích thở do thiếu oxy (Hypoxic Drive Abolished) ➔ Giảm thông khí phế nang ➔ Ứ đọng CO₂ nặng ➔ Hôn mê do ngộ độc CO₂ (CO₂ Narcosis) & Tử vong'
      }
    ],
    proTips: [
      'Ở một số người mắc OSA, điều trị phù hợp — bao gồm CPAP khi có chỉ định — có thể góp phần cải thiện kiểm soát huyết áp. Mức đáp ứng thay đổi theo từng người, mức độ bệnh, tuân thủ điều trị và bệnh lý đi kèm.',
      'Hãy viết suy luận của bạn vào ô "Ghi chú cá nhân" trước khi xem đáp án để rèn luyện tư duy đặt câu hỏi an toàn.'
    ],
    commonMistakes: [
      'Kê đơn thuốc an thần / thuốc ngủ (như Benzodiazepine) cho bệnh nhân than phiền mất ngủ và mệt mỏi mà không đo đa ký: Thuốc an thần làm giãn cơ họng nặng hơn, biến ngưng thở mức nhẹ thành ngạt thở nguy kịch!'
    ]
  },
  {
    id: 'shortcuts-and-glossary',
    title: 'Phím Tắt Toàn Cục & Từ Điển Ẩn Dụ Y Khoa',
    subtitle: 'Tối ưu hóa thao tác chuyên nghiệp và phương pháp giải thích y khoa cho người không chuyên',
    category: 'Cơ bản',
    targetTab: 'home',
    imageSrc: './help_guide/desktop_modal_glossary.png',
    badges: ['Phím tắt', 'Năng suất', 'Ẩn dụ y khoa', 'Khám phá nhanh'],
    hotspots: [
      {
        id: 1,
        label: 'Bảng Danh Sách 15 Thuật Ngữ & Ẩn Dụ Đời Thường',
        xPercent: 34,
        yPercent: 55,
        description: 'Tập hợp 15 thuật ngữ y học hô hấp then chốt được chuyển hóa thành các hình ảnh đời thường: Khí đạo xẹp = Ống hút giấy bị bẹp khi hút mạnh; FRC (Dung tích cặn chức năng) = Bình dưỡng khí dự trữ oxy lặn biển; Chu kỳ răng cưa = Nhịp phanh xe khẩn cấp.',
        actionHint: 'Click vào từng thuật ngữ để đọc giải thích chi tiết'
      },
      {
        id: 2,
        label: 'Thanh Tìm Kiếm Thuật Ngữ Thời Gian Thực',
        xPercent: 50,
        yPercent: 22,
        description: 'Gõ bất kỳ từ khóa nào (ví dụ: "PEEP", "SpO2", "ngủ ngáy", "mặt nạ") để tìm kiếm tức thì.',
        actionHint: 'Gõ từ khóa vào ô tìm kiếm'
      },
      {
        id: 3,
        label: 'Thẻ Giải Thích & Ẩn Dụ Trực Quan Chi Tiết',
        xPercent: 62,
        yPercent: 55,
        description: 'Trình bày chi tiết cách hiểu bằng lời bình dân, lý do tại sao bạn cần biết điều này và bản chất cơ chế sinh lý học.',
        actionHint: 'Đọc kỹ giải thích để áp dụng vào thực tế'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Mở nhanh Từ điển thuật ngữ bằng phím G',
        detail: 'Nhấn phím G bất cứ lúc nào để tra cứu từ ngữ mà không làm mất trang bạn đang học.'
      },
      {
        stepNumber: 2,
        action: 'Học cách dùng ẩn dụ khi giải thích cho người nhà',
        detail: 'Áp dụng các so sánh quen thuộc để truyền đạt cho người không có chuyên môn y tế dễ dàng thấu hiểu và tuân thủ điều trị.'
      }
    ],
    logicExplanations: [
      {
        title: 'Bảng Tổng Hợp Phím Tắt Toàn Ứng Dụng (Global Keyboard Shortcuts)',
        content: 'Hệ thống hỗ trợ phím tắt toàn cục cho người dùng chuyên nghiệp (Power Users):',
        formulaOrCode: '• Phím [1]: Chuyển tab Tổng Quan\n• Phím [2]: Chuyển tab 1 Đêm Thở Nghẽn 3D\n• Phím [3]: Chuyển tab Giải Mã Đồ Thị SpO2\n• Phím [4]: Chuyển tab Bách Khoa Y Học\n• Phím [5]: Chuyển tab 6 Tình Huống Thực Tế\n• Phím [H] hoặc [?]: Mở Help Center (Cẩm nang hướng dẫn)\n• Phím [Q]: Mở Ôn tập nhanh 5 phút\n• Phím [G]: Mở Từ điển Ẩn dụ Y khoa\n• Phím [T]: Chuyển đổi Giao diện Sáng / Tối\n• Phím [M]: Chuyển đổi Chế độ Phổ thông / Chuyên sâu\n• Phím [ESC]: Đóng tất cả các bảng sổ / Modal'
      }
    ],
    proTips: [
      'Nếu bạn đang thuyết trình hoặc giảng dạy về O2Sense trên màn chiếu, hãy dùng các phím số 1-5 để trình diễn mạch lạc như một chuyên gia.',
      'Trên bàn phím di động, hãy bookmark đường dẫn cẩm nang này để tra cứu nhanh khi cần đối chiếu.'
    ],
    commonMistakes: [
      'Tránh dùng từ ngữ đe dọa hoặc áp đặt con số cố định gây hoang mang lo lắng. Hãy giải thích bình tĩnh và khách quan: "Các biến cố hô hấp khi ngủ có thể làm giấc ngủ bị gián đoạn và gây dao động oxy hoặc đáp ứng tim mạch ở một số người. Mức độ cần được đánh giá dựa trên dữ liệu và bối cảnh lâm sàng, không nên suy đoán từ một dấu hiệu đơn lẻ."'
    ]
  }
];
