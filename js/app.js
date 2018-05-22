var initialPlaces =[
    {
        "name": '中国人民大学',
        "location": [116.313361, 39.970561],
        "attribute": "school"
    },
    {
        "name": '朝阳大悦城',
        "location": [116.518433, 39.924341],
        "attribute": "shop"           
    },
    {
        "name": '北京协和医院',
        "location": [116.41577, 39.912757],
        "attribute": "hospital"            
    },
    {
        "name": '北京大学',
        "location": [116.31088, 39.99281],
        "attribute": "school"            
    },
    {
        "name": '朝阳公园',
        "location": [116.482534, 39.944304],
        "attribute": "park"            
    },
    {
        "name": '安贞医院',
        "location": [116.403428, 39.97286],
        "attribute": "hospital"            
    }];

var lastMarker;
// var res = initialPlaces.filter(function(lot) {
//     return lot.name.indexOf("医院") >= 0;
// });

// //创建Place对象
// var Place = function(data) {
//     this.name = data.name;
//     this.showDetail = function() {
//         //console.log(lastMarker);
//         //如果地图上已有place显示了infoWindow，关掉
//         // if (lastMarker){
//         // 	console.log("存在");
//         //  	infoWindow.close(map, lastMarker.getPosition());
//         //  }
//         //filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素
//         var marker = allMarker.filter((el) => {return el.content == this.name})[0];
//         lastMarker  = marker;
//         infoWindow.open(map, marker.getPosition());
//         infoWindow.setContent(marker.content + " " + today + " " + wenduType + " " +wenduHigh + " " + wenduLow);  
//     };
// };


//绑定数据
var viewModel = function() {
    var self = this;

    self.placeInput = ko.observable('');
    self.places = ko.observableArray(initialPlaces);    

    self.placeList = ko.computed(function() {
        return ko.utils.arrayFilter(self.places(), function(lot) {
            console.log(lot.name);
            if(lot.name.indexOf(self.placeInput()) >= 0){
                console.log("搜索出来了");
                return;
            } else {
                console.log("唔");
            }
        });
    })
    var arr = [1, 2, 3, 4];
    var newArr = ko.utils.arrayFilter(arr, function(el, index) {
        return el < 5;
    });
    console.log(newArr);
    this.showDetail = function() {
        //console.log(lastMarker);
        //如果地图上已有place显示了infoWindow，关掉
        // if (lastMarker){
        //  console.log("存在");
        //      infoWindow.close(map, lastMarker.getPosition());
        //  }
        //filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素
        var marker = allMarker.filter((el) => {return el.content == this.name})[0];
        lastMarker  = marker;
        infoWindow.open(map, marker.getPosition());
        infoWindow.setContent(marker.content + " " + today + " " + wenduType + " " +wenduHigh + " " + wenduLow);  
    };
};
ko.applyBindings(new viewModel());

//初始化地图
var map;
var infoWindow;
var marker;
var allMarker = [];

function init(){
    // 创建地图对象
    map = new AMap.Map('map', {
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
    for(var i = 0; i < initialPlaces.length; i += 1) {

        marker = new AMap.Marker({
            position: initialPlaces[i].location,
            title: initialPlaces[i].name,
            map: map,
            animation: 'AMAP_ANIMATION_DROP'
        });

        allMarker.push(marker);
        //点击marker出现信息窗口
        marker.content = initialPlaces[i].name; 
        marker.on("click", markerClick);
    }
    map.setFitView();
}

var wenduHigh;
var wenduLow;
var wenduType;
var today;

fetch('https://www.apiopen.top/weatherApi?city=北京')
.then(function(response){
        if(response.status!==200){
            alert("天气加载失败，状态码为："+response.status);
            return;
        }
        //检查响应文本
        response.json().then(function(data){
            today = data.data.forecast[0].date;
            wenduHigh = data.data.forecast[0].high;
            wenduLow = data.data.forecast[0].low;
            wenduType = data.data.forecast[0].type;
        });
    })
.catch(function(err){
    alert("出错啦:"+err);
    });

//点击marker出现信息窗口函数
function markerClick(e) {
	// lastMarker = e.target;
 //    //console.log(e.target.content);

	// if (lastMarker)
	// 	infoWindow.close(map, lastMarker.getPosition());

    infoWindow.setContent(e.target.content + " " + today + " " + wenduType + " " +wenduHigh + " " + wenduLow);
    infoWindow.open(map, e.target.getPosition());   
}

