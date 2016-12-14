
function getVal1() {
  return $("[name='val1']").val();
};

function getVal2() {
  return $("[name='val2']").val();
};

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

function getHexRemainder(remainder) {
    var charCode = 55 + remainder;
    return String.fromCharCode(charCode);
};

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

function baseNtoDec(num, base) {
    return parseInt(num, base);  
};

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

var main = function() {
  
    $('#unit1 span').click(function () {
        switchUnits(this, 1);
    });
       $('#unit2 span').click(function () {
        switchUnits(this, 2);
    });
    
    $('.convert').click(function () {
        var num = convert(getVal1());
        $("[name='val2']").val(num);
    });
    
 
    
    $('.clear').click(function () {
        $("[name='val1']").val('');
        $("[name='val2']").val('');
       
    });
};

$(document).ready(main);
