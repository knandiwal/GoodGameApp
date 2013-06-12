function Panel($scope, $http) {
    $scope.menu_items = [{'text':'Show all'},{'text':'Refresh'},{'text':'Settings'},{'text':'About'}];

    $scope.init = function () {

    };

    $scope.toggle = function () {
        var menu = document.getElementById('menu_block');
        if (menu.style.display == '' || menu.style.display == 'none'){
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    };


}