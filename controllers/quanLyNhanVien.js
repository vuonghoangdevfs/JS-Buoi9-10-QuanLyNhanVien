import { NhanVien } from "../models/NhanVien.js";
import { stringToSlug, validateName, validateEmail, validateDate } from '../assets/util/method.js'
let arrNhanVien = [];
document.querySelector('#frmNhanVien').onsubmit = function (e) {
    e.preventDefault(); //ngăn reload trình duyệt
    //input: NhanVien: object NhanVien Lấy dữ liệu từ giao diện đưa vào object
    let nv = new NhanVien();
    let arrInput = document.querySelectorAll('#frmNhanVien .form-control');
    // Validate
    let errorMess = validateInputData(arrInput);
    if (errorMess) {
        document.querySelector('#validationMessage').innerHTML = errorMess;
    } else {
        for(let input of arrInput){
            let id = input.id;
            let value = input.value;
            nv[id] = value
        }

        // Clear validation message and form data
        resetData();
        // Close bootstrap modal
        closeModal();

        // console.log(nv);
        //Thêm nhân viên vào mảng (1)
        arrNhanVien.push(nv);
        // console.log(arrNhanVien,'arrNhanVien');
        renderTableNhanVien(arrNhanVien);
    }
}   

// Clear validation message and form data
window.resetData = function () {
    document.querySelector('#validationMessage').innerHTML = '';
    document.querySelector('#frmNhanVien').reset();
}

// Close bootstrap modal
window.closeModal = function () {
    document.querySelector('#btnDong').click();
}

window.validateInputData = function (arrInput) { //input là mảng 
    let errorMess = '';
    for(let input of arrInput){
        // Validate
        if (input.id == 'taiKhoan' && (!input.value || input.value.length > 6 || input.value.length < 4)) {
            errorMess = 'Tài khoản tối đa 4 - 6 ký số, không để trống';
            break;
        } else if (input.id == 'hoVaTen' && (!input.value || !validateName(input.value))) {
            errorMess = 'Tên nhân viên phải là chữ, không để trống';
            break;
        } else if (input.id == 'email' && (!input.value || !validateEmail(input.value))) {
            errorMess = 'Email phải đúng định dạng, không để trống';
            break;
        } else if (input.id == 'matKhau' && (!input.value || input.value.length > 10 || input.value.length < 6)) {
            errorMess = 'Mật Khẩu từ 6-10 ký tự, không để trống';
            break;
        } else if (input.id == 'ngayLam' && (!input.value || !validateDate(input.value))) {
            errorMess = 'Ngày làm không để trống, định dạng mm/dd/yyyy';
            break;
        } else if (input.id == 'luongCoBan' && (!input.value || input.value > 2000000 || input.value < 1000000)) {
            errorMess = 'Lương cơ bản 1 000 000 - 20 000 000, không để trống';
            break;
        } else if (input.id == 'chucVu' && (!input.value || !['Giám đốc', 'Trưởng phòng', 'Nhân viên'].includes(input.value))) {
            errorMess = 'Chức vụ phải chọn chức vụ hợp lệ (Giám đốc, Trưởng Phòng, Nhân Viên)';
            break;
        } else if (input.id == 'gioLam' && (!input.value || input.value > 200 || input.value < 80)) {
            errorMess = ' Số giờ làm trong tháng 80 - 200 giờ, không để trống';
            break;
        } 
    }
    return errorMess;
}

window.tinhTongLuong = function (chucVu, luongCoBan) { //input là mảng 
    let heSoLuong = 1;
    let tongLuong = 0;
    if (chucVu == 'Giám đốc') {
        heSoLuong = 3
    } else if (chucVu == 'Trưởng Phòng') {
        heSoLuong = 2
    }
    tongLuong = luongCoBan * heSoLuong;
    return tongLuong;
}

window.xepLoaiNhanVien = function (gioLam) { //input là mảng 
   let xepLoai = 'Trung bình';
    if (gioLam >= 192) {
        xepLoai = 'Xuất sắc';
    } else if (gioLam >= 176) {
        xepLoai = 'Giỏi';
    } else if (gioLam >= 160) {
        xepLoai = 'Khá';
    }
    return xepLoai;
}

window.renderTableNhanVien = function (arrNV) { //input là mảng 
    let htmlString = ''
    for(let nv of arrNV){
        // Tính tổng lương
        let tongLuong = tinhTongLuong(nv.chucVu, nv.luongCoBan);

        // Xếp loại
        let xepLoai = xepLoaiNhanVien(nv.gioLam);

        htmlString +=`
            <tr>
                <td>${nv.taiKhoan}</td>
                <td>${nv.hoVaTen}</td>
                <td>${nv.email}</td>
                <td>${nv.ngayLam}</td>
                <td>${nv.chucVu}</td>
                <td>${tongLuong}</td>
                <td>${xepLoai}</td>
                <td>
                    <button class="btn btn-primary mx-2" onclick="chinhSua('${nv.taiKhoan}')">Chỉnh sửa</button>
                    <button class="btn btn-danger" onclick="xoaNhanVien('${nv.taiKhoan}')" >Xoá</button>
                </td>
            </tr>
        `
    }
    //output: in ra giao diện html
    document.querySelector('#tableDanhSach').innerHTML = htmlString;
    return htmlString;
}

