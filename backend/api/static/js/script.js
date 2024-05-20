//Lấy dữ liệu đã được lưu trữ trong localstorage
const dataLocalStorage = localStorage.getItem("dataWedding");
//Khởi tạo giá trị ban đầu cho dữ liệu tạo phiểu đặt tiệc cưới
const dataCreateWedding = dataLocalStorage
  ? JSON.parse(dataLocalStorage)
  : { ngaydattiec: getCurrentTime() };

let lobbyList = [];
let parameterlist = {};
fetchAPI();

async function fetchAPI() {
  const FetchLobbyList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/lobbies/");
      return response.data;
    } catch (error) {
      console.error("Error fetching lobby list:", error);
      throw error;
    }
  };

  const FetchParameterList = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/parameter/");
      return response.data[0];
    } catch (error) {
      console.error("Error fetching parameter list:", error);
      throw error;
    }
  };

  try {
    const temp = await FetchLobbyList();
    lobbyList = temp;
    parameter = await FetchParameterList();
    console.log(parameter);
    constructer();
  } catch (error) {
    console.error("Failed to fetch and update lobby list:", error);
  }
}

function constructer() {
  //Đọc giá trị sảnh tồn tại ban đầu
  readAvailablelobbies();

  //Đọc bảng thực đơn
  readFoodTable();

  document.getElementById("ngaydaitiec_input").value =
    dataCreateWedding.ngaydaitiec;

  //Hiển thị thông tin mã ca đã chọn
  document.getElementById("maca_select").value = dataCreateWedding.maca;

  if (dataCreateWedding.masanh) {
    // Hiển thị số lượng bàn tối đa cho lable
    document.getElementById(
      "soluongban_lable"
    ).innerHTML = `Số lượng bàn tối đa ${getNumberOfTables()}`;

    // Set gia tri so luong bàn max cho input
    document.getElementById("soluongban_input").max = getNumberOfTables();

    // Hiem thi so luong ban da chon
    document.getElementById("soluongban_input").value =
      dataCreateWedding.soluongban;

    //Them du lieu vao bang xac nhan thuc don dã đặt
    addRowFoodTableConfirm();
  }

  //Hiển thị thông các dịch vụ đã chọn
  document.querySelectorAll("#service_checkbox").forEach((checkbox) => {
    if (dataCreateWedding.danhsachdichvu) {
      dataCreateWedding.danhsachdichvu.map((service) => {
        if (service.madichvu === checkbox.value) {
          let soluongElement = document.getElementById(
            `soluong_${service.madichvu}`
          );
          let ghichuElement = document.getElementById(
            `ghichu_${service.madichvu}`
          );
          checkbox.checked = true;
          soluongElement.style = "display: block;";
          ghichuElement.style = "display: block;";
          soluongElement.value = service.soluong;
          ghichuElement.value = service.ghichu;
        }
      });
    }
  });

  // Thêm dữ liệu vào bảng  xác nhận dịch vụ
  addRowServiceTableConfirm();

  console.log(dataCreateWedding);
  //Hiển thị dữ liệu tên chú rể
  dataCreateWedding.tenchure
    ? (document.getElementById("tenchure_input").value =
        dataCreateWedding.tenchure)
    : "";

  //Hiển thị dữ liệu tên cô dâu
  dataCreateWedding.tencodau
    ? (document.getElementById("tencodau_input").value =
        dataCreateWedding.tencodau)
    : "";

  //Hiển thị số điện thoại khách hàng
  dataCreateWedding.sdt
    ? (document.getElementById("sdt_input").value = dataCreateWedding.sdt)
    : "";
}

function getCurrentTime() {
  var currentTime = new Date();

  var day = currentTime.getDate();
  var month = currentTime.getMonth() + 1;
  var year = currentTime.getFullYear();

  return (
    year +
    "-" +
    (month < 10 ? "0" + month : month) +
    "-" +
    (day < 10 ? "0" + day : day)
  );
}

function convertDateFormat(dateString) {
  var dateParts = dateString.split("-");
  return dateParts[2] + "-" + dateParts[1] + "-" + dateParts[0];
}

document
  .getElementById("ngaydaitiec_input")
  .addEventListener("input", function () {
    const ngaydaitiec = this.value;
    dataCreateWedding.ngaydaitiec = ngaydaitiec;
    localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));

    if (dataCreateWedding.maca) {
      readAvailablelobbies();
    }
  });

document.getElementById("maca_select").addEventListener("change", function () {
  const maca = this.value;

  dataCreateWedding.maca = maca;
  localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));

  if (dataCreateWedding.ngaydaitiec) {
    readAvailablelobbies();
  }
});

