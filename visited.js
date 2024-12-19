fetch('http://localhost:8000/get_visited_places.php')
  .then(response => response.json())
  .then(places => {
    const tableBody = document.getElementById('visitedListBody');
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
          deleteVisitedPlace(place.place_id, row);
        }
      });
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);

      tableBody.appendChild(row);
    });
  })
  .catch(error => console.error('エラー:', error));

function deleteVisitedPlace(placeId, tableRow) {
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
        tableRow.remove();
      } else {
        console.error('削除エラー:', data.message);
      }
    })
    .catch(error => console.error('エラー:', error));
}
