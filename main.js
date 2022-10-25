
const tableBodyElement = document.querySelector('#tbodySinhVien');
let currenCountSV = localStorage.getItem('msvCount') ? localStorage.getItem('msvCount') : 1;
const listSV = localStorage.getItem('listSV') ? JSON.parse(localStorage.getItem('listSV')) : [];
let editId = '';

const INPUT_TYPE = {
    NUMBER: 'number',
    TEXT: 'text',
    SELECT: 'select'
}



const txtTenSV = document.querySelector('#txtTenSV');
const txtEmail = document.querySelector('#txtEmail');
const txtPass = document.querySelector('#txtPass');
const txtNgaySinh = document.querySelector('#txtNgaySinh');
const khSV = document.querySelector('#khSV');
const txtDiemToan = document.querySelector('#txtDiemToan');
const txtDiemLy = document.querySelector('#txtDiemLy');
const txtDiemHoa = document.querySelector('#txtDiemHoa');



function buildTemplate(svObj) {
    const templateSv = document.querySelector('.templateSinhVien');
    const fragmentSv = templateSv.content.cloneNode(true);
    const svElement = fragmentSv.querySelector('.sinhVienRow');

    const msvElement = svElement.querySelector('.msv');
    msvElement.innerText = svObj.maSv;

    const tsvElement = svElement.querySelector('.tsv');
    tsvElement.innerText = svObj.tenSv;

    const emailElement = svElement.querySelector('.email');
    emailElement.innerText = svObj.email;

    const dobElement = svElement.querySelector('.dob');
    dobElement.innerText = svObj.ngaySinh;

    const courseElement = svElement.querySelector('.course');
    courseElement.innerText = svObj.khoaHoc === '1' ? 'KH001' : 'KH002';

    const dtbElement = svElement.querySelector('.dtb');
    const diemTb = (svObj.diemToan + svObj.diemLy + svObj.diemHoa) / 3;
    dtbElement.innerText = diemTb.toFixed(1);


    // nut xoa
    const removeBtn = svElement.querySelector('.removeBtn');
    removeBtn.addEventListener('click', function () {
        // tim element tren html dua tren id
        tableBodyElement.removeChild(svElement);
        // tim vi tri cua phan tu
        const svIndex = listSV.findIndex((sv) => {
            return sv.maSv = svObj.maSv;
        })
        // lay parent element remove child
        if (svIndex !== -1) {
            listSV.splice(svIndex, 1);
            localStorage.setItem('listSV', JSON.stringify(listSV));
        }
    })


    // nut edit
    const editBtn = svElement.querySelector('.editBtn');
    editBtn.addEventListener('click', () => {
        txtTenSV.value = svObj.tenSv;
        txtEmail.value = svObj.email;
        txtNgaySinh.value = svObj.ngaySinh;
        khSV.value = svObj.khoaHoc;
        txtDiemToan.value = svObj.diemToan;
        txtDiemHoa.value = svObj.diemHoa;
        txtDiemLy.value = svObj.diemLy;
        editId = svObj.maSv;
        addSvBtn.innerText = "Lưu";
    })

    // return html element
    return svElement;
}


for (const sinhVien of listSV) {

    // show template
    const svElement = buildTemplate(sinhVien);
    tableBodyElement.appendChild(svElement);
}

const addSvBtn = document.querySelector('#addSvBtn');

addSvBtn.addEventListener('click', handleAddSv);


// ham them 
function handleAddSv(event) {
    event.preventDefault();
    //lay gia tri o input

    // check dieu kien
    let isValid = true;
    const arrayInputs = [txtTenSV, txtEmail, txtNgaySinh, khSV, txtDiemToan, txtDiemLy, txtDiemHoa];
    // neu deu kien pass thi -> add
    for (const input of arrayInputs) {
        const inputType = input.getAttribute('data-inputType');
        const inputName = input.getAttribute('data-name');
        if (inputType === INPUT_TYPE.TEXT) {
            // validate for text input
            if (!input.value || input.value.length < 4) {
                input.nextElementSibling.style.display = 'block';
                input.nextElementSibling.innerText = `${inputName} is not valid`
                isValid = false;
            }
            else {
                input.nextElementSibling.style.display = 'none';

            }

        }

        if (inputType === INPUT_TYPE.NUMBER) {
            // validate for number input
            if (!input.value) {
                input.nextElementSibling.style.display = 'block';
                input.nextElementSibling.innerText = `${inputName} is not valid`
                isValid = false;
            } else {
                input.nextElementSibling.style.display = 'none';

            }

        }

        if (inputType === INPUT_TYPE.SELECT) {
            // validate for number select
            if (!input.value) {
                input.nextElementSibling.style.display = 'block';
                input.nextElementSibling.innerText = `${inputName} is not valid`
                isValid = false;
            } else {
                input.nextElementSibling.style.display = 'none';

            }

        }

    }


    // neu ko thi dung`
    if (!isValid) return;


    // check is edit
    if (Boolean(editId)) {
        const editElement = listSV.find((sv) => {
            return sv.maSv === editId;
        });
        editElement.tenSv = txtTenSV.value;
        editElement.email = txtEmail.value;
        editElement.khoaHoc = khSV.value;
        editElement.diemToan = Number(txtDiemToan.value);
        editElement.diemLy = Number(txtDiemLy.value);
        editElement.diemHoa = Number(txtDiemHoa.value);

        tableBodyElement.innerHTML = '';

        for (const sinhVien of listSV) {
            const svElement = buildTemplate(sinhVien);

            tableBodyElement.appendChild(svElement);
        }

        const formSv = document.querySelector('#addSvForm');
        formSv.reset();
        editId = '';
        localStorage.setItem('listSV', JSON.stringify(listSV));

        addSvBtn.innerText = 'Thêm sinh viên';
        return;
    }

    //tao template dua tren data moi
    const newSinhVien = {
        tenSv: txtTenSV.value,
        maSv: 'MSV-' + currenCountSV,
        email: txtEmail.value,
        ngaySinh: txtNgaySinh.value,
        password: txtPass.value,
        khoaHoc: khSV.value,
        diemToan: Number(txtDiemToan.value),
        diemLy: Number(txtDiemLy.value),
        diemHoa: Number(txtDiemHoa.value)
    }

    listSV.push(newSinhVien);
    localStorage.setItem('listSV', JSON.stringify(listSV));


    // them vao vi tri can thiet
    const newSvElement = buildTemplate(newSinhVien);
    tableBodyElement.appendChild(newSvElement);

    // reset form
    const formSv = document.querySelector('#addSvForm');
    formSv.reset();

    // tang msv + 1
    currenCountSV++;
    localStorage.setItem('msvCount', currenCountSV);
    document.querySelector('#txtMaSV').value.innerText = 'MSV-' + currenCountSV;

}


