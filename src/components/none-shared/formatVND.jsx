export function formatVND(value) {
    // nếu value là number hoặc string chứa number
    const number = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(number)) return value;
    // định dạng với dấu chấm phân ngàn, rồi thêm " VND" phía sau
    return new Intl.NumberFormat('vi-VN').format(number) + ' VND';
}