document
  .getElementById("soluongban_input")
  .addEventListener("change", function () {
    dataCreateWedding.soluongban = parseInt(this.value);

    localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
  });

function readAvailablelobbies() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    document.getElementById("selectLobbies").innerHTML = this.responseText;
    if (dataCreateWedding.masanh) {
      document.getElementById("masanh_selected").value =
        dataCreateWedding.masanh;
    }

    document
      .getElementById("masanh_selected")
      .addEventListener("change", function () {
        dataCreateWedding.masanh = this.value;
        localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));

        if (dataCreateWedding.masanh) {
          document.getElementById(
            "soluongban_lable"
          ).innerHTML = `Số lượng bàn tối đa ${getNumberOfTables()}`;
          document.getElementById("soluongban_input").max = getNumberOfTables();
          document.getElementById("soluongban_input").value = "";
        }
        showResultsChoiceFood();
      });

    showResultsChoiceFood();
  };
  xhttp.open("POST", "bookingParty/bollies/available/");
  xhttp.setRequestHeader("Content-type", "application/json");

  var csrf_token_input = document.querySelector(
    'input[name="csrfmiddlewaretoken"]'
  );
  var csrf_token = csrf_token_input ? csrf_token_input.value : null;

  var data = {
    maca: dataCreateWedding.maca ? dataCreateWedding.maca : "",
    ngaydaitiec: dataCreateWedding.ngaydaitiec
      ? dataCreateWedding.ngaydaitiec
      : "",
  };

  if (csrf_token) {
    xhttp.setRequestHeader("X-CSRFToken", csrf_token);
  }

  xhttp.send(JSON.stringify(data));
}

function getNumberOfTables() {
  return lobbyList.filter((item) => item.masanh === dataCreateWedding.masanh)[0]
    .soluongbantoida;
}

function getMinimumTablePrice() {
  let lobbySeleted =
    document.getElementById("masanh_selected").options[
      document.getElementById("masanh_selected").selectedIndex
    ].innerText;
  let match = lobbySeleted.match(/Đơn bàn tối thiểu \(([\d,]+)\)/);
  let donGiaBanToiThieu = match ? match[1] : null;
  return donGiaBanToiThieu.replace(/,/g, "");
}

function readFoodTable() {
  let type = document.getElementById("foodTypeSelect").value;
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    document.getElementById("foodlist").innerHTML = this.responseText;

    document.querySelectorAll("#food_checkbox").forEach((food_checkbox) => {
      food_checkbox.addEventListener("click", function () {
        foodList = dataCreateWedding.danhsachmonan
          ? dataCreateWedding.danhsachmonan
          : [];
        let ghichuElement = document.getElementById(`ghichu_${this.value}`);
        console.log(ghichuElement)
        console.log(`ghichu_${this.value}`)
        if (this.checked) {
          console.log(ghichuElement)
          ghichuElement.style = "display: block;";
          foodList.push({
            mamonan: this.value,
            dongiamonan: parseFloat(
              document
                .getElementById(`dongia_${this.value}`)
                .innerText.replace(/,/g, "")
            ),
            soluong: dataCreateWedding.soluongban,
            ghichu: "",
          });

          dataCreateWedding.danhsachmonan = foodList;
          localStorage.setItem(
            "dataWedding",
            JSON.stringify(dataCreateWedding)
          );
        } else {
          ghichuElement.style = "display: none;";
          ghichuElement.value = ""
          dataCreateWedding.danhsachmonan = foodList.filter(
            (food) => food.mamonan !== this.value
          );
          localStorage.setItem(
            "dataWedding",
            JSON.stringify(dataCreateWedding)
          );
        }

        showResultsChoiceFood();
        addRowFoodTableConfirm();
      });
    });

    //Hien thi cac mon an đã chọn
    document.querySelectorAll("#food_checkbox").forEach((food_checkbox) => {
      if (dataCreateWedding.danhsachmonan) {
       
        dataCreateWedding.danhsachmonan.map((food) => {
          if (food.mamonan === food_checkbox.value) {
            let ghichuElement = document.getElementById(`ghichu_${food.mamonan}`);
            food_checkbox.checked = true;
            ghichuElement.style = "display: block;";
            ghichuElement.value = food.ghichu;
          }
        });
      }
    });

    document.querySelectorAll(".ghichuMA_input").forEach((input) => {
      input.addEventListener("input", function (e) {
        foodList = dataCreateWedding.danhsachmonan;
        mamonan = this.id.substring(7);
        dataCreateWedding.danhsachmonan = foodList.map((food) => {
          if (food.mamonan === mamonan) {
            food.ghichu = e.target.value;
          }
          return food;
        });
        addRowFoodTableConfirm();
        localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
      });
    });
  };
  xhttp.open("GET", "getFoodTable/" + type + "/", true);
  xhttp.send();
}

