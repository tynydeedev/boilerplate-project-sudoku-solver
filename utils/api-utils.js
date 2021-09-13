module.exports = function(coor) {
  const coordinate = coor.split('');

  switch(coordinate[0]) {
    case 'A':
      coordinate[0] = 0;
      break;
    case 'B':
      coordinate[0] = 1;
      break;
    case 'C':
      coordinate[0] = 2;
      break;
    case 'D':
      coordinate[0] = 3;
      break;
    case 'E':
      coordinate[0] = 4;
      break;
    case 'F':
      coordinate[0] = 5;
      break;
    case 'G':
      coordinate[0] = 6;
      break;
    case 'H':
      coordinate[0] = 7;
      break;
    case 'I':
      coordinate[0] = 8;
      break;
  }

  coordinate[1] = Number(coordinate[1]) - 1;
  return { x: coordinate[1], y: coordinate[0]};
}