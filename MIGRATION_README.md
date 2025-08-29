# Hướng dẫn Migration Database Tiếng Trung

## Tổng quan
Quy trình migration đã được thực hiện để chuyển đổi dữ liệu từ cấu trúc cũ sang cấu trúc mới với Lexical Editor.

## Các file đã tạo

### 1. File cấu trúc database mới
- **File**: `tiengtrung_structure.sql`
- **Mô tả**: Cấu trúc database hoàn toàn mới với các bảng chuẩn Laravel
- **Sử dụng**: Import đầu tiên để tạo cấu trúc

### 2. File dữ liệu đã trích xuất
- **File**: `tiengtrung_extracted.sql`
- **Mô tả**: Dữ liệu đã được trích xuất từ file SQL cũ
- **Sử dụng**: Tham khảo dữ liệu gốc

### 3. File dữ liệu đã chuyển đổi
- **File**: `tiengtrung_converted.sql`
- **Mô tả**: Dữ liệu đã được chuyển đổi sang Lexical Editor format
- **Sử dụng**: Import sau khi đã tạo cấu trúc

## Quy trình import

### Bước 1: Tạo database và cấu trúc
```sql
-- Import file cấu trúc
mysql -u root -p < tiengtrung_structure.sql
```

### Bước 2: Import dữ liệu đã chuyển đổi
```sql
-- Import dữ liệu
mysql -u root -p tiengtrung_db < tiengtrung_converted.sql
```

### Bước 3: Kiểm tra kết quả
- Kiểm tra các bảng đã được tạo
- Kiểm tra dữ liệu đã được import
- Kiểm tra nội dung bài viết đã được chuyển đổi

## Lưu ý quan trọng

### Về nội dung bài viết
- Nội dung HTML đã được chuyển đổi sang JSON format của Lexical Editor
- Các thẻ HTML như `<h1>`, `<p>`, `<ul>`, `<li>` đã được chuyển đổi thành nodes tương ứng
- Text thuần túy đã được chuyển thành paragraph nodes

### Về cấu trúc database
- Sử dụng cấu trúc chuẩn Laravel với timestamps
- Có đầy đủ foreign keys và indexes
- Hỗ trợ soft deletes và các tính năng Laravel khác

### Backup và khôi phục
- File gốc: `tiengtrung_db.sql`
- File đã trích xuất: `tiengtrung_extracted.sql`
- File đã chuyển đổi: `tiengtrung_converted.sql`

## Troubleshooting

### Nếu gặp lỗi import
1. Kiểm tra quyền truy cập database
2. Kiểm tra encoding (utf8mb4)
3. Kiểm tra kích thước file có quá lớn không

### Nếu nội dung hiển thị không đúng
1. Kiểm tra format JSON trong cột content
2. Kiểm tra Lexical Editor có hỗ trợ các node types không
3. Có thể cần điều chỉnh format cho phù hợp

## Thống kê migration
- Tổng số dòng đã xử lý: 540
- Số bảng tìm thấy: 2
- Số INSERT statements: 162
- Số bài viết đã chuyển đổi: 0

## Hỗ trợ
Nếu gặp vấn đề, hãy kiểm tra:
1. Log lỗi của MySQL
2. Format của các file SQL
3. Cấu hình database connection
