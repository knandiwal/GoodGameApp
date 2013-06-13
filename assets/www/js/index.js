var register_events = {
    onBack: function(){
        document.getElementById('player_block').style.display = 'none';
        document.getElementById('player_block').innerHTML = '';
        document.getElementById('about_dialog').style.display = 'none';
        document.getElementById('main_list').style.display = 'block';

    }
}

var app = {

    initialize: function() {
        function events(){
            document.addEventListener("backbutton", register_events.onBack, false);
        }
        document.addEventListener('deviceready', events, false);
    },

    onDeviceReady: function() {
        alert('rdy');
    },



};
