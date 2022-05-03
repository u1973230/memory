var arrayjugadores = [this.score];
localStorage.setItem('puntuacion', JSON.stringify(arrayjugadores));
var array = localStorage.getItem('myArray');
// Se parsea para poder ser usado en js con JSON.parse :)
array = JSON.parse(arrayjugadores)

var bubbleSort = function(array){
  var sorted = false;
  var temp;
  while(!sorted) {
      sorted = true;
      for (var i = 0; i < this.contador_partidas; i++) {
          if (array[i] > array[i+1]) {
              temp = array[i];
              array[i] = array[i+1];
              array[i+1] = temp;
              sorted = false;
          }
      }
  }
}

print (array)

