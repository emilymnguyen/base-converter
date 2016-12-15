/*
 * Get value in first input box
 */
function getVal1() {
  return $("[name='val1']").val();
};

/*
 * Get value in second input box
 */
function getVal2() {
  return $("[name='val2']").val();
};

/*
 * Returns class of the current active unit
 */
function getUnitClass(whichUnit) {
    if (whichUnit == 1)
        var unit = "#unit1";
    else
        var unit = "#unit2";
    
    if ($(unit +' .active-unit').hasClass('dec') == true)
        return "dec";
    if ($(unit +' .active-unit').hasClass('bin') == true)
        return "bin";
    if ($(unit +' .active-unit').hasClass('hex') == true)
        return "hex";
    else
        return "baseN";
};

/*
 * Update which unit is active upon click; add/remove active-unit class
 */
function switchUnits(newUnit, whichUnit) {
    if (whichUnit == 1)
        var unit = "#unit1";
    else
        var unit = "#unit2";

    // Update active unit
  $(unit +' .active-unit').removeClass('active-unit');
  $(newUnit).addClass('active-unit');
    
    // Highlight n if base n was clicked
    if ($(unit +' .active-unit').hasClass('baseN') == true)
        $("[name='n"+ whichUnit +"']").select();
};

/*
 * Reverse the selected units
 */
function reverseUnits() {
  // Get unit 1 and unit 2 values
  var unit1 = getUnitClass(1);
    var unit2 = getUnitClass(2);
    
    // Switch
    $('#unit1 .active-unit').removeClass('active-unit');
  $('#unit1 .' + unit2).addClass('active-unit');
    
     $('#unit2 .active-unit').removeClass('active-unit');
  $('#unit2 .' + unit1).addClass('active-unit');
    
    // Switch n1 and n2
    var n1 = $("[name='n1']").val();
    $("[name='n1']").val($("[name='n2']").val());
    $("[name='n2']").val(n1);
    
    // Switch inputs
    var val1 = $("[name='val1']").val();
    $("[name='val1']").val($("[name='val2']").val());
    $("[name='val2']").val(val1);
    
};

/*
 * Get remainder when base is > 10
 */
function getHexRemainder(remainder) {
    var charCode = 55 + remainder;
    return String.fromCharCode(charCode);
};

/*
 * Converts a decimal to a given base
 */
function decToBaseN(dec, base) {
    var num = [];
    
    if (dec === 0 && base != 1)
        return 0;
    
    if (base != 1) {
    while (dec) { 
        var remainder = dec % base;
        if (remainder > 9)
            remainder = getHexRemainder(remainder);
        dec = Math.floor(dec / base);
        num.unshift(remainder);
    }
    if (base == 16)
        num.unshift("0x");
   
    }
    else {
        if (dec == 0) {
            return "NaN";
        }
        while (dec) {
            num.unshift("1");
            dec--;
            if (num.length > 64)
                return "result too large";
        }
    }
     return num.join("");
};

/*
 * Converts a number in a given base to decimal
 */
function baseNtoDec(num, base) {
    if (base != 1) {
        return parseInt(num, base); 
    }
    return num.length;
};

/*
 * Get the corresponding base of the unit that was clicked on
 */
function getUnit(whichUnit) {
    if (whichUnit == 1)
        var unit = '#unit1';
    else
        var unit = '#unit2';
    
    if ($(unit +' .active-unit').hasClass('dec') == true)
        return 10;
    if ($(unit +' .active-unit').hasClass('bin') == true)
        return 2;
    if ($(unit +' .active-unit').hasClass('hex') == true)
        return 16;
    if ($(unit +' .active-unit').hasClass('baseN') == true)
        return $("[name='n" + whichUnit + "']").val();
}

/*
 * Convert the inputed num
 */
function convert(num) {
    var fromBase = getUnit(1);
    var toBase = getUnit(2);
    
    if (fromBase == 10)
        return decToBaseN(num, toBase);
    else if (toBase == 10)
        return baseNtoDec(num, fromBase);
    else {
        var dec = baseNtoDec(num, fromBase);
        return decToBaseN(dec, toBase);
    }   
}

/*
 * Check that input for n1/n2 is valid
 */
