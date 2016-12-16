/*
 * Get value in first input box
 */
function getVal1(par) {
    return $(par).find("[name='val1']").val();
};
/*
 * Get value in second input box
 */
function getVal2(par) {
    return $(par).find("[name='val2']").val();
};
/*
 * Returns class of the current active unit
 */
function getUnitClass(par, whichUnit) {
    var activeUnit = $(par).find('#unit' + whichUnit + ' .active-unit');
    if ($(activeUnit).hasClass('dec') == true) return "dec";
    if ($(activeUnit).hasClass('bin') == true) return "bin";
    if ($(activeUnit).hasClass('hex') == true) return "hex";
    else return "baseN";
};
/*
 * Update which unit is active upon click; add/remove active-unit class
 */
function switchUnits(newUnit, whichUnit) {
    if (whichUnit == 1) var unit = "#unit1";
    else var unit = "#unit2";
    // Get active unit within parent li
    var oldActive = $(newUnit).closest('li').find(unit).find('.active-unit');
    $(oldActive).removeClass('active-unit');
    // Update active unit
    $(newUnit).addClass('active-unit');
    // Get new active unit
    var newActive = $(newUnit).closest('li').find(unit).find('.active-unit');
    // Highlight n if base n was clicked
    if ($(newActive).hasClass('baseN') == true) $(newActive).find("[name='n" + whichUnit + "']").select();
};
/*
 * Reverse the selected units
 */
