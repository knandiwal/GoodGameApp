function List($scope, $http) {
    $scope.list_items = [];
    $scope.menu_element = document.getElementById('menu_block');

    $scope.init = function () {
        $scope.load();
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

        };
        $http.get('http://goodgame.ru/ajax/channel/tab/')
            .success(successCallback);
        setTimeout(function(){$scope.clear_list()},3000);
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
        navigator.notification.activityStart("Stream requested...", "loading");

        function successCallback(data){
            var parsing_div = document.createElement('div');
            parsing_div.innerHTML = data;
            var player = parsing_div.querySelector('#player-tab iframe');
            if(player == null){
                // alert('Not GoodGameRu player. Video will open in external browser.');
                // var ref = window.open($scope.stream_to_show, '_blank', 'location=yes');
                $scope.list_items.splice($scope.streamid_to_show, 1);
                $scope.$apply();
                navigator.notification.activityStop();
                return 1;
            }
            document.getElementById('player_block').style.display = 'block';
            var divcontent = document.getElementById('player_block');
            divcontent.appendChild(player);
            navigator.notification.activityStop();
        }
        $scope.stream_to_show = $scope.list_items[id].url;
        $scope.streamid_to_show = id;
        $http.get($scope.stream_to_show).success(successCallback);
    };


    $scope.about = function(){
        document.getElementById('main_list').style.display = 'none';
        document.getElementById('about_dialog').style.display = 'block';
        $scope.toggle();
    };
    $scope.refresh_button = function(){
        document.getElementById('main_list').style.display = 'block';
        document.getElementById('about_dialog').style.display = 'none';

        $scope.load();
        $scope.toggle();
    };

    $scope.menu_items = [{'text':'Refresh', 'call': $scope.refresh_button},
        {'text':'About', 'call': $scope.about}];

    $scope.toggle = function () {
        if ($scope.menu_element.style.display == '' || $scope.menu_element.style.display == 'none'){
            $scope.menu_element.style.display = 'block';
        } else {
            $scope.menu_element.style.display = 'none';
        }
    };
    $scope.menu_call = function(index){
        $scope.menu_items[index].call();
    };

}