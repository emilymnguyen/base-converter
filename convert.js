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
    
    if (dec == 0)
        return 0;
    
    while (dec) { 
        var remainder = dec % base;
        if (remainder > 9)
            remainder = getHexRemainder(remainder);
        dec = Math.floor(dec / base);
        num.unshift(remainder);
    }
    if (base == 16)
        num.unshift("0x");
    return num.join("");
};

/*
 * Converts a number in a given base to decimal
 */
function baseNtoDec(num, base) {
    return parseInt(num, base);  
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
        var num = convert(getVal1());
        $("[name='val2']").val(num);
    });
    
    // CLEAR BUTTON
    $('.clear').click(function () {
        $("[name='val1']").val('');
        $("[name='val2']").val('');
       
    });
};

$(document).ready(main);
