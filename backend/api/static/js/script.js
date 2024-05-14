document
  .querySelectorAll("#weddingInfo input, #weddingInfo select")
  .forEach((input) => {
    input.addEventListener("input", updateWeddingInfo);
  });
function updateWeddingInfo() {
  // Gather form data
  const formData = new FormData(document.getElementById("weddingForm"));
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  console.log(data.selected_foods);
  const weddingInfoDisplay = document.getElementById("weddingInfoDisplay");
  const ngaydaitiec = document.getElementById("ngaydaitiec")
  console.log(ngaydaitiec)
  ngaydaitiec.innerHTML =`<p>Ngày đặt tiệc: ${data.ngaydattiec || ""}</p>
  `
  // weddingInfoDisplay.innerHTML = `
  //     <h4>Thông tin tiệc cưới</h4>
      
  //     <p>Ngày đãi tiệc: ${data.ngaydaitiec || ""}</p>
  //     <p>Ca: ${data.maca || ""}</p>
  //     <p>Sảnh: ${data.masanh || ""}</p>
  //     <p>Số lượng bàn: ${data.soluongban || ""}</p>
  //     <p>Số lượng bàn dự trữ: ${data.soluongbandutru || ""}</p>
      
  //   `;

}
const foodTypeSelect = document.getElementById('foodTypeSelect');
const foodRows = document.querySelectorAll('.foodRow');

foodTypeSelect.addEventListener('change', function() {
  const selectedFoodType = this.value;
  console.log(selectedFoodType);
  foodRows.forEach(row => {
    const foodType = row.getAttribute('data-loaimonan');
    if (foodType === selectedFoodType || selectedFoodType === '') {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
});
