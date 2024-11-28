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
        zoom: 15, // 地図のズームレベル
      });

      // Places APIを使った検索リクエスト
      const request = {
        location: pos,
        radius: '1000', // 半径1km
        type: ['restaurant'], // レストラン
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
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    results.forEach((result) => {
      createMarker(result); // 各結果にマーカーを作成
    });
  }
}

// 地図にマーカーを作成する関数
function createMarker(place) {
  const marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // 赤いマーカー
  });

  // マーカークリック時の動作
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.setContent(`
      <div>
        <strong>${place.name}</strong>
        <button onclick="markAsVisited('${place.place_id}', '${place.name}')">訪問済み</button>
      </div>
    `);
    infoWindow.open(map, marker);
  });
}

// 訪問済みのラーメン屋を登録する
function markAsVisited(placeId, name) {
  if (!visitedPlaces.includes(placeId)) {
    visitedPlaces.push(placeId);
    saveVisitedPlace(placeId, name);
  }
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
  window.open('visited.html', '_blank', 'width=400,height=600');
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

// 地図の初期化
window.onload = initMap;