document
  .getElementById("foodTypeSelect")
  .addEventListener("change", function () {
    readFoodTable();
  });

function showResultsChoiceFood() {
  let dongiabantoithieu = getMinimumTablePrice() ? getMinimumTablePrice() : 0;
  let tongdonban = dataCreateWedding.danhsachmonan?.reduce(
    (accumulator, currentValue) => accumulator + currentValue.dongiamonan,
    0
  );
  let tongdonbanhientai = tongdonban ? tongdonban : 0;

  if (dongiabantoithieu > tongdonbanhientai) {
    document.getElementById(
      "notification_result"
    ).innerHTML = `<p>Đơn giá bàn tối thiểu: ${formatCurrency(
      dongiabantoithieu
    )}</p><p style="color:red;">Tổng đơn bàn hiện tại: ${formatCurrency(
      tongdonbanhientai
    )}</p>`;
  } else {
    document.getElementById(
      "notification_result"
    ).innerHTML = `<p>Đơn giá bàn tối thiểu: ${formatCurrency(
      dongiabantoithieu
    )}</p><p>Tổng đơn bàn hiện tại: ${formatCurrency(tongdonbanhientai)}</p>`;
  }
}

function addRowFoodTableConfirm() {
  let table = document
    .getElementById("food_table_comfirm")
    .getElementsByTagName("tbody")[0];

  clearTableConfirm("food_table_comfirm");

  dataCreateWedding?.danhsachmonan.map((food, index) => {
    let newRow = table.insertRow(index);
    let cell0 = newRow.insertCell(0);
    let cell1 = newRow.insertCell(1);
    let cell2 = newRow.insertCell(2);
    let cell3 = newRow.insertCell(3);
    let cell4 = newRow.insertCell(4);

    cell0.innerHTML = index + 1;
    cell1.innerHTML = food.mamonan;
    cell2.innerHTML = formatCurrency(food.dongiamonan);
    cell3.innerHTML = food.ghichu;
    cell4.innerHTML = formatCurrency(food.dongiamonan);
  });

  let tongdonban = dataCreateWedding.danhsachmonan?.reduce(
    (accumulator, currentValue) => accumulator + currentValue.dongiamonan,
    0
  );
  document.getElementById("result_tdgb").innerHTML = tongdonban
    ? formatCurrency(tongdonban)
    : 0;
}

function clearTableConfirm(id) {
  let table = document.getElementById(id).getElementsByTagName("tbody")[0];
  while (table.rows.length > 0) {
    table.deleteRow(0); // Xoá hàng đầu tiên cho đến khi không còn hàng nào
  }
}

function formatCurrency(numberString) {
  return Number(numberString).toLocaleString("en-US");
}

document.querySelectorAll("#service_checkbox").forEach((checkbox) => {
  checkbox.addEventListener("click", function () {
    serviceList = dataCreateWedding.danhsachdichvu
      ? dataCreateWedding.danhsachdichvu
      : [];
    let soluongElement = document.getElementById(`soluong_${this.value}`);
    let ghichuElement = document.getElementById(`ghichu_${this.value}`);
    if (this.checked) {
      soluongElement.style = "display: block;";
      ghichuElement.style = "display: block;";
      soluongElement.value = 1;

      serviceList.push({
        madichvu: this.value,
        dongiadichvu: parseFloat(
          document
            .getElementById(`dongia_${this.value}`)
            .innerText.replace(/,/g, "")
        ),
        soluong: soluongElement.value,
        ghichu: ghichuElement.value,
        thanhtien:
          parseFloat(
            document
              .getElementById(`dongia_${this.value}`)
              .innerText.replace(/,/g, "")
          ) * soluongElement.value,
      });

      dataCreateWedding.danhsachdichvu = serviceList;
      localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
    } else {
      soluongElement.style = "display: none;";
      ghichuElement.style = "display: none;";
      ghichuElement.value = "";

      dataCreateWedding.danhsachdichvu = serviceList.filter(
        (service) => service.madichvu !== this.value
      );
      localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
    }
    addRowServiceTableConfirm();
  });
});

document.querySelectorAll(".soluongDV_input").forEach((input) => {
  input.addEventListener("change", function () {
    serviceList = dataCreateWedding.danhsachdichvu;
    madichvu = this.id.substring(8);
    console.log(madichvu);
    dataCreateWedding.danhsachdichvu = serviceList.map((service) => {
      if (service.madichvu === madichvu) {
        service.thanhtien = this.value * service.dongiadichvu;
        service.soluong = this.value;
      }
      return service;
    });
    addRowServiceTableConfirm();
    localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
  });
});

