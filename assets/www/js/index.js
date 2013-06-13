var register_events = {
    onBack: function(){
        document.getElementById('player_block').style.display = 'none';
        document.getElementById('player_block').innerHTML = '';
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
