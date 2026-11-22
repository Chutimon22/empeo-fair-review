# empeo Fair Review

Working prototype สำหรับ Product Owner Exam: Performance Management ที่เน้นมาตรฐานร่วม หลักฐาน และความโปร่งใสในการประเมิน

## ฟีเจอร์หลัก

- สลับบทบาท HR Admin / Manager / Employee
- HR สร้างและดูรอบประเมิน
- Employee ทำ Self Review พร้อมข้อมูล Goals และ Evidence
- Manager ประเมินด้วย Behavioral Anchors และกติกาหลักฐานสำหรับคะแนนระดับ 1/5
- HR ดู Rating Distribution, Manager Comparison และ Fairness Signals
- Employee ดูผล Feedback และแผนพัฒนาหลังเผยแพร่ผล
- บันทึกสถานะ Demo ใน `localStorage`
- Responsive และรองรับ Keyboard navigation

## เปิดใช้งาน

เปิดผ่าน static HTTP server แล้วเข้า `http://localhost:<port>`

ตัวอย่าง:

```powershell
python -m http.server 4173
```

## หมายเหตุ

ข้อมูลทั้งหมดเป็นข้อมูลจำลองสำหรับการสาธิต ไม่มีการส่งข้อมูลออกจากเครื่อง และไม่มี Backend ตามขอบเขตของ Prototype
