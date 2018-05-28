var initialPlaces = [
  {
    name: "中国人民大学",
    location: [116.313361, 39.970561],
    attribute: "school"
  },
  {
    name: "朝阳大悦城",
    location: [116.518433, 39.924341],
    attribute: "shop"
  },
  {
    name: "北京协和医院",
    location: [116.41577, 39.912757],
    attribute: "hospital"
  },
  {
    name: "北京大学",
    location: [116.31088, 39.99281],
    attribute: "school"
  },
  {
    name: "朝阳公园",
    location: [116.482534, 39.944304],
    attribute: "park"
  },
  {
    name: "安贞医院",
    location: [116.403428, 39.97286],
    attribute: "hospital"
  }
];

//创建Place对象
var Place = function(data) {
  this.name = data.name;
  this.location = data.location;
};

//绑定数据
var viewModel = function() {
  var self = this;
  //输入框的监控
  self.placeInput = ko.observable("");
  //初始化监控数组places
  self.places = ko.observableArray([]);

  // initialPlaces.forEach(function(placeData) {
  //     var place = new Place(placeData);
  //     var name = placeData.name;
  //     var location = placeData.location;

  //     var marker = new AMap.Marker({
  //         position: location,
  //         title: name,
  //         map: map,
  //         animation: 'AMAP_ANIMATION_DROP'
  //     });

  //     marker.on("click", markerClick);
  //     place.marker = marker;
  //     self.places.push(place);

  // });
  allMarker.forEach(function(marker) {
    var place = new Place(marker);
    place.marker = marker;
    console.log(place);
    self.places.push(place);
  });
  //列表筛选
  self.placeList = ko.computed(function() {
    // var arr = [1, 2, 3, 4];
    // var newArr = ko.utils.arrayFilter(arr, function(el, index) {
    //     return el < 5;
    // });
    // console.log(newArr);
    return ko.utils.arrayFilter(self.places(), function(lot) {
      //console.log(lot);
      if (lot.name.indexOf(self.placeInput()) >= 0) {
        //console.log(lot.marker);
        lot.marker.show();
        return true;
      } else {
        lot.marker.hide();
        //先点击infoWindow,再筛选marker应关闭infoWindow
        infoWindow.close(map, lot.marker.getPosition());
        return false;
      }
    });
  });

  this.placeClick = function() {
    //console.log(lastMarker);
    if (lastMarker) {
      infoWindow.close(map, lastMarker.getPosition());
    }
    //filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素
    var marker = allMarker.filter(el => {
      return el.content == this.name;
    })[0];
    // marker.show();
    lastMarker = marker;
    infoWindow.open(map, marker.getPosition());
    infoWindow.setContent(
      marker.content +
        " " +
        today +
        " " +
        wenduType +
        " " +
        wenduHigh +
        " " +
        wenduLow
    );
  };

  //点击汉堡包隐藏/显示菜单
  self.menuHide = ko.observable(true);
  self.menuClass = ko.pureComputed(function() {
    return self.menuHide() ? "toggled" : "";
  });

  self.menuClick = function() {
    self.menuHide(!self.menuHide());
  }
};
//如果在此处绑定viewmodel，则先绑定再调用init 函数就会出现viewmodle 中map 是空的情况
//且创建了两次marker，应共用一个marker 可以起到联动的效果
//ko.applyBindings(new viewModel());

//初始化地图
var map;
var infoWindow;
var allMarker = [];
var lastMarker;

function init() {
  // 创建地图对象
  map = new AMap.Map("map", {
    center: [116.397428, 39.90923],
    zoom: 11
  });
  map.plugin(["AMap.ToolBar"], function() {
    // 添加 工具条
    map.addControl(new AMap.ToolBar());
  });
  //添加信息窗口
  infoWindow = new AMap.InfoWindow();
  //添加标记
  for (var i = 0; i < initialPlaces.length; i += 1) {
    var marker = new AMap.Marker({
      position: initialPlaces[i].location,
      title: initialPlaces[i].name,
      map: map,
      animation: "AMAP_ANIMATION_DROP"
    });
    marker.name = initialPlaces[i].name;
    marker.location = initialPlaces[i].location;

    allMarker.push(marker);
    //点击marker出现信息窗口
    marker.content = initialPlaces[i].name;
    marker.on("click", markerClick);
  }
  map.setFitView();
  ko.applyBindings(new viewModel());
}

var wenduHigh;
var wenduLow;
var wenduType;
var today;
//调用天气api
fetch("https://www.apiopen.top/weatherApi?city=北京")
  .then(function(response) {
    if (response.status !== 200) {
      alert("天气加载失败，状态码为：" + response.status);
      return;
    }
    //检查响应文本
    response.json().then(function(data) {
      today = data.data.forecast[0].date;
      wenduHigh = data.data.forecast[0].high;
      wenduLow = data.data.forecast[0].low;
      wenduType = data.data.forecast[0].type;
    });
  })
  .catch(function(err) {
    alert("出错啦:" + err);
  });

//点击marker出现信息窗口函数
function markerClick(e) {
  lastMarker = e.target;
  //console.log(e.target.content);

  if (lastMarker) infoWindow.close(map, lastMarker.getPosition());

  infoWindow.setContent(
    lastMarker.content +
      " " +
      today +
      " " +
      wenduType +
      " " +
      wenduHigh +
      " " +
      wenduLow
  );
  infoWindow.open(map, lastMarker.getPosition());
}

//地图载入错误，提示用户
var mapErrorHandler = function() {
  alert("地图载入错误");
}
