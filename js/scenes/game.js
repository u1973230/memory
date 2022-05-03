class GameScene extends Phaser.Scene {
    constructor (){
        super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
    }

    preload (){	
		this.load.image('back', '../resources/back.png');
		this.load.image('cb', '../resources/cb.png');
		this.load.image('co', '../resources/co.png');
		this.load.image('sb', '../resources/sb.png');
		this.load.image('so', '../resources/so.png');
		this.load.image('tb', '../resources/tb.png');
		this.load.image('to', '../resources/to.png');
	}

	
    create (){	
		
	
		let arraycards = ['co','co','cb','cb','sb','sb','so','so','tb','tb','to','to'];
		var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"hard"}';
		var options_data = JSON.parse(json);
		var cartas = options_data.cards*2;
		var dif = options_data.dificulty;
		let cartasvector = arraycards.slice(0,cartas);
		this.cameras.main.setBackgroundColor(0xF5470F);
		
		var tiempo_restante = null;
		var punt_perdida = null;

		if(dif == "hard"){
			tiempo_restante = 1000;
			punt_perdida = 20;

		}
		else if(dif == "normal"){
			tiempo_restante = 1500;
			punt_perdida = 15;

		}
		else{
			tiempo_restante = 2000;
			punt_perdida = 10;

		}

		this.cards = this.physics.add.staticGroup();
		
	
		cartasvector.sort((a, b) => 0.5 - Math.random());
    	
    
		
		for(var k = 0; k < cartas; k++){
			this.add.image(125*k+50,300,cartasvector[k]);
			this.cards.create(125*k+50,300,'back');
		}

		
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = cartasvector[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				
				if (this.firstClick){
					
					if (this.firstClick.card_id !== card.card_id){
						
						
						this.score -= punt_perdida;
						this.firstClick.enableBody(false, 0, 0, true, true);
						
						card.enableBody(false, 0, 0, true, true);
						//Cartas error
						var fallo = [];
						var cont = 0;
						for(let j = 0; j < cartas*2; j++){
							let cartas_error = this.add.image(125*j+50,300,cartasvector[cont]);
						
							fallo.push(cartas_error);
							cont++;
							
							
						}
						setTimeout(() =>{
							for (let i = 0; i < cartas*2; i++){
								fallo[i].destroy();
							}
						},tiempo_restante);
				
						
						
						
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						var contador_partidas = 0;
						var arrayjugadores = [];
						if (this.correct >= options_data.cards){
							alert("You Win with " + this.score + " points.");
							contador_partidas++;
							this.data.set('score', this.score);
							
							
							var text = this.add.text(100, 100, '', { font: '64px Courier', fill: '#020202' });
							text.setText([
								'Score: ' + this.data.get('score')
							]);
							arrayjugadores = this.score;
							localStorage.setItem('puntuacion', JSON.stringify(arrayjugadores));
							var array = localStorage.getItem('myArray');
							// Se parsea para poder ser usado en js con JSON.parse :)
							array = JSON.parse(arrayjugadores);
							
							//loadpage("../");
							

							
						}
					}
					this.firstClick = null;
				}
				else{
					this.firstClick = card;
				}
			}, card);
		});
		 
	}
	
	update (){


		}
}