function reverseUnits(par) {
    // Get unit 1 and unit 2 values
    var unit1 = getUnitClass(par, 1);
    var unit2 = getUnitClass(par, 2);
    // Switch
    $(par).find('#unit1 .active-unit').removeClass('active-unit');
    $(par).find('#unit1 .' + unit2).addClass('active-unit');
    $(par).find('#unit2 .active-unit').removeClass('active-unit');
    $(par).find('#unit2 .' + unit1).addClass('active-unit');
    // Switch n1 and n2
    var n1 = $(par).find("[name='n1']").val();
    $(par).find("[name='n1']").val($(par).find("[name='n2']").val());
    $(par).find("[name='n2']").val(n1);
    // Switch inputs
    var val1 = $(par).find("[name='val1']").val();
    $(par).find("[name='val1']").val($(par).find("[name='val2']").val());
    $(par).find("[name='val2']").val(val1);
    // Switch messages
    var m1 = $(par).find('.message1').text();
    $(par).find('.message1').text($(par).find('.message2').text());
    $(par).find('.message2').text(m1);
    return;
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
    if (dec === 0 && base != 1) return 0;
    if (base != 1) {
        while (dec) {
            var remainder = dec % base;
            if (remainder > 9) remainder = getHexRemainder(remainder);
            dec = Math.floor(dec / base);
            num.unshift(remainder);
        }
        if (base == 16) num.unshift("0x");
    }
    else {
        if (dec == 0) {
            return "NaN";
        }
        while (dec) {
            num.unshift("1");
            dec--;
            if (num.length > 64) return "result too large";
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
function getUnit(par, whichUnit) {
    if (whichUnit == 1) var unit = '#unit1';
    else var unit = '#unit2';
    var activeUnit = $(par).find(unit + ' .active-unit');
    if ($(activeUnit).hasClass('dec') == true) return 10;
    if ($(activeUnit).hasClass('bin') == true) return 2;
    if ($(activeUnit).hasClass('hex') == true) return 16;
    if ($(activeUnit).hasClass('baseN') == true) return $(par).find("[name='n" + whichUnit + "']").val();
}
/*
 * Convert the inputed num
 */
function convert(par, num) {
    var fromBase = getUnit(par, 1);
    var toBase = getUnit(par, 2);
    if (fromBase == 10) return decToBaseN(num, toBase);
    else if (toBase == 10) return baseNtoDec(num, fromBase);
    else {
        var dec = baseNtoDec(num, fromBase);
        return decToBaseN(dec, toBase);
    }
}
/*
 * Check that input for n1/n2 is valid
 */
function checkN(par, whichN) {
    var n = $(par).find("[name='n" + whichN + "']").val();
    // Return if valid input or still n
    if ((n == parseInt(n, 10) && n && n < 37 && n > 0) || n == "n") {
        $(par).find('.message' + whichN).text("");
        return true;
    }
    // Reset to n and show error message otherwise
    //  $("[name='n"+ whichN +"']").val("n");
    $(par).find('.message' + whichN).text("Invalid value for n! n must be an integer between 0 and 37.");
    return false;
};
/*
 * Check that input is valid for its corresponding base
 */
function checkInput(par) {
    var base = getUnit(par, 1);
    var input = $(par).find("[name='val1']").val();
    // Remove spaces
    input = input.replace(/\s/g, '');
    // Return and clear output if no input
    if (input.length == 0) {
        $(par).find("[name='val2']").val("");
        return false;
    }
    // Check unary
    if (base == 1) {
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) != 49) {
                $(par).find('.message1').text("Invalid input: a unary number can only contain the digit 1.");
                $(par).find("[name='val2']").val("");
                return false;
            }
        }
    }
    // Check binary
    else if (base == 2) {
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) != 48 && input.charCodeAt(i) != 49) {
                $(par).find('.message1').text("Invalid input: a binary number can only contain digits 0 and 1.");
                $(par).find("[name='val2']").val("");
                return false;
            }
        }
    }
    // Check decimal
    else if (base == 10) {
        for (var i = 0; i < input.length; i++) {
            if (input.charCodeAt(i) < 48 || input.charCodeAt(i) > 57) {
                $(par).find('.message1').text("Invalid input: a decimal number can only contain digits 0-9.");
                $(par).find("[name='val2']").val("");
                return false;
            }
        }
    }
    // Check hexadecimal
    else if (base == 16) {
        // Check for 0x
        if (input.charAt(0) == '0' && input.charAt(1) == 'x') var start = 2;
        else var start = 0;
        // Check that all chars are 0-9, A-F, a-f
        for (var i = start; i < input.length; i++) {
            var c = input.charCodeAt(i);
            if ((c < 48 || c > 57) && (c < 65 || c > 70) && (c < 97 || c > 102)) {
                $(par).find('.message1').text("Invalid input: a hexadecimal number can only contain digits 0-9 and characters A-F.");
                $(par).find("[name='val2']").val("");
                return false;
            }
        }
    }
    // Check base when n < 10
    else if (base < 10) {
        var limit = parseInt(base) + 47;
        for (var i = 0; i < input.length; i++) {
            c = input.charCodeAt(i);
            if (c < 48 || c > limit) {
                $(par).find('.message1').text("Invalid input: a number in base " + base + " can only contain digits 0-" + (base - 1) + ".");
                $(par).find("[name='val2']").val("");
                return false;
            }
        }
    }
    // Check base when n > 10
    else if (base > 10) {
        var uppercaseLim = parseInt(base) + 54;
        var lowercaseLim = parseInt(base) + 86;
        for (var i = 0; i < input.length; i++) {
            c = input.charCodeAt(i);
            // Check 0-9, A-uppercaseLim, a-lowercaseLim
            if ((c < 48 || c > 57) && (c < 65 || c > uppercaseLim) && (c < 97 || c > lowercaseLim)) {
                // Message for base 11
                if (base == 11) $(par).find('.message1').text("Invalid input: a number in base " + base + " can only contain digits 0-9 and character A.");
                else $(par).find('.message1').text("Invalid input: a number in base " + base + " can only contain digits 0-9 and characters A-" + String.fromCharCode(uppercaseLim) + ".");
                $(par).find("[name='val2']").val("");
                return false;
            }
        }
    }
    return true;
}
/*
 * Check if N is valid before converting
 */
function checkConvertN(par, whichN) {
    // Return if n is still n
    if ($(par).find('#unit' + whichN + ' .baseN').hasClass('active-unit') && checkN(par, whichN)) {
        if ($(par).find("[name='n" + whichN + "']").val() === 'n') {
            $(par).find('.message' + whichN).text("Must enter a value for n!");
            // Clear output box
            $(par).find("[name='val2']").val('');
            return false;
        }
    }
    // Return if n is invalid
    else if ($(par).find('#unit' + whichN + ' .baseN').hasClass('active-unit') && !checkN(par, whichN)) {
        // Clear output box
        $(par).find("[name='val2']").val('');
        return false;
    }
    return true;
};
/*
 * Clear settings on a converter
 */