document.querySelectorAll(".ghichuDV_input").forEach((input) => {
  input.addEventListener("input", function () {
    serviceList = dataCreateWedding.danhsachdichvu;
    madichvu = this.id.substring(7);
    console.log(madichvu);
    dataCreateWedding.danhsachdichvu = serviceList.map((service) => {
      if (service.madichvu === madichvu) {
        service.ghichu = this.value;
      }
      return service;
    });
    addRowServiceTableConfirm();
    localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
  });
});

function addRowServiceTableConfirm() {
  let table = document
    .getElementById("service_table_comfirm")
    .getElementsByTagName("tbody")[0];

  clearTableConfirm("service_table_comfirm");

  dataCreateWedding?.danhsachdichvu.map((service, index) => {
    let newRow = table.insertRow(index);
    let cell0 = newRow.insertCell(0);
    let cell1 = newRow.insertCell(1);
    let cell2 = newRow.insertCell(2);
    let cell3 = newRow.insertCell(3);
    let cell4 = newRow.insertCell(4);
    let cell5 = newRow.insertCell(5);

    cell0.innerHTML = index + 1;
    cell1.innerHTML = service.madichvu;
    cell2.innerHTML = service.soluong;
    cell3.innerHTML = formatCurrency(service.dongiadichvu);
    cell4.innerHTML = service.ghichu;
    cell5.innerHTML = formatCurrency(service.thanhtien);
  });

  let tongtienDV = dataCreateWedding.danhsachdichvu?.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.dongiadichvu * currentValue.soluong,
    0
  );
  document.getElementById("result_ttdd").innerHTML = tongtienDV
    ? formatCurrency(tongtienDV)
    : 0;
}

document
  .getElementById("tenchure_input")
  .addEventListener("input", function (e) {
    dataCreateWedding.tenchure = e.target.value;
    localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
  });

document
  .getElementById("tencodau_input")
  .addEventListener("input", function (e) {
    dataCreateWedding.tencodau = e.target.value;
    localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
  });

document.getElementById("sdt_input").addEventListener("input", function (e) {
  dataCreateWedding.sdt = e.target.value;
  console.log(dataCreateWedding);
  localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
});


document
  .getElementById("totalBill_button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Total Bill")
    document.getElementById("totalBill_result").style.display = "block";
    dataCreateWedding.dongiaban = dataCreateWedding.danhsachmonan.reduce(
      (accumulator, currentValue) => accumulator + currentValue.dongiamonan,
      0
    );
    dataCreateWedding.tongtienban =
      dataCreateWedding.soluongban * dataCreateWedding.dongiaban;
    dataCreateWedding.tongtiendichvu = dataCreateWedding.danhsachdichvu.reduce(
      (accumulator, currentValue) => accumulator + currentValue.thanhtien,
      0
    );
    dataCreateWedding.tongtiendattiec =
      dataCreateWedding.tongtienban + dataCreateWedding.tongtiendichvu;
      console.log(dataCreateWedding.tongtiendattiec)
    dataCreateWedding.tiendatcoc =
      (parameter.tiledatcoc / 100) * dataCreateWedding.tongtiendattiec;
    dataCreateWedding.conlai =
      dataCreateWedding.tongtiendattiec - dataCreateWedding.tiendatcoc;
console.log(document.getElementById("totalBill_result"))
    document.getElementById("totalBill_result").innerHTML =
    `<p class="mx-1 p-1 border-end">Tổng tiền bàn: ${formatCurrency(dataCreateWedding.tongtienban)}</p>` +
    `<p class="mx-1 p-1 border-end">Tổng tiền đặt tiệc: ${formatCurrency(dataCreateWedding.tongtiendattiec)}</p>` +
    `<p class="mx-1  p-1">Tiền đặt cọc (${parameter.tiledatcoc}%): ${formatCurrency(dataCreateWedding.tiendatcoc)}</p>`;
      // `<p>Còn lại: ${formatCurrency(dataCreateWedding.conlai)}</p>`;
      document.getElementById("totalAmount").innerText =  `${formatCurrency(dataCreateWedding.tiendatcoc)}`
  });

document
  .getElementById("payment_button")
  .addEventListener("click", function (e) {
    e.preventDefault();
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      localStorage.removeItem("dataWedding");
      window.location.reload();
    };
    xhttp.open("POST", "bookingParty/");
    xhttp.setRequestHeader("Content-type", "application/json");

    var csrf_token_input = document.querySelector(
      'input[name="csrfmiddlewaretoken"]'
    );
    var csrf_token = csrf_token_input ? csrf_token_input.value : null;

    if (csrf_token) {
      xhttp.setRequestHeader("X-CSRFToken", csrf_token);
    }

    xhttp.send(JSON.stringify(dataCreateWedding));
  });
