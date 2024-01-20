// ymaps.ready(init);

export function init() {
  const mapElem = document.querySelector('#map');
  const myMap = new ymaps.Map(
    "map",
    {
      center: [55.75846806898367, 37.60108849999989],
      zoom: 16,
      controls: [
        // 'geolocationControl',
        // 'zoomControl'
      ]
    },
    {
      suppressMapOpenBlock: true,
      geolocationControlSize: "large",
      geolocationControlPosition:  { top: "200px", right: "20px" },
      geolocationControlFloat: 'none',
      zoomControlSize: "small",
      zoomControlFloat: "none",
      zoomControlPosition: { top: "120px", right: "20px" }
    }
  );

  myMap.behaviors.disable('scrollZoom');

  const myPlacemark = new ymaps.Placemark(
    [55.75846806898367, 37.60108849999989],
    {},
    {
      iconLayout: "default#image",
      iconImageHref: "../img/point-map.svg",
      iconImageSize: [12, 12],
      iconImageOffset: [190, -140],
    }
  );

  myMap.geoObjects.add(myPlacemark);
  myMap.container.fitToViewport();
}