function clearSettings(par) {
    // Clear active units
    $(par).find('.active-unit').removeClass('active-unit');
    // Set unit1 to dec
    $(par).find('#unit1 .dec').addClass('active-unit');
    // Set unit2 to bin
    $(par).find('#unit2 .bin').addClass('active-unit');
    // Clear values
    $(par).find("[name='val1']").val("");
    $(par).find("[name='val2']").val("");
    // Clear messages
    $(par).find('.message1').text("");
    $(par).find('.message2').text("");
    // Reset n
    $(par).find("[name='n1']").val("n");
    $(par).find("[name='n2']").val("n");
    return;
};
/*
 * MAIN FUNCTION
 */
var main = function () {
    // Update active-unit upon click
    $('#unit1 span').click(function () {
        switchUnits(this, 1);
    });
    $('#unit2 span').click(function () {
        switchUnits(this, 2);
    });
    // CONVERT BUTTON
    $('.convert').click(function () {
        // Get parent li
        var par = $(this).closest('li');
        // CHECK N 
        if ($(par).find('#unit1 .baseN').hasClass('active-unit') || $(par).find('#unit2 .baseN').hasClass('active-unit')) {
            var validBase1 = checkConvertN(par, 1);
            var validBase2 = checkConvertN(par, 2);
            if (!validBase1 || !validBase2) return;
        }
        // Check input then convert
        if (checkInput(par)) {
            var input = getVal1(par);
            // Remove spaces
            input = input.replace(/\s/g, '');
            var num = convert(par, input);
            $(par).find("[name='val2']").val(num);
        }
    });
    // REVERSE BUTTON
    $('.reverse').click(function () {
        var par = $(this).closest('li');
        reverseUnits(par);
    });
    // CLEAR BUTTON
    $('.clear').click(function () {
        var par = $(this).closest('li');
        $(par).find("[name='val1']").val('');
        $(par).find("[name='val2']").val('');
    });
    // CHECK INPUT FOR N
    $("[name='n1']").on('blur', function () {
        var par = $(this).closest('li');
        checkN(par, 1);
    });
    $("[name='n2']").on('blur', function () {
        var par = $(this).closest('li');
        checkN(par, 2);
    });
    // CLEAR MESSAGES ON NEW UNIT CLICK
    $('#unit1 span').click(function () {
        var par = $(this).closest('li');
        $(par).find('.message1').text("");
    });
    $('#unit2 span').click(function () {
        var par = $(this).closest('li');
        $(par).find('.message2').text("");
    });
    // ADD BUTTON
    $('.add').click(function () {
        // Append
        var newLi = $('#converters').find('li:first').clone(true).insertAfter($(this).closest('li'));
        $(newLi).hide();
        // Clear new li settings
        clearSettings(newLi);
        // Get and inc height
        var height = $('#container').css('height');
        var newHeight = parseInt(height) + 293;
        $('#container').css('height', newHeight + "px");
        // Scroll/animate
        var y = $(window).scrollTop();
        $("html, body").animate({
            scrollTop: y + 293
        }, 400, function () {
            $(newLi).slideDown('slow');
        });
        if ($('#converters li').length == 2) {
            // Display close button
            $('.close').css("display", "inline");
        }
    });
    // CLOSE BUTTON
    $('.close').click(function () {
        $(this).closest('li').slideUp('slow', function () {
            $(this).remove();
        });
        // Scroll up before dec height
        var y = $(window).scrollTop();
        $("html, body").animate({
            scrollTop: y - 293
        }, 400, function () {
            // Hide close button if one left
            if ($('#converters li').length == 2) $('.close').css("display", "none");
            // Clear height of container
            $('#container').css('height', "");
        });
    });
};
$(document).ready(main);