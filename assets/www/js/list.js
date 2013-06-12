function List($scope, $http) {
    $scope.list_items = [];

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
                var url = items[i].querySelector('.info > a').getAttribute('href');
                var title = items[i].querySelector('.title').innerText;
                var streamer = items[i].querySelector('.streamer').innerText;
                result.push({'prev': preview, 'url': url, 'title': title, 'streamer': streamer });
            };

            $scope.list_items = result;
        };
        $http.get('http://goodgame.ru/ajax/channel/tab/')
            .success(successCallback);
    };

    $scope.show_stream = function(id){
        function successCallback(data){
            document.getElementById('player_block').style.display = 'block';
            var parsing_div = document.createElement('div');
            parsing_div.innerHTML = data;
            var player = parsing_div.querySelector('#player-tab iframe');
            var divcontent = document.getElementById('player_block');
            console.log(player, divcontent.innerHTML);
            divcontent.appendChild(player);
        }
        $http.get($scope.list_items[id].url + 'popup/')
            .success(successCallback);
    };


}