function checkN(whichN) {
    var n = $("[name='n"+ whichN +"']").val();
    
    // Return if valid input or still n
    if ((n == parseInt(n, 10) && n && n < 37 && n > 0) || n == "n") {
        $('.message' + whichN).text("");
        return true;
    }
    
    // Reset to n and show error message otherwise
   //  $("[name='n"+ whichN +"']").val("n");
     $('.message' + whichN).text("Invalid value for n! n must be an integer between 0 and 37.");
    return false;
};

function checkInput() {
    var base = getUnit(1);
    var input = $("[name='val1']").val();
    
    // Remove spaces
    input = input.replace(/\s/g, '');
    
    // Return and clear output if no input
    if (input.length == 0) {
        $("[name='val2']").val("");
        return false;
    }
    
    // Check unary
    if (base == 1) {
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) != 49) {
                $('.message1').text("Invalid input: a unary number may only contain the digit 1.");
                $("[name='val2']").val("");
                return false;
            }
        }
    }
    // Check binary
    else if (base == 2) {
        for (var i = 0; i < input.length; i++) {
            
            if (input.charCodeAt(i) != 48 && input.charCodeAt(i) != 49) {
                $('.message1').text("Invalid input: a binary number may only contain digits 0 and 1.");
                $("[name='val2']").val("");
                return false;
            }
        }
    }
// Check decimal
       else if (base == 10) {
         
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) < 48 || input.charCodeAt(i) > 57) {
                $('.message1').text("Invalid input: a decimal number may only contain digits 0-9.");
                $("[name='val2']").val("");
                return false;
            }
        }
    }
    
    // Check hexadecimal
       else if (base == 16) {
           // Check for 0x
           if (input.charAt(0) == '0' && input.charAt(1) == 'x')
               var start = 2;
           else
               var start = 0;
        // Check that all chars are 0-9, A-F, a-f
        for (var i = start; i < input.length; i++) {
            var c = input.charCodeAt(i);
            if ((c < 48 || c > 57) && (c < 65 || c > 70) && (c < 97 || c > 102)){
                $('.message1').text("Invalid input: a hexadecimal number may only contain digits 0-9 and characters A-F.");
                $("[name='val2']").val("");
                return false;
            }
        }
    }
    
    return true;
}

/*
 * Check if N is valid before converting
 */
function checkConvertN(whichN) {
     // Return if n is still n
       if ($('#unit'+ whichN +' .baseN').hasClass('active-unit') && checkN(whichN)) {
            if ($("[name='n"+ whichN +"']").val() === 'n') {
                $('.message'+whichN).text("Must enter a value for n!");
                // Clear output box
                $("[name='val2']").val('');
                return false;
            }
        }
        // Return if n is invalid
        else if ($('#unit'+ whichN +' .baseN').hasClass('active-unit') && !checkN(whichN)) {
            // Clear output box
            $("[name='val2']").val('');
                return false;
        }
    return true;
}

/*
 * MAIN FUNCTION
 */
var main = function() {
  
    // Update active-unit upon click
    $('#unit1 span').click(function () {
        switchUnits(this, 1);
    });
       $('#unit2 span').click(function () {
        switchUnits(this, 2);
    });
    
    // CONVERT BUTTON
    $('.convert').click(function () {
        
        // CHECK N 
        if ($('#unit1 .baseN').hasClass('active-unit') || $('#unit2 .baseN').hasClass('active-unit')) {
        
            var validBase1 = checkConvertN(1);
            var validBase2 = checkConvertN(2);
        
            if (!validBase1 || !validBase2)
                return;
        }
       // Check input then convert
            if (checkInput()) {
                var input = getVal1();
                // Remove spaces
                input = input.replace(/\s/g, '');
                
                var num = convert(input);
                $("[name='val2']").val(num);
            }  
    });
    
    // REVERSE BUTTON
    $('.reverse').click(function() {
        reverseUnits();
    });
    
    // CLEAR BUTTON
    $('.clear').click(function () {
        $("[name='val1']").val('');
        $("[name='val2']").val('');
       
    });
    
    // CHECK INPUT FOR N
    $("[name='n1']").on('blur',function () {
       checkN(1);
    });
    $("[name='n2']").on('blur',function () {
       checkN(2);
    });
   
    // CLEAR MESSAGES ON NEW UNIT CLICK
      $('#unit1 span').click(function () {
       $('.message' + 1).text("");
    });
       $('#unit2 span').click(function () {
        $('.message' + 2).text("");
    });
   
};

$(document).ready(main);
