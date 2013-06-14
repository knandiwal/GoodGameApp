function List($scope, $http) {
    $scope.list_items = [];
    $scope.cached_urls = {};

    $scope.init = function () {
        $scope.refresh_img();
        $scope.load();
    };

    $scope.check_network = function(){
        function checkConnection() {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN]  = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI]     = 'WiFi connection';
            states[Connection.CELL_2G]  = 'Cell 2G connection';
            states[Connection.CELL_3G]  = 'Cell 3G connection';
            states[Connection.CELL_4G]  = 'Cell 4G connection';
            states[Connection.CELL]     = 'Cell generic connection';
            states[Connection.NONE]     = 'No network connection';

            alert('Connection type: ' + states[networkState]);
        }

        checkConnection();
    };

    $scope.load = function() {
        
        var successCallback = function(data){
            var parsing_div = document.createElement('div');
            parsing_div.innerHTML = data;
            var items = parsing_div.querySelectorAll('.list > .item');
            var result = [];
            for (var i = 0; i < items.length; i++) {
                var preview = items[i].querySelector('.prev > img').getAttribute('src');
                if(preview.indexOf('http://goodgame.ru') == -1){
                    continue;
                }
                var url = items[i].querySelector('.info > a').getAttribute('href') + 'popup/';
                var title = items[i].querySelector('.title').innerText;
                var streamer = items[i].querySelector('.streamer').innerText;
                result.push({'prev': preview, 'url': url, 'title': title, 'streamer': streamer });
            };

            $scope.list_items = result;
            $scope.$apply();
            var new_size_for_descr = 100;

            var elements = document.querySelectorAll('.entrie_line_d > .entrie_descr');
            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute('style', 'width:' + new_size_for_descr + 'px') ;
            };
            document.getElementById('body').style.background = 'white';
            navigator.splashscreen.hide();

            setTimeout(function(){$scope.clear_list()},100);
        };
        $http.get('http://goodgame.ru/ajax/channel/tab/')
            .success(successCallback);
        
        // $scope.check_network();
    };

    $scope.check_url = function(url){
        $http.get(url).success(function(data){
            var parsing_div = document.createElement('div');
            parsing_div.innerHTML = data;
            var player = parsing_div.querySelector('#player-tab iframe');
            if(player == null){
                for (var i = 0; i < $scope.list_items.length; i++) {
                    if($scope.list_items[i].url == url){
                        $scope.list_items.splice(i, 1);
                        break;
                    }
                };
            } else {
                $scope.cached_urls[url] = data;
            }
        });
    };

    $scope.clear_list = function(){
        for (var i = 0; i < $scope.list_items.length; i++) {
            $scope.check_url($scope.list_items[i].url);
        };
        $scope.$apply();

    };

    $scope.show_stream = function(id){

        function successCallback(data){
            
            var parsing_div = document.createElement('div');
            parsing_div.innerHTML = data;
            var player = parsing_div.querySelector('#player-tab iframe');
            if(player == null){
                // alert('Not GoodGameRu player. Video will open in external browser.');
                // var ref = window.open($scope.stream_to_show, '_blank', 'location=yes');
                $scope.list_items.splice($scope.streamid_to_show, 1);
                $scope.$apply();
                return 1;
            }
            document.getElementById('player_block').style.display = 'block';
            var divcontent = document.getElementById('player_block');
            divcontent.appendChild(player);
        }

        $scope.stream_to_show = $scope.list_items[id].url;
        $scope.streamid_to_show = id;
        if($scope.cached_urls[$scope.stream_to_show]){
            successCallback($scope.cached_urls[$scope.stream_to_show]);
        } else {
            $http.get($scope.stream_to_show).success(successCallback);
        }
    };


    $scope.about = function(){
        document.getElementById('main_list').style.display = 'none';
        document.getElementById('about_dialog').style.display = 'block';
    };
    $scope.refresh_button = function(){
        document.getElementById('main_list').style.display = 'block';
        document.getElementById('about_dialog').style.display = 'none';

        $scope.load();
    };



    $scope.refresh_img = function() {
        var aImage = document.getElementById("refr_img");
        var oCanvas = document.createElement("canvas");
        var oCtx = oCanvas.getContext("2d");
        var size = document.getElementById('refresh_button').offsetHeight * 0.7;
        oCanvas.width = size;
        oCanvas.height = size;

        oCtx.save();
        $scope.draw_arrow( size, oCtx );
        oCtx.translate(size,size);
        oCtx.rotate(Math.PI);
        $scope.draw_arrow( size, oCtx );
        oCtx.restore();

        aImage.src = oCanvas.toDataURL();


        var aImage = document.getElementById("menu_img");
        var oCanvas = document.createElement("canvas");
        var oCtx = oCanvas.getContext("2d");
        var size = document.getElementById('menu_button').offsetHeight * 0.7;
        oCanvas.width = size;
        oCanvas.height = size;

        oCtx.save();
        oCtx.translate(size/4,0);
        $scope.draw_info( size, oCtx );
        oCtx.restore();

        aImage.src = oCanvas.toDataURL();

    };

    $scope.draw_info = function( size, ctx) {
        ctx.fillStyle = "rgb(0,255,50)";
        ctx.fillRect ((size/5), 0, (size/2 - (size/3)), (size/8));

        ctx.beginPath();
        ctx.moveTo((size/5), (size/5))
        ctx.lineTo((size/2 - (size/8)), (size/5));
        ctx.bezierCurveTo( (size/2 - (size/8)), (size/1.5), (size/2 - (size/8)), (size/1.5), (size/2), size );
        ctx.bezierCurveTo( (size/5), (size/1.5), (size/5), (size/1.5), (size/5), (size/5) );
        ctx.moveTo((size/5), (size/5));
        ctx.fill();
    }


    $scope.draw_arrow = function( size, ctx) {
        ctx.fillStyle = "rgb(0,255,50)";
        ctx.beginPath();
        ctx.moveTo(size/3, 0);
        ctx.lineTo(size/2, size/4);
        ctx.bezierCurveTo( (size/2 - (size/8)), (size/6), (size/8), (size/6), 0, (size/5) );
        ctx.moveTo(size/3, 0);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo((size/6), (size/6))
        ctx.lineTo((size/2 - (size/8)), (size/6));
        ctx.bezierCurveTo( (size/4), (size/2), (size/4), (size/2), (size/2), size );
        ctx.bezierCurveTo( (size/12), (size/2), (size/12), (size/2), (size/6), (size/6) );
        ctx.moveTo((size/6), (size/6));
        ctx.fill();
    }


}