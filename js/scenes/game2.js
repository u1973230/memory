class GameScene2 extends Phaser.Scene {

    constructor (){
        super('GameScene2');
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
		let cartasvector = arraycards.slice(0,cartas);
		this.cameras.main.setBackgroundColor(0xBFFCFF);
		
		this.cards = this.physics.add.staticGroup();
		
	
		cartasvector.sort((a, b) => 0.5 - Math.random());
    	
    
		
		for(var k = 0; k < cartas; k++){

			this.add.image(125*k+50,300,cartasvector[k]);
			this.cards.create(125*k+50,300,'back');
			
			
		}
		
		
	
		
		
		//this.add.image(250, 300, arraycards[0]);
		//this.add.image(350, 300, arraycards[1]);
		//this.add.image(450, 300, arraycards[2]);
		//this.add.image(550, 300, arraycards[3]);
		


		
		
		
		//this.cards.create(250, 300, 'back');
		//this.cards.create(350, 300, 'back');
		//this.cards.create(450, 300, 'back');
		//this.cards.create(550, 300, 'back');
	
		let i = 0;
		this.cards.children.iterate((card)=>{
			card.card_id = cartasvector[i];
			i++;
			card.setInteractive();
			card.on('pointerup', () => {
				card.disableBody(true,true);
				if (this.firstClick){
				
					if (this.firstClick.card_id !== card.card_id){
						this.score -= 20;
						this.firstClick.enableBody(false, 0, 0, true, true);
						
						card.enableBody(false, 0, 0, true, true);
						
						this.cards.children.each(function(card) {                                
							card.disableBody(true,true);                         
						}, this);
						
						
						this.cards.children.each(function(card) {
                                
                                card.enableBody(false, 0,0, true, true);
                                
                        }, this);
						
						
						
						
						if (this.score <= 0){
							alert("Game Over");
							loadpage("../");
						}
					}
					else{
						this.correct++;
						if (this.correct >= 2){
							alert("You Win with " + this.score + " points.");
							loadpage("../");
                            

                            
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