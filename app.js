// JavaScriptで地図とラーメン屋の検索・表示を制御
let map, service, infoWindow;
let visitedPlaces = [];

// 地図を初期化する関数
function initMap() {
  infoWindow = new google.maps.InfoWindow();

  // 現在地を取得
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude, // 現在の緯度
        lng: position.coords.longitude, // 現在の経度
      };

      // Google Mapsオブジェクトを作成
      map = new google.maps.Map(document.getElementById("map"), {
        center: pos,
        zoom: 14, // 地図のズームレベルを少し引き気味に
      });

      // Places APIを使った検索リクエスト
      const request = {
        location: pos,
        radius: '1000', // 半径1km
        //type: ['restaurant'], // レストラン
        keyword: 'ラーメン', // 検索キーワード
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback); // 検索を実行
    }, () => {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

// 検索結果を処理するコールバック関数
function callback(results, status, pagination) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.forEach(createMarker);

    // 次ページの結果を取得
    if (pagination && pagination.hasNextPage) {
      setTimeout(() => {
        pagination.nextPage();
      }, 100); // 100msの遅延でリクエスト
    }
  } else {
    console.error('検索結果の取得に失敗:', status);
  }
}


// 地図にマーカーを作成する関数
function createMarker(place) {
  // マーカーの作成
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // 赤いマーカー
  });

  // Places Details リクエストを送信して住所を取得
  const request = {
    placeId: place.place_id,
    fields: ['name', 'formatted_address'], // 必要なフィールドを指定
  };

  service.getDetails(request, (details, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK && details) {
      // マーカークリック時の動作
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.setContent(`
          <div>
            <strong>${details.name}</strong><br>
            <span>${details.formatted_address}</span><br>
            <button onclick="markAsVisited('${place.place_id}', '${details.name}')">訪問済みにする</button>
          </div>
        `);
        infoWindow.open(map, marker);
      });
    } else {
      console.error('詳細取得に失敗:', status);
    }
  });
}


// 訪問済みのラーメン屋を登録する
function markAsVisited(placeId, name) {
  if (!visitedPlaces.includes(placeId)) {
    visitedPlaces.push(placeId);
    saveVisitedPlace(placeId, name);
    alert(`「${name}」を訪問済みに追加しました！`); // アラートで追加したことを利用者に報告
  } else {
    alert(`「${name}」は既に訪問済みに登録されています。`);
  }
}

// サーバーに訪問済みのラーメン屋を保存する
function saveVisitedPlace(placeId, name) {
  fetch('http://localhost:8000/save_place.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ place_id: placeId, name: name }), // 保存データ
  })
    .then(response => response.json())
    .then(data => console.log(data)) // 成功メッセージ
    .catch(error => console.error('Error:', error)); // エラーハンドリング
}

// 位置情報取得エラー時の処理
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed." // 現在地取得失敗
      : "Error: Your browser doesn't support geolocation." // 対応ブラウザでない場合
  );
  infoWindow.open(map);
}

// 訪問済みラーメン屋のリストを表示
document.getElementById('showVisited').addEventListener('click', () => {
  location.href = 'visited.html'; // location.hrefをwindow.openにすると新しいウィンドウで開く
});

// 現在地に地図を移動
document.getElementById('goToCurrentLocation').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      map.setCenter(pos);
    });
  }
});

// おすすめのラーメン屋の表示
document.getElementById('recommendation').addEventListener('click', () => {
  location.href = 'recommendation-ramen.html'; // location.hrefをwindow.openにすると新しいウィンドウで開く
});

// 地図の初期化
window.onload = initMap;
