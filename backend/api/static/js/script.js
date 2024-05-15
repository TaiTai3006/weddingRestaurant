//Lấy dữ liệu đã được lưu trữ trong localstorage
const dataLocalStorage = localStorage.getItem("dataWedding");
//Khởi tạo giá trị ban đầu cho dữ liệu tạo phiểu đặt tiệc cưới
const dataCreateWedding = dataLocalStorage
  ? JSON.parse(dataLocalStorage)
  : { ngaydattiec: getCurrentTime() };

let lobbyList = [];
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

  try {
    const temp = await FetchLobbyList();
    lobbyList = temp; 
    
    constructer(); 
  } catch (error) {
    console.error("Failed to fetch and update lobby list:", error);
  }
}

function constructer() {
  //Đọc giá trị sảnh tồn tại ban đầu
  readAvailablelobbies();

  document.getElementById("ngaydaitiec_input").value =
    dataCreateWedding.ngaydaitiec;

  //Hiển thị thông tin mã ca đã chọn
  document.getElementById("maca_select").value = dataCreateWedding.maca;

  if (dataCreateWedding.masanh) {
    console.log("1234")
    // Hiển thị số lượng bàn tối đa cho lable
    document.getElementById(
      "soluongban_lable"
    ).innerHTML = `Số lượng bàn tối đa ${getNumberOfTables()}`;

    // Set gia tri so luong bàn max cho input
    document.getElementById("soluongban_input").max = getNumberOfTables();

    // Hiem thi so luong ban da chon
    document.getElementById("soluongban_input").value = dataCreateWedding.soluongban
  }
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
  // const shiftInfo = this.options[this.selectedIndex].text;

  dataCreateWedding.maca = maca;
  localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));

  if (dataCreateWedding.ngaydaitiec) {
    readAvailablelobbies();
  }
  // document.getElementById("masanh_select").value = dataCreateWedding.masanh
});

document.getElementById("soluongban_input").addEventListener("change", function(){
  dataCreateWedding.soluongban = parseInt(this.value);
  console.log(dataCreateWedding)
  localStorage.setItem("dataWedding", JSON.stringify(dataCreateWedding));
})

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
          document.getElementById("soluongban_input").value =''
        }
      });
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
  return lobbyList.filter((item)=> item.masanh === dataCreateWedding.masanh)[0].soluongbantoida
}

// function updateWeddingInfo() {
//   // Gather form data
//   const formData = new FormData(document.getElementById("weddingForm"));
//   const data = {};
//   for (const [key, value] of formData.entries()) {
//     data[key] = value;
//   }
//   console.log(data.selected_foods);
//   const weddingInfoDisplay = document.getElementById("weddingInfoDisplay");
//   const ngaydaitiec = document.getElementById("ngaydaitiec");
// }
// const foodTypeSelect = document.getElementById("foodTypeSelect");
// const foodRows = document.querySelectorAll(".foodRow");

foodTypeSelect.addEventListener("change", function () {
  const selectedFoodType = this.value;
  console.log(selectedFoodType);
  foodRows.forEach((row) => {
    const foodType = row.getAttribute("data-loaimonan");
    if (foodType === selectedFoodType || selectedFoodType === "") {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  });
  
});
