let places = []; // グローバルスコープで管理

fetch('http://localhost:8000/get_visited_places.php')
  .then(response => response.json())
  .then(data => {
    places = data; // データをグローバル変数に格納
    renderVisitedPlaces(); // 初期表示
  })
  .catch(error => console.error('エラー:', error));

function renderVisitedPlaces() {
  const tableBody = document.getElementById('visitedListBody');
  const shopCount = document.getElementById('shopCount');
  
  // テーブルを一旦クリア
  tableBody.innerHTML = '';
  
  // 店名をテーブルに追加
  places.forEach(place => {
    const row = document.createElement('tr');

    // 店名列
    const nameCell = document.createElement('td');
    nameCell.textContent = place.name;
    row.appendChild(nameCell);

    // 削除ボタン列
    const actionCell = document.createElement('td');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.addEventListener('click', () => {
      if (confirm(`「${place.name}」を削除しますか？`)) {
        deleteVisitedPlace(place.place_id);
      }
    });
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
  });

  // 店名数を更新
  shopCount.textContent = `訪問済みの店舗数: ${places.length}`;
}

function deleteVisitedPlace(placeId) {
  fetch('http://localhost:8000/delete_place.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ place_id: placeId }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        // places配列から削除
        places = places.filter(place => place.place_id !== placeId);
        renderVisitedPlaces(); // 再描画
      } else {
        console.error('削除エラー:', data.message);
      }
    })
    .catch(error => console.error('エラー:', error));
}
