var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		cards:2, dificulty:"hard"
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		options_data = JSON.parse(json);
	};
	var save = function(){
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
}
	
function ocultar_cartes() {
	for (var i = 0; i < game.items.length; i++){
			game.current_card[i].texture=back;
			game.current_card[i].done=false;
		}
}
	
var gameObj = function (){
	const back = "../resources/back.png";
	const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
	"../resources/so.png","../resources/tb.png","../resources/to.png"];
	let l_partida = null;
	if (sessionStorage.idPartida && localStorage.partides){
		let arrayPartides = JSON.parse(localStorage.partides);
		if (sessionStorage.idPartida < arrayPartides.length)
			l_partida = arrayPartides[sessionStorage.idPartida];
	}
	var vueInstance = new Vue({
		el: "#game_id",
		data: {
			username:'',
			current_card: [],
			items: [],
			num_cards: options_data.num_cards,
			bad_clicks: 0
		},
		created: function(){
			this.num_cards=opcions_data.cards;
			this.dificulty=opcions_data.dificulty;
			if (l_partida){
				this.username = l_partida.username;
				this.current_card = l_partida.current_card;
				this.items = l_partida.items;
				this.num_cards = l_partida.num_cards;
				this.bad_clicks = l_partida.bad_clicks;
			}
			else{
				this.username = sessionStorage.getItem("username","unknown");
				this.items = items.slice(); // Copiem l'array
				this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
				this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
				this.items = this.items.concat(this.items); // Dupliquem els elements
				this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
				for (var i = 0; i < this.items.length; i++){
					this.current_card.push({done: false, texture: back});
				}
			}
			var milisegons=1500;
			const tiempo = 0;
			if (this.dificulty=="hard") milisegons=500;
			else if (this.dificulty=="normal") milisegons=1000;
			tiempo = setTimeout(ocultar_cartes, milisegons);
		},
		methods: {
			clickCard: function(i){
				if (!this.current_card[i].done && this.current_card[i].texture === back)
					Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
			},
			save: function(){
				fetch("../php/save.php", {
					method: "POST",
					body: JSON.stringify({
						name: this.username,
						score: this.score_text
					}),
					headers: {
						"Content-type": "application/json"
					}
				}).then(response => response.json()).then(json => {
					alert(json.score);
					this.local_save();
				})
				.catch((error) => {
					alert('Error:', error);
					this.local_save();
				});
			},
			local_save: function(){
				let partida = {
					username: this.username,
					current_card: this.current_card,
					items: this.items,
					num_cards: this.num_cards,
					bad_clicks: this.bad_clicks
				}
				let arrayPartides = [];
				if(localStorage.partides){
					arrayPartides = JSON.parse(localStorage.partides);
					if(!Array.isArray(arrayPartides)) arrayPartides = [];
				}
				arrayPartides.push(partida);
				localStorage.partides = JSON.stringify(arrayPartides);
				loadpage("../");
			}
		},
		watch: {
			current_card: function(value){
				if (value.texture === back) return;
				var front = null;
				var i_front = -1;
				for (var i = 0; i < this.current_card.length; i++){
					if (!this.current_card[i].done && this.current_card[i].texture !== back){
						if (front){
							if (front.texture === this.current_card[i].texture){
								front.done = this.current_card[i].done = true;
								this.num_cards--;
							}
							else{
								Vue.set(this.current_card, i, {done: false, texture: back});
								Vue.set(this.current_card, i_front, {done: false, texture: back});
								this.bad_clicks++;
								break;
							}
						}
						else{
							front = this.current_card[i];
							i_front = i;
						}
					}
				}			
			}
		},
		computed: {
			score_text: function(){
				return 100 - this.bad_clicks * 20;
			}
		}
	});
	return {};
}();