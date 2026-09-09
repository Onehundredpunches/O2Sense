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
    badges: ['Giao diện', 'Eye-Care', 'Founder Pro', 'Tiến độ học'],
    hotspots: [
      {
        id: 1,
        label: 'Thanh Điều Hướng 5 Module Chính',
        xPercent: 44,
        yPercent: 7,
        description: 'Chuyển đổi tức thì giữa 5 góc nhìn: Tổng quan, 1 Đêm thở nghẽn 3D, Đồ thị SpO2, Bách khoa y học, và 5 Ca bệnh.',
        actionHint: 'Click chuột hoặc nhấn phím số 1, 2, 3, 4, 5 trên bàn phím'
      },
      {
        id: 2,
        label: 'Chuyển Đổi Persona: Đại Chúng vs Founder Pro',
        xPercent: 76,
        yPercent: 7,
        description: 'Chế độ Đại chúng dùng ngôn ngữ đời thường, ẩn dụ trực quan. Chế độ Founder Pro mở rộng cơ chế sinh lý vi mô, tham chiếu AASM và tư duy hệ thống.',
        actionHint: 'Bấm nút "Mode: Đại chúng" trên góc phải hoặc nhấn phím M'
      },
      {
        id: 3,
        label: 'Giao Diện Sáng Dịu Mắt (Eye-Care) & Midnight Navy',
        xPercent: 88,
        yPercent: 7,
        description: 'Theme Sáng sử dụng tông nền be ngà dịu mắt (#f7f6f2) chống mỏi điều tiết khi đọc lâu. Theme Tối tối ưu quan sát đồ thị huỳnh quang ban đêm.',
        actionHint: 'Bấm icon Mặt trời / Mặt trăng hoặc nhấn phím T'
      },
      {
        id: 4,
        label: 'Từ Điển Ẩn Dụ Y Khoa (Glossary 1-Touch)',
        xPercent: 85,
        yPercent: 7,
        description: 'Mở nhanh bộ giải nghĩa các thuật ngữ khó (OSA, AHI, ODI, PEEP, FiO2, SpO2) kèm hình ảnh so sánh đời thường.',
        actionHint: 'Bấm icon ngôi sao lấp lánh hoặc nhấn phím G'
      },
      {
        id: 5,
        label: 'Thẻ Bắt Đầu Học & Theo Dõi Tiến Độ',
        xPercent: 50,
        yPercent: 55,
        description: 'Thẻ tương tác dẫn đường đưa bạn bắt đầu từ bài học cơ bản nhất đến các ca bệnh phức tạp, tự động lưu tiến độ vào máy.',
        actionHint: 'Bấm nút "Bắt đầu hành trình" để vào thẳng mô hình 3D'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Chọn chế độ học phù hợp với bạn',
        detail: 'Nếu bạn là người mới tìm hiểu hoặc muốn hiểu bệnh để chăm sóc người thân, chọn "Chế độ Đại chúng". Nếu bạn là nhân viên y tế hoặc muốn đào sâu thuật toán, bật "Chế độ Founder Pro".'
      },
      {
        stepNumber: 2,
        action: 'Điều chỉnh ánh sáng đọc tài liệu',
        detail: 'Bấm nút đổi theme ở góc trên cùng bên phải. App sẽ lưu sở thích của bạn và duy trì trong các lần truy cập tiếp theo.'
      },
      {
        stepNumber: 3,
        action: 'Lần lượt trải nghiệm 5 module theo luồng sư phạm',
        detail: 'Khởi hành từ Tổng quan ➔ Xem cơ chế 3D ➔ Tập đọc đồ thị sóng ➔ Mở rộng kiến thức chuyên sâu ➔ Thực hành giải 5 ca bệnh thử thách.'
      }
    ],
    logicExplanations: [
      {
        title: 'Cơ chế lưu trữ trạng thái cục bộ (Client-side Persistence)',
        content: 'Toàn bộ tùy chọn cá nhân hóa (Theme Sáng/Tối, Chế độ Founder, Danh sách ca bệnh đã giải quyết, Điểm số bài quiz) được tự động mã hóa và lưu trữ tức thời trong LocalStorage của trình duyệt. Không cần tạo tài khoản mật khẩu, dữ liệu vẫn được bảo toàn nguyên vẹn.',
        formulaOrCode: 'localStorage.setItem("o2sense_theme", "light");\nlocalStorage.setItem("o2sense_mode", "founder");'
      },
      {
        title: 'Triết lý Giảm tải nhận thức (Cognitive Load Reduction)',
        content: 'Giao diện áp dụng tỷ lệ tương phản chuẩn WCAG AAA với bảng màu Eye-Care warm palette (#f7f6f2 kết hợp slate-800) giúp võng mạc không bị chói lóa ánh sáng xanh như các website nền trắng tinh (#ffffff) thông thường.'
      }
    ],
    proTips: [
      'Nhấn phím số 1 đến 5 trên bàn phím máy tính để chuyển tab siêu tốc mà không cần với chuột.',
      'Khi gặp bất kỳ thuật ngữ y khoa lạ lẫm nào có dấu gạch chân, bạn chỉ cần click trực tiếp vào chữ đó để xem ngay giải thích ngắn.'
    ],
    commonMistakes: [
      'Nhiều người bỏ qua Chế độ Founder Pro vì nghĩ quá khó: Thực tế ở chế độ này, bạn sẽ thấy thêm các thông số kỹ thuật lâm sàng rất giá trị cho việc đối chiếu đơn thuốc và kết quả đo đa ký giấc ngủ.'
    ]
  },
  {
    id: 'module-story-3d',
    title: 'Hành Trình 1 Đêm Thở Nghẽn (3D / 2.5D)',
    subtitle: 'Quan sát trực quan giải phẫu đường thở và diễn tiến 4 giai đoạn ngưng thở lúc ngủ',
    category: 'Mô phỏng',
    targetTab: 'story',
    imageSrc: './help_guide/desktop_2_story_3d.png',
    badges: ['WebGL 3D', 'Sinh lý học', 'Cơ chế FRC', 'Tương tác 360°'],
    hotspots: [
      {
        id: 1,
        label: 'Mô Hình Giải Phẫu Đường Thở 3D WebGL',
        xPercent: 50,
        yPercent: 35,
        description: 'Mô phỏng không gian 3 chiều vòm họng, lưỡi gà và khí quản chuyển động co thắt theo từng nhịp thở.',
        actionHint: 'Kéo chuột trái để xoay 360 độ, cuộn con lăn để zoom gần/xa'
      },
      {
        id: 2,
        label: 'Chuyển Đổi Chế Độ 3D Mesh / 2.5D Minh Họa Phẳng',
        xPercent: 88,
        yPercent: 18,
        description: 'Nếu thiết bị yếu hoặc muốn nhìn rõ sơ đồ giải phẫu dạng lát cắt phẳng dễ hiểu, bạn có thể chuyển sang chế độ 2.5D.',
        actionHint: 'Bấm nút gạt "Chế độ 3D / 2.5D" ở góc trên hộp mô phỏng'
      },
      {
        id: 3,
        label: 'Thanh Dòng Thời Gian 4 Giai Đoạn Lâm Sàng',
        xPercent: 50,
        yPercent: 68,
        description: 'Kéo thả hoặc click từng nấc để theo dõi diễn tiến: 1. Bình thường ➔ 2. Đường thở xẹp tắc ➔ 3. Thiếu oxy mô ➔ 4. Não bộ thức tỉnh bật dậy thở.',
        actionHint: 'Click trực tiếp vào các nút số [1], [2], [3], [4] trên thanh timeline'
      },
      {
        id: 4,
        label: 'Bảng Đồng Hồ Sinh Hiệu Thời Gian Thực (Live Vitals)',
        xPercent: 18,
        yPercent: 40,
        description: 'Phản ánh trực tiếp các chỉ số sinh lý tương ứng với từng giai đoạn: Nồng độ SpO2 (%), Áp lực lồng ngực (cmH2O), và Nhịp tim (bpm).',
        actionHint: 'Quan sát sự biến thiên của các đồng hồ đo khi bạn chuyển giai đoạn'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Tương tác xoay góc nhìn 3D',
        detail: 'Dùng chuột rê mô hình để quan sát vị trí lưỡi và khẩu cái mềm tụt ra sau chèn ép đường kính lòng họng.'
      },
      {
        stepNumber: 2,
        action: 'Bấm nấc số [2] (Khí đạo xẹp hoàn toàn)',
        detail: 'Quan sát đường thở đóng kín, màu sắc lòng ống chuyển sang màu cam cảnh báo, áp lực âm lồng ngực tăng vọt vì bệnh nhân cố hít vào vô vọng.'
      },
      {
        stepNumber: 3,
        action: 'Bấm nấc số [3] (Tụt oxy máu)',
        detail: 'Để ý đồng hồ SpO2 tụt sâu từ 98% xuống dưới 80%, nhịp tim chậm lại do phản xạ phó giao cảm bảo tồn oxy não.'
      },
      {
        stepNumber: 4,
        action: 'Bấm nấc số [4] (Não thức giấc - Micro-arousal)',
        detail: 'Cơ thể kích hoạt phản xạ giật mình thức tỉnh, trương lực cơ họng co giật mở toang đường thở, nhịp tim đập vọt lên 110 bpm với tiếng ngáy giật nghẹn.'
      }
    ],
    logicExplanations: [
      {
        title: 'Cơ chế trễ tụt oxy (Oxygen Desaturation Lag Time)',
        content: 'Tại sao khi đường thở tắc nghẽn 100%, SpO2 không tụt ngay mà phải mất từ 15 đến 30 giây? Đó là nhờ Dung tích cặn chức năng (FRC - Functional Residual Capacity) trong phế nang hoạt động như một "bình dưỡng khí đệm". Khi bình đệm này cạn kiệt, SpO2 mới rơi tự do theo đường cong phân ly Oxy-Hemoglobin dốc đứng.',
        formulaOrCode: 'T_delay ≈ FRC / VO2 ≈ (2400 ml) / (250 ml/min) ≈ 15-30s'
      },
      {
        title: 'Nghịch lý nhịp tim: Chậm lại rồi đập nhanh vọt (Brady-Tachycardia Cycle)',
        content: 'Giai đoạn ngạt thở kích hoạt phản xạ lặn (Diving reflex) qua dây thần kinh X làm tim đập chậm để tiết kiệm oxy. Khi não giật mình thức giấc, luồng Adrenaline giao cảm giải phóng ồ ạt kích hoạt tim đập nhanh và co mạch, dẫn đến huyết áp tăng vọt ban đêm.'
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
        label: 'Bộ Chọn Dạng Sóng Lâm Sàng Mẫu',
        xPercent: 50,
        yPercent: 12,
        description: 'Lựa chọn giữa 4 kịch bản đo thực tế: Sóng răng cưa kinh điển (OSA), Sóng võng trũng kéo dài (COPD/Giảm thông khí), Tín hiệu nhiễu do tuột dây cảm biến, và Đường thở người khỏe mạnh.',
        actionHint: 'Click vào 1 trong 4 tab mẫu đồ thị ở trên cùng'
      },
      {
        id: 2,
        label: 'Màn Hình Dao Động Ký SpO2 Ban Đêm',
        xPercent: 50,
        yPercent: 38,
        description: 'Biểu đồ biểu diễn nồng độ SpO2 theo trục thời gian thực. Hiển thị rõ các chu kỳ tụt dốc tuần hoàn tương ứng với từng cơn ngưng thở.',
        actionHint: 'Rê chuột trên đồ thị để xem giá trị SpO2 chính xác tại từng giây'
      },
      {
        id: 3,
        label: 'Thanh Công Cụ Kính Lúp (Zoom Lens) & Thước Đo Chu Kỳ',
        xPercent: 78,
        yPercent: 22,
        description: 'Cho phép phóng to vào 1 cụm sóng cụ thể để đo thời gian tụt dốc (Desaturation Time) và thời gian phục hồi (Resaturation Time).',
        actionHint: 'Bấm nút "Phóng to chu kỳ" hoặc kéo thanh trượt thời gian'
      },
      {
        id: 4,
        label: 'Bảng Phân Tích Thông Số & Chẩn Đoán Phân Biệt',
        xPercent: 50,
        yPercent: 75,
        description: 'Tự động tính toán chỉ số ODI, mức độ giảm sâu nhất (SpO2 Nadir), và đưa ra khuyến nghị lâm sàng đối chiếu.',
        actionHint: 'Xem kết quả giải mã ở phần bảng chi tiết bên dưới đồ thị'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Chọn mẫu "Sóng Răng Cưa (OSA điển hình)"',
        detail: 'Quan sát các chu kỳ sụt giảm SpO2 lặp đi lặp lại rất đều đặn từ 95% rơi xuống 82% rồi bật vọt lại.'
      },
      {
        stepNumber: 2,
        action: 'Dùng Kính lúp đo thời gian 1 chu kỳ sóng',
        detail: 'Nhận diện chu kỳ kéo dài từ 40 đến 90 giây: 20-30s tụt dốc chậm (giai đoạn tắc thở) và 10-15s vọt lên nhanh (giai đoạn giật mình thở bù).'
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
      'Nếu bạn có đồng hồ thông minh (Apple Watch, Garmin) đo SpO2 qua đêm, bạn có thể xuất đồ thị ra và đối chiếu trực tiếp với mẫu răng cưa này.',
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
        label: 'Bộ Phân Loại Chủ Đề Tri Thức',
        xPercent: 50,
        yPercent: 14,
        description: 'Chia nhỏ kiến thức thành 4 phân nhánh: 1. Chỉ số cốt lõi (AHI, ODI, RDI), 2. Cơ chế bù trừ sinh lý, 3. Máy thở CPAP/BiPAP, 4. Biến chứng tim mạch & đột quỵ.',
        actionHint: 'Bấm chọn từng thẻ danh mục để tải nội dung tương ứng'
      },
      {
        id: 2,
        label: 'Thẻ Tri Thức Đa Tầng (Interactive Accordions)',
        xPercent: 50,
        yPercent: 45,
        description: 'Mỗi thẻ chứa tóm tắt ngắn cho đại chúng và phần "Cơ chế sâu cho Founder Pro" mở rộng khi click.',
        actionHint: 'Click vào tiêu đề thẻ để mở rộng hoặc thu gọn chi tiết'
      },
      {
        id: 3,
        label: 'Hộp Tra Cứu Trực Tiếp Thuật Ngữ Đi Kèm',
        xPercent: 82,
        yPercent: 88,
        description: 'Liên kết nóng tới Từ điển thuật ngữ ẩn dụ giúp bạn không cần thoát màn hình vẫn tra cứu được từ viết tắt.',
        actionHint: 'Bấm vào các từ in đậm màu xanh ngọc để mở popup tra cứu'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Mở phân mục "Cơ chế bù trừ & Vòng xoắn bệnh lý"',
        detail: 'Theo dõi cách cơ thể phản ứng: Thiếu oxy ➔ Tăng CO2 ➔ Co thắt mạch phổi ➔ Tăng gánh thất phải.'
      },
      {
        stepNumber: 2,
        action: 'Xem phân mục "Giải pháp & Thiết bị CPAP"',
        detail: 'Hiểu nguyên lý hoạt động của máy áp lực dương liên tục CPAP như một "chiếc nẹp khí ảo" nâng đỡ thành họng không bị xẹp.'
      }
    ],
    logicExplanations: [
      {
        title: 'Cơ chế Co mạch phổi do thiếu oxy (Hypoxic Pulmonary Vasoconstriction - HPV)',
        content: 'Ở các cơ quan khác, thiếu oxy làm mạch máu giãn ra để đón máu. Nhưng ở phổi thì ngược lại: phế nang nào thiếu oxy sẽ lập tức co mạch lại để chuyển máu sang vùng phổi thông khí tốt hơn (phản xạ Euler-Liljestrand). Khi ngưng thở toàn bộ, toàn bộ giường mạch phổi co thắt dữ dội, làm áp lực động mạch phổi vọt lên cao ➔ lâu dần gây phì đại và suy tim phải (Tâm phế mạn).',
        formulaOrCode: 'Hypoxia + Hypercapnia ➔ Pulmonary Vascular Resistance (PVR) ↑↑ ➔ Right Ventricular Afterload ↑↑'
      },
      {
        title: 'Tại sao ngưng thở lúc ngủ lại gây Đái tháo đường & Béo phì kháng trị?',
        content: 'Mỗi cơn ngạt đêm kích hoạt giải phóng Cortisol và Catecholamine (hormone stress). Cortisol kéo dài làm kháng Insulin ở gan và cơ, đồng thời phá hủy cấu trúc giấc ngủ sâu (SWS - Slow Wave Sleep), làm giảm hormone Leptin (tạo cảm giác no) và tăng Ghrelin (gây thèm ăn tinh bột và đường vào ban ngày).'
      }
    ],
    proTips: [
      'Ghi nhớ quy tắc 3-3-3: Ngưng thở khi ngủ làm tăng gấp 3 lần nguy cơ Đột quỵ não, Tăng huyết áp kháng trị và Tai nạn giao thông do ngủ gật.',
      'Sử dụng kiến thức trong mục này để giải thích cặn kẽ cho bệnh nhân hiểu tại sao họ bắt buộc phải đeo máy thở CPAP dù lúc đầu cảm thấy vướng víu.'
    ],
    commonMistakes: [
      'Nghĩ rằng ngưng thở khi ngủ chỉ là "chuyện ngáy to": Ngáy chỉ là triệu chứng cơ học âm thanh, sự thiếu oxy ngắt quãng và stress oxy hóa phá hủy tế bào nội mạc mạch máu mới là sát thủ thầm lặng.'
    ]
  },
  {
    id: 'module-cases',
    title: '5 Ca Bệnh Thử Thách & Bẫy Lâm Sàng',
    subtitle: 'Rèn luyện phản xạ chẩn đoán qua tình huống thực tế, nhận diện bẫy điều trị nguy hiểm',
    category: 'Lâm sàng',
    targetTab: 'cases',
    imageSrc: './help_guide/desktop_5_cases.png',
    badges: ['5 Ca thực tế', 'Tương tác phản xạ', 'Bẫy điều trị', 'Tự đánh giá'],
    hotspots: [
      {
        id: 1,
        label: 'Thanh Chọn 5 Ca Bệnh Đặc Trưng',
        xPercent: 50,
        yPercent: 12,
        description: 'Bao gồm 5 bệnh cảnh điển hình: 1. Bác tài xế ngủ gật, 2. Tăng huyết áp uống 3 loại thuốc không hạ, 3. Trầm cảm kháng trị ở phụ nữ mãn kinh, 4. Bẫy cho thở oxy ở bệnh nhân COPD kèm OSA, 5. Vận động viên trẻ có dị dạng hàm.',
        actionHint: 'Bấm chọn từng ca bệnh để đọc hồ sơ bệnh án'
      },
      {
        id: 2,
        label: 'Dữ Liệu Hồ Sơ Bệnh Nhân & Đồ Thị SpO2',
        xPercent: 30,
        yPercent: 35,
        description: 'Cung cấp đầy đủ: Tuổi, nghề nghiệp, chỉ số BMI, triệu chứng khai thác và hình ảnh trích xuất từ thiết bị đo qua đêm.',
        actionHint: 'Đọc kỹ thông tin trước khi ra quyết định xử trí'
      },
      {
        id: 3,
        label: 'Bộ Lựa Chọn Quyết Định Xử Trí Lâm Sàng',
        xPercent: 50,
        yPercent: 62,
        description: 'Đưa ra các phương án A, B, C, D: Đâu là bước chẩn đoán hoặc điều trị tối ưu nhất?',
        actionHint: 'Click chọn đáp án bạn cho là chính xác nhất'
      },
      {
        id: 4,
        label: 'Phản Hồi Ngay Lập Tức & Giải Thích Chi Tiết',
        xPercent: 50,
        yPercent: 78,
        description: 'Hiển thị ngay lập tức phương án của bạn là Đúng hay Sai, kèm phân tích sinh lý bệnh và trích dẫn bằng chứng y khoa.',
        actionHint: 'Đọc kỹ phần phân tích lý do tại sao các phương án khác bị loại trừ'
      },
      {
        id: 5,
        label: 'Nút Đánh Dấu Trạng Thái & Ô Ghi Chú Suy Luận',
        xPercent: 50,
        yPercent: 92,
        description: 'Đánh dấu "Đã hiểu thấu" hoặc "Cần ôn lại" để hệ thống tự động ghi nhận vào biểu đồ tiến độ học tập cá nhân.',
        actionHint: 'Bấm nút tích xanh hoặc nút cờ vàng'
      }
    ],
    actionSteps: [
      {
        stepNumber: 1,
        action: 'Chọn ca bệnh và nhập vai bác sĩ điều trị',
        detail: 'Đọc kỹ bệnh cảnh lâm sàng, liên kết triệu chứng ban ngày (mệt mỏi, đau đầu buổi sáng) với diễn biến ban đêm.'
      },
      {
        stepNumber: 2,
        action: 'Đưa ra lựa chọn xử trí',
        detail: 'Chọn 1 trong các hướng xử trí. Hệ thống sẽ không phạt điểm mà tập trung giải thích cơ chế tư duy.'
      },
      {
        stepNumber: 3,
        action: 'Tự đánh giá vào bộ nhớ hệ thống',
        detail: 'Nếu bạn nắm vững lý do, bấm "Đã hiểu thấu". Nếu thấy bỡ ngỡ, bấm "Cần ôn lại" để sau này dùng tính năng Ôn tập 5 phút kiểm tra lại.'
      }
    ],
    logicExplanations: [
      {
        title: 'Bẫy tử vong: Cho thở oxy liều cao ở bệnh nhân Hội chứng chồng lấp (Overlap Syndrome: COPD + OSA)',
        content: 'Ở người bình thường, kích thích thở chính là nồng độ CO2 trong máu tăng. Nhưng ở bệnh nhân COPD nặng, não đã quen với CO2 cao liên tục, nên phản xạ thở chuyển sang phụ thuộc hoàn toàn vào Tình trạng thiếu oxy (Hypoxic Drive). Nếu bác sĩ thấy SpO2 thấp vội vàng cho thở oxy dòng cao, nồng độ oxy máu tăng vọt sẽ triệt tiêu trung tâm hô hấp ➔ Bệnh nhân ngưng thở hoàn toàn và hôn mê do ngộ độc CO2!',
        formulaOrCode: 'High FiO2 (without CPAP) ➔ Hypoxic Drive Abolished ➔ Hypoventilation ↑ ➔ Severe Hypercapnia ➔ CO2 Narcosis & Death'
      }
    ],
    proTips: [
      'Gặp ca tăng huyết áp kháng trị (dùng từ 3 loại thuốc trở lên không kiểm soát được), luôn nghĩ ngay đến Ngưng thở khi ngủ: Điều trị CPAP có thể giúp giảm từ 5 - 10 mmHg huyết áp mà không cần tăng thêm thuốc.',
      'Hãy viết suy luận của bạn vào ô "Ghi chú cá nhân" trước khi xem đáp án để rèn luyện tư duy chẩn đoán phản xạ.'
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
        label: 'Bảng Danh Sách Thuật Ngữ & Ẩn Dụ Đời Thường',
        xPercent: 30,
        yPercent: 40,
        description: 'Tập hợp các thuật ngữ khó hiểu nhất trong y học hô hấp được chuyển hóa thành các hình ảnh đời thường: Khí đạo xẹp = Ống hút giấy bị bẹp khi hút mạnh; FRC = Bình dưỡng khí dự trữ lặn biển; Chu kỳ răng cưa = Nhịp phanh xe khẩn cấp.',
        actionHint: 'Click vào từng thuật ngữ để đọc giải thích chi tiết'
      },
      {
        id: 2,
        label: 'Thanh Tìm Kiếm Thuật Ngữ Thời Gian Thực',
        xPercent: 50,
        yPercent: 18,
        description: 'Gõ bất kỳ từ khóa nào (ví dụ: "PEEP", "SpO2", "ngủ ngáy", "mặt nạ") để tìm kiếm tức thì.',
        actionHint: 'Gõ từ khóa vào ô tìm kiếm'
      },
      {
        id: 3,
        label: 'Bộ Phím Tắt Điều Khiển Bàn Phím Toàn Cục',
        xPercent: 75,
        yPercent: 45,
        description: 'Thao tác điều hướng cực nhanh trên máy tính mà không cần dùng chuột.',
        actionHint: 'Thử nhấn các phím tắt ngay trên bàn phím của bạn'
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
        formulaOrCode: '• Phím [1]: Chuyển tab Tổng Quan\n• Phím [2]: Chuyển tab 1 Đêm Thở Nghẽn 3D\n• Phím [3]: Chuyển tab Giải Mã Đồ Thị SpO2\n• Phím [4]: Chuyển tab Bách Khoa Y Học\n• Phím [5]: Chuyển tab 5 Ca Bệnh Lâm Sàng\n• Phím [H] hoặc [?]: Mở Help Center (Cẩm nang hướng dẫn)\n• Phím [Q]: Mở Ôn tập nhanh 5 phút\n• Phím [G]: Mở Từ điển Ẩn dụ Y khoa\n• Phím [T]: Chuyển đổi Theme Sáng / Tối\n• Phím [M]: Chuyển đổi Chế độ Đại chúng / Founder Pro\n• Phím [ESC]: Đóng tất cả các bảng sổ / Modal'
      }
    ],
    proTips: [
      'Nếu bạn đang thuyết trình hoặc giảng dạy về O2Sense trên màn chiếu, hãy dùng các phím số 1-5 để trình diễn mạch lạc như một chuyên gia.',
      'Trên bàn phím di động, hãy bookmark đường dẫn cẩm nang này để tra cứu nhanh khi gặp ca lâm sàng cần phân biệt.'
    ],
    commonMistakes: [
      'Giải thích cho bệnh nhân bằng các từ ngữ quá trừu tượng như "Rối loạn huyết động vi mạch do thiếu oxy ngắt quãng" khiến họ hoang mang và không tuân thủ điều trị. Hãy nói: "Mỗi đêm tim và não của bác bị giật mình bóp nghẹt 30 lần mỗi tiếng vì thiếu oxy như bị bóp mũi khi ngủ".'
    ]
  }
];
