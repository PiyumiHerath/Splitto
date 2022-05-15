app.filter('spacedComas', function() {

  return function( input ) {

    var output = '';

    var elements = input.split(',');

    for ( var n = 0; n < elements.length; n++ )
    {
      output += elements[n];
      if ( n === elements.length - 2 ) {
        output += ' & ';
      } else 
      if ( n !== elements.length - 1 ) {
        output += ', ';
      }
     }
    return output;

  }
});
