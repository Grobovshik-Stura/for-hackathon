export let fullMapInstance = null;

const almatyPoints = [
  { coords: [43.2380, 76.8826], name: 'Экоцентр «Вторпроект»', type: 'plastic', address: 'ул. Розыбакиева, 247' },
  { coords: [43.2567, 76.9285], name: 'Пункт приёма макулатуры', type: 'paper', address: 'пр. Аль-Фараби, 19' },
  { coords: [43.2415, 76.8973], name: 'Стеклотара', type: 'glass', address: 'ул. Толе би, 286' },
  { coords: [43.2739, 76.9431], name: 'Металлолом', type: 'metal', address: 'Северное кольцо, 3' },
  { coords: [43.2056, 76.8874], name: 'Батарейки и лампы', type: 'hazard', address: 'ул. Жандосова, 51' },
  { coords: [43.2297, 76.8651], name: 'Пластик ПЭТ', type: 'plastic', address: 'мкр. Аксай-4, 62' },
  { coords: [43.2478, 76.8799], name: 'Стекло и алюминий', type: 'glass', address: 'ул. Гагарина, 124' },
  { coords: [43.2601, 76.9602], name: 'Бумага и картон', type: 'paper', address: 'ул. Майлина, 20' },
  { coords: [43.2154, 76.9078], name: 'Опасные отходы', type: 'hazard', address: 'пр. Райымбека, 212' },
  { coords: [43.2823, 76.9185], name: 'Пластик и пленка', type: 'plastic', address: 'ул. Сатпаева, 90' },
  { coords: [43.1912, 76.9011], name: 'Металл', type: 'metal', address: 'ул. Момышулы, 14' },
  { coords: [43.2334, 76.9442], name: 'Эко-бокс', type: 'all', address: 'ТРЦ Dostyk Plaza' }
];

const markerColors = {
  plastic: '#0B3D2E',
  paper: '#3A7D5C',
  glass: '#2E8B57',
  metal: '#6B8E23',
  hazard: '#8B0000',
  all: '#C8F06C'
};

// Простая функция создания data URI без лишних символов
function createMarkerSvg(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${color}" stroke="#C8F06C" stroke-width="2"/></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function renderPoints(map, filter, points) {
  console.log('Rendering points with filter:', filter);
  map.geoObjects.removeAll();
  const filtered = filter === 'all' ? points : points.filter(p => p.type === filter);
  console.log('Filtered points count:', filtered.length);
  filtered.forEach(point => {
    const color = markerColors[point.type] || '#0B3D2E';
    const iconHref = createMarkerSvg(color);
    console.log('Adding point:', point.name, point.coords, iconHref);
    const pm = new ymaps.Placemark(point.coords, {
      balloonContent: `<strong>${point.name}</strong><br>${point.address}<br><button class="ymap-route-btn" data-coords="${point.coords}">Маршрут</button>`,
      hintContent: point.name
    }, {
      iconLayout: 'default#image',
      iconImageHref: iconHref,
      iconImageSize: [28, 28],
      iconImageOffset: [-14, -14]
    });
    map.geoObjects.add(pm);
  });
  console.log('Total objects on map:', map.geoObjects.getLength());
}

function setupFilters(map, points, filterContainerId) {
  const container = document.getElementById(filterContainerId);
  if (!container) {
    console.warn('Filter container not found:', filterContainerId);
    return;
  }
  container.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const type = pill.dataset.type;
      console.log('Filter clicked:', type);
      renderPoints(map, type, points);
    });
  });
}

function setupGeolocation(map, btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) {
    console.warn('Geolocation button not found:', btnId);
    return;
  }
  btn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coords = [pos.coords.latitude, pos.coords.longitude];
      console.log('Geolocation success:', coords);
      map.setCenter(coords, 15);
    }, err => {
      console.error('Geolocation error:', err);
      alert('Не удалось определить местоположение');
    });
  });
}

export const initMap = () => {
  if (typeof ymaps === 'undefined') {
    console.warn('Yandex Maps не загрузился');
    return;
  }

  ymaps.ready(() => {
    console.log('ymaps ready for preview map');
    const mapContainer = document.getElementById('yandex-map');
    if (!mapContainer) {
      console.error('Map container #yandex-map not found');
      return;
    }
    const map = new ymaps.Map('yandex-map', {
      center: [43.2380, 76.8826],
      zoom: 12,
      controls: []
    });
    console.log('Preview map created');
    renderPoints(map, 'all', almatyPoints);
    setupFilters(map, almatyPoints, 'mapFiltersPreview');
    setupGeolocation(map, 'geolocateBtn');
  });
};

export const initFullMap = () => {
  if (typeof ymaps === 'undefined') {
    console.warn('Yandex Maps не загрузился');
    return;
  }

  ymaps.ready(() => {
    console.log('ymaps ready for full map');
    const mapContainer = document.getElementById('yandex-map-full');
    if (!mapContainer) {
      console.error('Map container #yandex-map-full not found');
      return;
    }
    const map = new ymaps.Map('yandex-map-full', {
      center: [43.2380, 76.8826],
      zoom: 12,
      controls: []
    });
    window.fullMapInstance = map;
    console.log('Full map created');
    renderPoints(map, 'all', almatyPoints);
    setupFilters(map, almatyPoints, 'mapFilters');
    setupGeolocation(map, 'geolocateBtnFull');
  });
};

// Обработка маршрута
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('ymap-route-btn')) {
    const coords = e.target.dataset.coords;
    console.log('Route button clicked, coords:', coords);
    window.open(`https://yandex.ru/maps/?rtext=~${coords}&rtt=auto`, '_blank');
  }
});