/* 
    arrNV = [
        {taiKhoan:1,hoVaTen:'Nguyễn Văn A',...} //index = 0
        {taiKhoan:2,hoVaTen:'Nguyễn Văn B',...},// index = 1
        {taiKhoan:3,hoVaTen:'Nguyễn Văn C',...}, // index =2
    ]
*/
window.xoaNhanVien = function (taiKhoan) {
    // console.log(taiKhoan);
    let indexDel = arrNhanVien.findIndex(nv => nv.taiKhoan === taiKhoan);
    if(indexDel !== -1) { //Nếu tìm thấy nhân viên có mã = với mã của nút click thì xoá nhân viên đó trong mảng
        arrNhanVien.splice(indexDel,1);
        console.log(arrNhanVien)
        renderTableNhanVien(arrNhanVien); //Sau khi xoá xong thì render lại table nhân viên từ mảng mới
    }
}
/* 
    arrNV = [
        {taiKhoan:1,hoVaTen:'Nguyễn Văn A',...} //index = 0
        {taiKhoan:2,hoVaTen:'Nguyễn Văn B',...},// index = 1
        {taiKhoan:3,hoVaTen:'Nguyễn Văn C',...}, // index =2
        {taiKhoan:abc,hoVaTen:'Nguyễn Văn C',...}, // index =3
    ]
*/
window.chinhSua = function (taiKhoan) {
    document.querySelector('#btnThem').click();

    document.querySelector('#taiKhoan').disabled = true;
    document.querySelector('#btnThemNV').disabled = true;
    
    let nvUpdate = arrNhanVien.find(nv => nv.taiKhoan === taiKhoan);
    if(nvUpdate) {
        // {taiKhoan:abc,hoVaTen:'Nguyễn Văn C',...}, // index =3

        //Load nhân viên đó lên các thẻ form
        // document.querySelector('#taiKhoan').value = nvUpdate.taiKhoan;
        // document.querySelector('#hoVaTen').value = nvUpdate.hoVaTen;
        for (let key in nvUpdate){
            document.querySelector(`#${key}`).value = nvUpdate[key];
        }
    }
}
/*
     arrNV = [
        {taiKhoan:1,hoVaTen:'Nguyễn Văn A',...} //index = 0
        {taiKhoan:2,hoVaTen:'Nguyễn Văn B',...},// index = 1
        {taiKhoan:3,hoVaTen:'Nguyễn Văn C',...}, // index =2
        {taiKhoan:abc,hoVaTen:'Nguyễn Văn C',...}, // index =3
    ]
    [0xx1,0xx2,0xx3]
*/
document.querySelector('#btnCapNhat').onclick = function(e) {
    //Lấy tất cả thông tin từ giao diện đưa vào object 
    let nvEdit = new NhanVien(); // {taiKhoan:'1',hoVaTen:'b update',} 
    let arrInput = document.querySelectorAll('#frmNhanVien .form-control');

    // Validate
    let errorMess = validateInputData(arrInput);
    if (errorMess) {
        document.querySelector('#validationMessage').innerHTML = errorMess;
    } else {
        for(let input of arrInput){
            let id = input.id;
            let value = input.value;
            nvEdit[id] = value
        }

        //Sau khi lấy dữ liệu từ giao diện đưa vào object nvEdit => tìm thằng trong mảng để cập nhật thông tin = nvEdit
        let nvTrongMang = arrNhanVien.find(nv => nv.taiKhoan === nvEdit.taiKhoan);
        if(nvTrongMang){ // {taiKhoan:1,hoVaTen:'Nguyễn Văn A',...} //index = 0 
            // Clear validation message and form data
            resetData();
            // Close bootstrap modal
            closeModal();
            
            // nvTrongMang['taiKhoan'] = nvEdit['taiKhoan'];
            for(let key in nvTrongMang){
                nvTrongMang[key] = nvEdit[key];
            }
            //Mảng sau khi thay đổi thì render lại table từ mảng mới
            renderTableNhanVien(arrNhanVien);
            document.querySelector('#taiKhoan').disabled = false;
            document.querySelector('#btnThemNV').disabled = false;
        } else {
            document.querySelector('#validationMessage').innerHTML = 'Không tìm thấy nhân viên';
        }
    }
}

document.querySelector('#frmTimKiem').onsubmit = function(e) {
    e.preventDefault();
    //input: keyword,loaiTimKiem
    let tuKhoa = document.querySelector('#searchName').value;
    tuKhoa = stringToSlug(tuKhoa);
    
    let arrNVTimKiem = [];
    //output: arr được filter theo từ khoá
    arrNVTimKiem = arrNhanVien.filter(nv => stringToSlug(xepLoaiNhanVien(nv.gioLam)).search(tuKhoa) !== -1);
    
    //Sau khi filter thì dùng mảng kết quả render lại table
    renderTableNhanVien(arrNVTimKiem);
    if(arrNVTimKiem.length > 0) {   
        document.querySelector('#ketQuaTimKiem').className = 'alert alert-success mt-2';
        document.querySelector('#ketQuaTimKiem').innerHTML = `Tìm thấy ${arrNVTimKiem.length} nhân viên`;
    } else {
        document.querySelector('#ketQuaTimKiem').className = 'alert alert-danger mt-2';
        document.querySelector('#ketQuaTimKiem').innerHTML = `Không tìm thấy nhân viên nào`;
    }

}