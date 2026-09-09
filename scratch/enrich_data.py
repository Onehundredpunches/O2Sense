import json

with open("src/data/osa.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# 1. Update branding & subtitle
data["diseaseName"] = "Ngưng thở khi ngủ do tắc nghẽn (OSA)"
data["subtitle"] = "Thấu hiểu từng nhịp thở • Phân tích đồ thị SpO2 • Bách khoa y học đời thường"

# 2. Add metaphor to existing 5 mechanism steps
metaphors = [
    {
        "name": "Đường Hầm Thông Suốt",
        "icon": "Wind",
        "analogy": "Ống thông khí rộng mở, không khí tự do vào nạp oxy cho các túi phổi như xe chạy trên cao tốc thông thoáng."
    },
    {
        "name": "Cánh Cửa Rung Lắc",
        "icon": "Activity",
        "analogy": "Khẩu cái mềm thả lỏng như lá cờ gặp gió lớn, rung bần bật 30-50 lần mỗi giây tạo nên âm thanh ngáy."
    },
    {
        "name": "Ống Hút Bẹp Dí",
        "icon": "AlertTriangle",
        "analogy": "Khi hút sữa bằng ống hút quá mạnh hoặc ống bị mềm, thành ống họng sập dính chặt vào nhau, luồng khí tắt lịm 0%."
    },
    {
        "name": "Chuông Báo Cháy Não Bộ",
        "icon": "Sparkles",
        "analogy": "Cảm biến khói (thụ thể xoang cảnh) phát hiện oxy tụt, lập tức rung chuông báo động đánh thức vỏ não 3-5 giây."
    },
    {
        "name": "Bàn Đạp Ga Cứu Hộ",
        "icon": "Zap",
        "analogy": "Xung thần kinh số XII giật mạnh cơ lưỡi bung ra phía trước, kèm tiếng thở hít giật mình (gasp) cứu sống cơ thể."
    }
]

for i, step in enumerate(data.get("mechanismSteps", [])):
    if i < len(metaphors):
        step["metaphor"] = metaphors[i]

# 3. Add 4 SpO2 Waveform Patterns
data["waveformPatterns"] = [
    {
        "id": "pattern_sawtooth",
        "name": "Dạng Răng Cưa Dao Động (Sawtooth Waves)",
        "shapeTitle": "Tụt dốc nhọn rồi vọt nảy lên lặp lại liên tục",
        "frequency": "Lặp lại mỗi 30 - 90 giây trong cơn ngưng thở",
        "typicalDipDuration": "Mỗi đợt tụt kéo dài 15 - 45 giây, phục hồi nhanh",
        "primaryCause": "Ngưng thở khi ngủ do tắc nghẽn (OSA kinh điển)",
        "category": "airway_osa",
        "badgeColor": "rose",
        "isArtifact": False,
        "analogy": "Giống như chiếc phao bị sóng kéo dìm xuống nước rồi lại bật trồi lên mặt nước khi giật mình thở lại.",
        "mechanismWhy": "Khi ngủ say, cơ họng xẹp làm tắc khí -> SpO2 tụt dần -> Não giật mình kích hoạt cơ cằm-lưỡi kéo mở họng -> Người bệnh hít mạnh thở dốc làm SpO2 vọt trở lại 98%. Vòng lặp này tạo ra hình răng cưa.",
        "reassuringMessage": "Cơ thể bạn đang tự bảo vệ rất tốt bằng phản xạ vi thức giấc. Tình trạng này rất phổ biến và có thể cải thiện rõ rệt bằng các biện pháp không xâm lấn.",
        "exclusionChecklist": [
            "Bạn hoặc người thân có nghe thấy tiếng ngáy ngắt quãng, thỉnh thoảng ậm ừ thở dốc không?",
            "Hiện tượng này có xảy ra nhiều hơn rõ rệt khi bạn nằm ngửa so với khi nằm nghiêng không?",
            "Sáng dậy bạn có cảm giác khô khốc miệng hoặc hơi ê đầu không?"
        ],
        "actionSteps": {
            "immediate": "Thử ngủ nghiêng một bên (Positional Therapy) bằng cách ôm gối ôm hoặc kê gối chống lật; tránh uống bia rượu hoặc thuốc an thần trước giờ ngủ ít nhất 4 tiếng.",
            "monitoring": "Đeo nhẫn O2Ring liên tục 3-5 đêm ở cùng một ngón tay để kiểm tra xem dạng răng cưa này có xuất hiện đều đặn mỗi đêm hay chỉ đêm nào nằm ngửa/mệt mỏi.",
            "clinical": "Nếu đồ thị răng cưa xuất hiện trên 3 đêm liên tiếp kèm mệt mỏi ban ngày, hãy mang hình ảnh này đến khám bác sĩ chuyên khoa Tai Mũi Họng hoặc Hô hấp để được chỉ định đo đa ký giấc ngủ (PSG)."
        },
        "sampleSvgWave": "M0,20 Q15,20 25,22 L35,55 L40,22 Q50,22 60,23 L70,60 L75,20 Q85,20 95,22 L105,52 L110,21 L130,20"
    },
    {
        "id": "pattern_sustained_plateau",
        "name": "Dạng Trũng Sâu Kéo Dài (Sustained Low Plateau)",
        "shapeTitle": "Tụt xuống thấp và nằm bẹp dí 15-45 phút không nhịp bật",
        "frequency": "Kéo dài thành từng mảng rộng, thường vào nửa sau đêm (pha giấc ngủ REM)",
        "typicalDipDuration": "Kéo dài liên tục > 10-30 phút dưới 90%",
        "primaryCause": "Giảm thông khí phổi (COPD thể tụt oxy đêm, Béo phì OHS, hoặc Hen đêm)",
        "category": "pulmonary",
        "badgeColor": "amber",
        "isArtifact": False,
        "analogy": "Giống như căn phòng kín thiếu dưỡng khí kéo dài, không có chu kỳ đóng-mở cửa đột ngột như dạng răng cưa.",
        "mechanismWhy": "Không phải do họng bị sập cơ học đóng mở liên tục, mà do dung tích phổi hoặc trao đổi khí tại phế nang bị suy giảm trường diễn (bất xứng thông khí/tưới máu V/Q) khi các cơ hô hấp phụ nghỉ ngơi trong giấc ngủ.",
        "reassuringMessage": "Đừng hoảng hốt. Hiện tượng này thường liên quan đến đường hô hấp dưới (phổi/phế quản) hoặc cân nặng, cần thăm khám bài bản thay vì tự ý mua máy thở CPAP.",
        "exclusionChecklist": [
            "Bạn có tiền sử hút thuốc lá lâu năm hoặc từng được chẩn đoán viêm phế quản/hen suyễn không?",
            "Bạn có chỉ số khối cơ thể (BMI) cao (>28-30) hoặc có vòng cổ lớn không?",
            "Ban ngày khi đi bộ nhanh hay leo cầu thang bạn có cảm thấy hụt hơi không?"
        ],
        "actionSteps": {
            "immediate": "Kê cao đầu giường 15-20 độ (dùng gối nêm chống trào ngược) để giảm áp lực ổ bụng đè lên cơ hoành; giữ phòng ngủ thông thoáng, không ẩm mốc.",
            "monitoring": "Ghi chép lại các triệu chứng ban ngày (ho có đờm, khò khè, khó thở khi gắng sức) kèm dữ liệu SpO2 xuất từ nhẫn.",
            "clinical": "Cần đến bệnh viện đo chức năng hô hấp (Hô hấp ký - Spirometry) và kiểm tra khí máu động mạch, vì nguyên nhân nằm ở phổi hoặc thông khí chứ không đơn thuần ở vòm họng."
        },
        "sampleSvgWave": "M0,20 L30,22 Q40,25 45,55 L85,58 Q90,56 95,25 L130,22"
    },
    {
        "id": "pattern_isolated_spike",
        "name": "Dạng Đáy Nhọn Đơn Lẻ (Isolated Deep Spike)",
        "shapeTitle": "Đang 98% bất ngờ rơi thẳng đứng 1 điểm rồi lại phẳng lỳ",
        "frequency": "Chỉ xuất hiện 1 hoặc 2 lần cá biệt trong cả đêm ngủ 7-8 tiếng",
        "typicalDipDuration": "Thời gian cực ngắn (10-20 giây) hoặc ngắt quãng tín hiệu",
        "primaryCause": "Nhiễu cảm biến do NẰM ĐÈ TAY hoặc Cựa mình (Positional Compression Artifact)",
        "category": "sensor_artifact",
        "badgeColor": "emerald",
        "isArtifact": True,
        "analogy": "Giống như chiếc vòi nước tưới cây đang chảy bình thường, bỗng nhiên ai đó dẫm chân lên ống trong 5 giây rồi nhấc ra ngay.",
        "mechanismWhy": "Khi bạn trở mình nằm nghiêng, thân người hoặc gối đè ép lên cánh tay/ngón tay mang nhẫn. Mạch máu bị chèn ép tạm thời khiến lưu lượng máu (Perfusion Index) sụt giảm đột ngột. Cảm biến quang học thiếu tín hiệu sẽ tính toán sai lệch tạo ra một vết tụt giả tạo!",
        "reassuringMessage": "Tin vui là 90% trường hợp này HOÀN TOÀN KHÔNG PHẢI BỆNH! Cơ thể bạn hoàn toàn khỏe mạnh, đây chỉ là giới hạn vật lý của cảm biến khi bị đè nén.",
        "exclusionChecklist": [
            "Bạn chỉ bị 1-2 lần tụt đơn độc trong suốt 8 tiếng, các khoảng thời gian còn lại đường SpO2 rất thẳng đẹp không?",
            "Sáng thức dậy cánh tay đeo nhẫn có cảm giác hơi tê bì hoặc ấm lại sau khi cựa mình không?",
            "Bạn không hề ngáy to, không giật mình thức giấc thở dốc?"
        ],
        "actionSteps": {
            "immediate": "Hoàn toàn an tâm, không cần lo lắng! Hãy thử đổi nhẫn sang ngón tay cái hoặc ngón trỏ của bàn tay không thuận (ít bị nằm đè hơn) hoặc chọn size vòng silicon vừa vặn hơn.",
            "monitoring": "Quan sát biểu đồ đêm hôm sau. Nếu đổi tay hoặc đổi tư thế mà vết nhọn biến mất, bạn có thể khẳng định 100% đó là nhiễu tư thế.",
            "clinical": "Không cần đi khám chuyên khoa nếu chỉ có 1-2 vạch nhọn đơn lẻ và ban ngày bạn hoàn toàn khỏe khoắn, tỉnh táo."
        },
        "sampleSvgWave": "M0,20 L50,21 L55,62 L60,20 L130,21"
    },
    {
        "id": "pattern_periodic_cheyne_stokes",
        "name": "Dạng Hình Sin Chu Kỳ Đều Đặn (Periodic Cheyne-Stokes Waves)",
        "shapeTitle": "Lên xuống thoai thoải nhịp nhàng hình sin kéo dài",
        "frequency": "Chu kỳ lặp lại rất đều đặn 60 - 120 giây",
        "typicalDipDuration": "Tụt êm dịu, không giật cục như tắc nghẽn",
        "primaryCause": "Ngưng thở trung ương (CSA) hoặc Kiểu thở Cheyne-Stokes (Liên quan Tim mạch / Suy tim)",
        "category": "cardiac_central",
        "badgeColor": "purple",
        "isArtifact": False,
        "analogy": "Giống như con lắc đồng hồ đu đưa chậm rãi: não điều khiển thở phập phồng chậm lại rồi nhanh dần, lặp đi lặp lại nhịp nhàng.",
        "mechanismWhy": "Không có tắc nghẽn ở cổ họng. Do trung tâm điều khiển hô hấp ở hành não bị giảm độ nhạy hoặc tuần hoàn từ tim lên não bị trễ (trong suy tim), dẫn đến việc não phát lệnh thở bù quá mức rồi lại ngừng thở luân phiên.",
        "reassuringMessage": "Dạng sóng này đòi hỏi sự cẩn trọng khoa học. Nó giúp phát hiện sớm các vấn đề về tuần hoàn tim mạch để bác sĩ tối ưu hóa phác đồ điều trị kịp thời.",
        "exclusionChecklist": [
            "Bạn có tiền sử cao huyết áp lâu năm, suy tim, bệnh mạch vành hoặc rung nhĩ không?",
            "Người nhà quan sát thấy bạn thở êm dịu dần rồi dừng lại, sau đó thở mạnh dần lên mà không kèm tiếng ngáy sặc sụa?",
            "Khi nằm đầu bằng bạn có cảm thấy tức ngực hoặc khó thở hơn so với khi kê cao gối không?"
        ],
        "actionSteps": {
            "immediate": "Kê gối cao hoặc nâng đầu giường khi ngủ để giảm lượng máu dồn về tim; uống thuốc tim mạch đều đặn theo đúng đơn bác sĩ.",
            "monitoring": "Lưu lại toàn bộ file biểu đồ đêm có nhịp hình sin này để xuất file báo cáo.",
            "clinical": "Cần đặt lịch hẹn khám chuyên khoa Tim mạch và Hô hấp. Bác sĩ sẽ siêu âm tim, đo điện tim và làm đa ký giấc ngủ để phân biệt ngưng thở trung ương và tối ưu thuốc tim mạch."
        },
        "sampleSvgWave": "M0,35 Q15,18 30,35 Q45,55 60,35 Q75,18 90,35 Q105,55 120,35 L130,35"
    }
]

# 4. Add Medical Knowledge Hub
data["knowledgeHub"] = {
    "definitionSection": {
        "whatIsOSA": "Ngưng thở khi ngủ do tắc nghẽn (OSA) là tình trạng đường thở ở vùng hầu họng bị sụp đổ cơ học lặp đi lặp lại trong giấc ngủ, làm giảm hoặc ngưng hoàn toàn luồng không khí đi vào phổi, dù lồng ngực và cơ hoành vẫn nỗ lực co bóp thở.",
        "laymanAnalogy": "Tưởng tượng cổ họng của bạn giống như một chiếc ống nước mềm. Ban ngày bạn thức, cơ bắp căng giữ cho ống luôn nở rộng. Khi bạn ngủ say, cơ thả lỏng ra, cộng thêm sức hút của luồng khí hít vào khiến hai thành ống dính bẹp vào nhau như chiếc ống hút bị bẹp.",
        "ahiStandards": {
            "metric": "AHI (Apnea-Hypopnea Index) — Số cơn ngưng/giảm thở trong mỗi giờ ngủ thực tế",
            "ranges": [
                {
                    "label": "Bình thường",
                    "range": "AHI < 5 lần/giờ",
                    "meaning": "Đường thở thông suốt, thỉnh thoảng có vài đợt cựa mình sinh lý bình thường.",
                    "severityColor": "emerald"
                },
                {
                    "label": "Mức độ Nhẹ",
                    "range": "AHI từ 5 đến 14 lần/giờ",
                    "meaning": "Bắt đầu có tình trạng tắc nghẽn gián đoạn, thường chỉ cần cải thiện tư thế ngủ và giảm cân.",
                    "severityColor": "sky"
                },
                {
                    "label": "Mức độ Vừa",
                    "range": "AHI từ 15 đến 29 lần/giờ",
                    "meaning": "Não bộ bị vi thức giấc hàng chục lần mỗi giờ, ảnh hưởng rõ đến độ sâu giấc ngủ và tim mạch.",
                    "severityColor": "amber"
                },
                {
                    "label": "Mức độ Nặng",
                    "range": "AHI >= 30 lần/giờ",
                    "meaning": "Cứ 2 phút đường thở lại tắc 1 lần; oxy máu tụt triền miên, cần can thiệp y tế chính quy (máy thở CPAP).",
                    "severityColor": "rose"
                }
            ]
        },
        "underlyingCauses": [
            {
                "title": "Hẹp Cấu Trúc Giải Phẫu",
                "desc": "Xương hàm dưới lẹm/nhỏ, amidan hoặc lưỡi gà phì đại quá phát, mô mỡ tích tụ dày quanh vùng hầu họng.",
                "icon": "Layers"
            },
            {
                "title": "Mất Trương Lực Cơ Hầu Họng",
                "desc": "Cơ cằm-lưỡi (Genioglossus) bị chùng nhão quá mức trong giấc ngủ sâu hoặc bị ức chế bởi rượu bia, thuốc ngủ.",
                "icon": "Activity"
            },
            {
                "title": "Ngưỡng Vi Tỉnh Giấc Quá Thấp (Low Arousal Threshold)",
                "desc": "Não bộ quá nhạy cảm, vừa tắc nhẹ đã giật mình thức giấc làm đứt gãy cấu trúc giấc ngủ sâu.",
                "icon": "Sparkles"
            },
            {
                "title": "Mất Ổn Định Điều Hòa Hô Hấp (High Loop Gain)",
                "desc": "Trung tâm hô hấp phản ứng thái quá: thở gấp bù oxy rồi lại rơi vào pha ngừng thở luân phiên.",
                "icon": "RotateCw"
            }
        ]
    },
    "symptomSection": {
        "nighttime": [
            {
                "symptom": "Ngáy to ngắt quãng & Thở dốc giật mình (Choking/Gasping)",
                "why": "Âm thanh ngáy biến mất khi đường thở tắc hoàn toàn (im ắng 10-30s), sau đó bùng nổ bằng tiếng khịt mũi thở dốc khi não thức giấc.",
                "icon": "Wind"
            },
            {
                "symptom": "Tiểu đêm nhiều lần (Nocturia)",
                "why": "Khi họng tắc, lồng ngực gồng hút tạo áp lực âm cực lớn, kéo căng buồng tim. Tâm nhĩ bị căng sẽ tiết ra hormone ANP (Atrial Natriuretic Peptide) truyền lệnh cho thận thải nước tiểu liên tục.",
                "icon": "Droplet"
            },
            {
                "symptom": "Vã mồ hôi đêm & Giấc ngủ chập chờn",
                "why": "Hệ thần kinh giao cảm bị kích thích liên tục bởi tình trạng ngạt thở, giải phóng Adrenaline làm vã mồ hôi và tim đập nhanh.",
                "icon": "Zap"
            }
        ],
        "daytime": [
            {
                "symptom": "Đau đầu sau khi thức dậy (Morning Headache)",
                "why": "Suốt đêm bị giữ lại khí CO2 (Hypercapnia). Nồng độ CO2 trong máu cao làm giãn các mạch máu não, gây ra cảm giác đau đầu âm ỉ vùng trán khi vừa tỉnh dậy.",
                "icon": "Brain"
            },
            {
                "symptom": "Buồn ngủ ban ngày quá mức (Excessive Daytime Sleepiness - EDS)",
                "why": "Hàng trăm lần vi thức giấc (Micro-arousal 3-15 giây) cắt vụn giấc ngủ sóng chậm và giấc ngủ REM, dù ngủ đủ 8 tiếng nhưng não vẫn chưa từng được nghỉ ngơi.",
                "icon": "Moon"
            },
            {
                "symptom": "Mất tập trung, giảm trí nhớ & Dễ cáu gắt",
                "why": "Thiếu oxy ngắt quãng làm suy giảm tạm thời chức năng vỏ não trước trán (Prefrontal Cortex) — trung tâm điều hành cảm xúc và trí nhớ làm việc.",
                "icon": "AlertCircle"
            }
        ]
    },
    "differentialDiagnosis": [
        {
            "disease": "OSA (Ngưng thở tắc nghẽn)",
            "mechanism": "Đường thở hầu họng bị xẹp cơ học; cơ ngực và cơ hoành vẫn gắng sức co bóp liên tục.",
            "spO2DayVsNight": "Ban ngày SpO2 97-99% hoàn toàn bình thường; Ban đêm tụt dạng răng cưa dao động.",
            "keyDistinction": "Ngáy to ngắt quãng, thở dốc khi tỉnh, tiểu đêm nhiều lần, đáp ứng rất tốt với thở nghiêng hoặc máy CPAP."
        },
        {
            "disease": "CSA (Ngưng thở trung ương)",
            "mechanism": "Não bộ tạm thời 'quên' phát lệnh thở; không có nỗ lực co bóp của lồng ngực hay cơ hoành.",
            "spO2DayVsNight": "Ban ngày có thể bình thường; Ban đêm tụt dạng sóng hình sin mềm mại (Cheyne-Stokes).",
            "keyDistinction": "Thường gặp ở người suy tim, đột quỵ não; người bệnh không ngáy ầm ĩ mà thở phập phồng chu kỳ êm ái."
        },
        {
            "disease": "COPD (Phổi tắc nghẽn mạn tính)",
            "mechanism": "Phế quản và phế nang ở phổi bị tổn thương không hồi phục do thuốc lá/khói bụi.",
            "spO2DayVsNight": "Ban ngày SpO2 đã thường xuyên ở mức thấp (88-94%); Ban đêm tụt sâu dạng trũng kéo dài.",
            "keyDistinction": "Ho khạc đờm mạn tính, khó thở khi gắng sức cả ban ngày, lồng ngực hình thùng, đo hô hấp ký có FEV1/FVC giảm."
        },
        {
            "disease": "OHS (Béo phì giảm thông khí)",
            "mechanism": "Mô mỡ dày ở thành ngực và ổ bụng đè ép hạn chế giãn nở phổi suốt ngày đêm.",
            "spO2DayVsNight": "Khí máu ban ngày đã có PaCO2 > 45 mmHg; Ban đêm tụt SpO2 sâu trầm trọng.",
            "keyDistinction": "BMI thường > 30-35 kg/m², ngủ gật ban ngày liên tục, môi tím tái nhẹ, SpO2 giảm cả khi ngồi nghỉ."
        }
    ],
    "ppgSensorScience": {
        "howItWorks": "Cảm biến Photoplethysmography (PPG) chiếu hai bước sóng ánh sáng đặc biệt xuyên qua giường mao mạch ngón tay để đo độ hấp thụ ánh sáng của Hemoglobin trong máu.",
        "twoWavelengths": [
            {
                "wave": "Ánh sáng Đỏ (Red Light)",
                "nanometers": "Bước sóng ~ 660 nm",
                "role": "Được Hemoglobin đã mất oxy (Deoxyhemoglobin - Hb) hấp thụ rất mạnh."
            },
            {
                "wave": "Ánh sáng Hồng ngoại (Infrared Light)",
                "nanometers": "Bước sóng ~ 940 nm",
                "role": "Được Hemoglobin ngậm oxy (Oxyhemoglobin - HbO2) hấp thụ rất mạnh."
            }
        ],
        "circulationDelay": "Thời gian trễ tuần hoàn (Circulation Delay): Khi đường thở bị tắc ở cổ họng, phải mất 15 đến 30 giây để lượng máu thiếu oxy từ phổi được tim bơm tới mao mạch đầu ngón tay. Do đó, đồ thị SpO2 trên nhẫn sẽ tụt chậm hơn thời điểm ngưng thở thực tế 15-30 giây.",
        "whyRingBetterThanWrist": "Đầu ngón tay có hệ thống mao mạch cực kỳ đậm đặc và gần như không có cơ vân dày che chắn như ở cổ tay, giúp nhẫn đo SpO2 với độ chính xác cao hơn đồng hồ đeo tay và ít bị nhiễu do dịch chuyển hơn.",
        "commonArtifacts": [
            "Tư thế ngủ tì đè cánh tay hoặc ngón tay làm giảm lưu lượng máu tưới (Low Perfusion)",
            "Nhiệt độ phòng ngủ quá lạnh làm co thắt tiểu động mạch ngoại vi",
            "Sơn móng tay màu đậm hoặc móng tay giả làm cản trở tia sáng xuyên thấu",
            "Cử động mạnh, cựa quậy hoặc run tay sinh lý khi trở mình"
        ]
    },
    "cardiovascularComplications": [
        {
            "name": "Tăng Huyết Áp Ban Đêm Kháng Trị",
            "mechanism": "Bão Adrenaline từ hệ thần kinh giao cảm bùng phát sau mỗi cơn ngạt làm mạch máu co thắt liên tục suốt đêm.",
            "reversibleWithTreatment": "Huyết áp ban đêm có thể giảm rõ rệt sau 4-8 tuần kiểm soát thông khí tốt."
        },
        {
            "name": "Rung Nhĩ & Rối Loạn Nhịp Tim",
            "mechanism": "Áp lực âm lồng ngực kéo giãn buồng tâm nhĩ, kết hợp tình trạng thiếu oxy cơ tim kích hoạt các ổ phát nhịp bất thường.",
            "reversibleWithTreatment": "Giảm tỷ lệ tái phát rung nhĩ sau khi can thiệp mở đường thở."
        },
        {
            "name": "Đề Kháng Insulin & Đái Tháo Đường Type 2",
            "mechanism": "Tình trạng thiếu oxy ngắt quãng kích hoạt phản xạ stress mạn tính, tăng giải phóng Cortisol làm tế bào kháng insulin.",
            "reversibleWithTreatment": "Cải thiện chỉ số đường huyết HbA1c khi giấc ngủ sâu được phục hồi."
        }
    ]
}

# 5. Add 15 Glossary Items with Metaphors
data["glossary"] = [
    {
        "id": "term_genioglossus",
        "term": "Genioglossus",
        "vietnameseName": "Cơ Cằm - Lưỡi",
        "metaphor": "Chiếc phanh cơ học mở họng",
        "plainDefinition": "Khối cơ chính gắn từ cằm vào cuống lưỡi. Khi cơ này co thắt, nó kéo lưỡi nhô ra trước giúp họng rộng mở.",
        "clinicalDetail": "Được chi phối bởi dây thần kinh sọ số XII (Hypoglossal nerve). Trong giấc ngủ, trương lực cơ này suy giảm khiến lưỡi tụt lùi.",
        "whyItMatters": "Hiểu cơ này giúp bạn biết tại sao ngưng thở chỉ xảy ra khi ngủ say chứ ban ngày thức không bao giờ bị nghẽn."
    },
    {
        "id": "term_arousal",
        "term": "Micro-Arousal",
        "vietnameseName": "Vi Tỉnh Thức (Vi Thức Giấc)",
        "metaphor": "Chuông báo thức 3 giây của não",
        "plainDefinition": "Não bộ giật mình thức giấc trong 3 đến 15 giây để gồng cơ họng thở lại, sau đó ngủ tiếp mà sáng ra bạn không nhớ gì.",
        "clinicalDetail": "Ghi nhận trên điện não đồ (EEG) khi có sự chuyển dịch tần số sóng não từ delta/theta sang alpha/beta kéo dài 3-15s.",
        "whyItMatters": "Vi thức giấc cứu mạng bạn khỏi ngạt thở, nhưng hàng trăm lần vi thức giấc sẽ băm nát giấc ngủ khiến bạn mệt mỏi cả ngày."
    },
    {
        "id": "term_chemoreceptors",
        "term": "Chemoreceptors",
        "vietnameseName": "Thụ Thể Hóa Học (Xoang Cảnh)",
        "metaphor": "Đầu dò khói báo cháy trong máu",
        "plainDefinition": "Các cảm biến tí hon nằm ở động mạch cổ và cuống não, liên tục nếm máu để phát hiện khi nào oxy tụt hoặc khí CO2 tăng cao.",
        "clinicalDetail": "Gồm thụ thể ngoại vi (Carotid & Aortic bodies) nhạy cảm với PaO2 tụt, và thụ thể trung ương ở hành não nhạy với H+/PaCO2 tăng.",
        "whyItMatters": "Đây là mắt xích kích hoạt phản xạ vi tỉnh thức để kéo mở đường thở khi bạn bị tắc nghẽn."
    },
    {
        "id": "term_ahi",
        "term": "AHI",
        "vietnameseName": "Chỉ Số Ngưng Giảm Thở",
        "metaphor": "Thước đo mức độ kẹt xe đường thở",
        "plainDefinition": "Số lần đường thở của bạn bị tắc hoàn toàn (ngưng thở) hoặc tắc một nửa (giảm thở) trung bình trong 1 giờ ngủ.",
        "clinicalDetail": "Apnea-Hypopnea Index = (Tổng số cơn Apnea + Hypopnea) / Tổng số giờ ngủ ghi nhận được bằng đa ký giấc ngủ (PSG).",
        "whyItMatters": "Là con số tiêu chuẩn quốc tế mà bác sĩ dùng để xếp hạng bạn bị nhẹ (5-14), vừa (15-29) hay nặng (>=30)."
    },
    {
        "id": "term_spo2",
        "term": "SpO2",
        "vietnameseName": "Độ Bão Hòa Oxy Trong Máu Ngoại Vi",
        "metaphor": "Tỷ lệ xe chở đầy hàng trên cao tốc",
        "plainDefinition": "Tỷ lệ phần trăm các phân tử Hemoglobin trong hồng cầu đang ngậm đầy khí oxy. Người khỏe mạnh bình thường từ 95% đến 99%.",
        "clinicalDetail": "Đo bằng phương pháp quang học PPG không xâm lấn. Dưới 90% được xem là tụt oxy máu có ý nghĩa lâm sàng.",
        "whyItMatters": "Nhẫn O2Ring theo dõi chỉ số này suốt đêm để phát hiện các đợt thiếu oxy ngắt quãng."
    },
    {
        "id": "term_ppg",
        "term": "Photoplethysmography (PPG)",
        "vietnameseName": "Quang Phổ Thể Tích Mạch",
        "metaphor": "Chiếc đèn pin soi mạch máu",
        "plainDefinition": "Công nghệ dùng ánh sáng đỏ và hồng ngoại soi qua ngón tay để nhìn thấy mạch máu phập phồng theo từng nhịp đập của tim.",
        "clinicalDetail": "Tận dụng hệ số hấp thụ quang học khác nhau của oxyhemoglobin và deoxyhemoglobin ở 660nm và 940nm.",
        "whyItMatters": "Là nguyên lý cốt lõi của nhẫn thông minh O2Ring và các thiết bị đo oxy đeo tay."
    },
    {
        "id": "term_soft_palate",
        "term": "Soft Palate & Uvula",
        "vietnameseName": "Khẩu Cái Mềm & Lưỡi Gà",
        "metaphor": "Cánh buồm đón gió ở vòm họng",
        "plainDefinition": "Phần mô mềm ở nóc họng phía sau răng. Khi ngủ thả lỏng, nó dễ bị rung lắc tạo tiếng ngáy và bị hút sập vào thành họng.",
        "clinicalDetail": "Cấu tạo từ các sợi cơ vân và niêm mạc. Áp lực âm tạo ra bởi cơ hoành khi hít vào dễ kéo khẩu cái mềm áp sát thành hầu sau.",
        "whyItMatters": "Là một trong hai vị trí sập cơ học phổ biến nhất trong ngưng thở khi ngủ."
    },
    {
        "id": "term_anp",
        "term": "ANP (Atrial Natriuretic Peptide)",
        "vietnameseName": "Peptide Lợi Niệu Tâm Nhĩ",
        "metaphor": "Lệnh xả nước cứu tim",
        "plainDefinition": "Chất hóa học do tim tiết ra khi tim bị kéo căng quá mức, ra lệnh cho thận thải bớt nước tiểu ra ngoài.",
        "clinicalDetail": "Khi tắc họng, lồng ngực hít gồng tạo áp lực âm kéo giãn buồng nhĩ tim, kích thích giải phóng ANP gây tiểu đêm nhiều lần (Nocturia).",
        "whyItMatters": "Giúp giải thích tại sao người bị ngưng thở thường xuyên phải dậy đi tiểu đêm 2-4 lần dù không bị bệnh thận hay tiền liệt tuyến."
    },
    {
        "id": "term_hypercapnia",
        "term": "Hypercapnia",
        "vietnameseName": "Tăng Khí Carbonic Trong Máu",
        "metaphor": "Khói ngạt tích tụ trong phòng kín",
        "plainDefinition": "Khí thải CO2 không được thở ra ngoài nên bị ứ lại trong máu, làm máu bị chua (nhiễm toan hô hấp).",
        "clinicalDetail": "Áp lực riêng phần khí CO2 trong máu động mạch (PaCO2) tăng vượt ngưỡng bình thường (> 45 mmHg).",
        "whyItMatters": "CO2 tích tụ làm giãn mạch máu não, chính là thủ phạm gây ra cơn đau đầu ê ẩm vùng trán mỗi sáng ngủ dậy."
    },
    {
        "id": "term_circulation_delay",
        "term": "Circulation Delay",
        "vietnameseName": "Thời Gian Trễ Tuần Hoàn",
        "metaphor": "Độ trễ truyền tín hiệu từ nguồn",
        "plainDefinition": "Mất khoảng 15 đến 30 giây để lượng máu thiếu oxy từ phổi và tim chảy đến được đầu ngón tay nơi bạn đeo nhẫn.",
        "clinicalDetail": "Tốc độ dòng máu chảy từ phế nang qua tim trái rồi theo cây động mạch tới mao mạch ngón tay mất 15-30 giây tùy cung lượng tim.",
        "whyItMatters": "Khi nhẫn của bạn báo SpO2 tụt, thực tế cơn ngưng thở đã bắt đầu trước đó khoảng nửa phút."
    },
    {
        "id": "term_positional_therapy",
        "term": "Positional Therapy",
        "vietnameseName": "Liệu Pháp Tư Thế Ngủ (Ngủ Nghiêng)",
        "metaphor": "Chiêu né trọng lực tự nhiên",
        "plainDefinition": "Tập thói quen ngủ nghiêng một bên để trọng lực không kéo lưỡi và vòm họng tụt lùi ra sau đè bẹp đường thở.",
        "clinicalDetail": "Nhiều bệnh nhân có AHI khi nằm ngửa cao gấp 3-5 lần khi nằm nghiêng (Positional OSA). Ngủ nghiêng có thể giảm tới 50% số cơn tắc.",
        "whyItMatters": "Là hành động tự nhiên, không tốn tiền và hiệu quả nhất mà người dùng có thể áp dụng ngay tối nay."
    },
    {
        "id": "term_perfusion_index",
        "term": "Perfusion Index (PI)",
        "vietnameseName": "Chỉ Số Tưới Máu Ngoại Vi",
        "metaphor": "Áp lực nước trong đường ống",
        "plainDefinition": "Độ mạnh yếu của mạch máu đập ở đầu ngón tay. Nếu tay bị đè hoặc bị lạnh, chỉ số này tụt thấp làm máy đo sai.",
        "clinicalDetail": "Tỷ lệ giữa tín hiệu ánh sáng xung động theo nhịp tim (AC) so với tín hiệu nền không đổi (DC) tại vị trí đo.",
        "whyItMatters": "Chỉ số PI quá thấp là manh mối hàng đầu để phát hiện vết tụt SpO2 là do nằm đè tay chứ không phải do bệnh lý."
    },
    {
        "id": "term_psg",
        "term": "Polysomnography (PSG)",
        "vietnameseName": "Đa Ký Giấc Ngủ",
        "metaphor": "Máy kiểm định toàn diện phòng thí nghiệm",
        "plainDefinition": "Thử nghiệm đo giấc ngủ qua đêm tại bệnh viện với hàng chục cảm biến gắn từ đầu đến chân (điện não, nhịp tim, luồng khí mũi, đai ngực).",
        "clinicalDetail": "Tiêu chuẩn vàng (Gold Standard) để chẩn đoán xác định OSA, phân biệt chính xác ngưng thở tắc nghẽn, trung ương hay hỗn hợp.",
        "whyItMatters": "Nhẫn O2Ring là thiết bị sàng lọc cá nhân, không thể thay thế việc đo PSG chính quy khi cần chẩn đoán y tế."
    },
    {
        "id": "term_cpap",
        "term": "CPAP (Continuous Positive Airway Pressure)",
        "vietnameseName": "Máy Thở Áp Lực Dương Liên Tục",
        "metaphor": "Chiếc nẹp không khí vô hình",
        "plainDefinition": "Chiếc máy thổi một luồng khí êm dịu qua mặt nạ mũi, giữ cho các vách cổ họng luôn căng phồng không thể sập lại.",
        "clinicalDetail": "Phương pháp điều trị chuẩn mực hàng đầu cho OSA mức độ vừa đến nặng, ngăn chặn triệt để tình trạng sập họng và tụt SpO2.",
        "whyItMatters": "Giúp người bệnh hiểu giải pháp y khoa chính thống nếu bệnh ở mức độ cần can thiệp."
    },
    {
        "id": "term_eds",
        "term": "Excessive Daytime Sleepiness (EDS)",
        "vietnameseName": "Buồn Ngủ Ban Ngày Quá Mức",
        "metaphor": "Cơn sập nguồn của bộ não",
        "plainDefinition": "Cảm giác mí mắt nặng trĩu, ngủ gật không thể cưỡng lại khi đang ngồi họp, lái xe, hoặc xem tivi ban ngày.",
        "clinicalDetail": "Đo lường bằng thang điểm buồn ngủ Epworth (ESS > 10). Khác với sự mệt mỏi thể xác đơn thuần do lao động nặng.",
        "whyItMatters": "Là triệu chứng cảnh báo quan trọng nhất dẫn đến nguy cơ tai nạn giao thông và suy giảm chất lượng cuộc sống ở người OSA."
    }
]

with open("src/data/osa.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("SUCCESS: osa.json enriched with Waveform Patterns, Knowledge Hub, and 15 Glossary Items!")
