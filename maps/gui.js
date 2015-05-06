function GUI (node, map) {
  form = node;
  map = map;
  inputGroup = form.getElementsByTagName('div')[0];
  inputOrigin = form.getElementsByTagName('input')[0];
  inputDestination = form.getElementsByTagName('input')[1];
  inputCount = 0;
  inputs = [];
  
  this.addInput = function () {
    inputCount++;

    input = document.createElement('input');
    input.type = 'text';
    input.id = 'direction' + inputCount;

    inputGroup.appendChild(input);
    inputs.push(input);
  }

  this.submit = function () {
    if(!validate()) {
      return;
    }

    map.setOrigin(getOrigin());
    map.setDestination(getDestination());

    for (i = 0; i < inputCount; i++) {
      map.addWaypoint(inputs[i].value, true);
    }

    map.getRoute();
  }

  getOrigin = function () {
    return inputOrigin.value;
  }

  getDestination = function () {
    return inputDestination.value;
  }

  validate = function () {
    return getDestination() && getOrigin();
  }
}