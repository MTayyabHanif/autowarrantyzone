$("#quoteForm").submit(function(event) {
    event.preventDefault();
    sendFormMessage();
});

function sendFormMessage() {
    var valid;
    valid = validateQuoteForm();
    $('.form-errors').empty();
    $('.form-errors').hide();
    if (valid === true) {
        $('.quote-form button').addClass('disabled');
        var yearValue = $(".quote-form--year").val();
        var makeValue = $(".quote-form--make").val();
        var modelValue = $(".quote-form--model").val();
        var milageValue = $(".quote-form--milage").val();
        var firstNameValue = $(".quote-form--firstName").val();
        var lastNameValue = $(".quote-form--model").val();
        var emailValue = $(".quote-form--email").val();
        var phoneValue = $(".quote-form--phone").val();
        var zipValue = $(".quote-form--zip").val();
        var errors = "";
        var ajaxUrl = "https://lafires.com/d.ashx?ckm_campaign_id=14&ckm_key=GyDWoqNdMlM&ckm_test=1&"+$('#quoteForm').serialize()+"";
        console.log(ajaxUrl);
        jQuery.ajax({
            url: ajaxUrl,
            type: "GET",
            dataType: 'jsonp',
            success: function(data) {
                // $('.form-success').show();
                // $(".form-success").html(data);
                console.log(data);
                if(data.success == true){
                    location.href = "https://autowarrantyzone.com"
                    return true;
                }
                if(data.errors){
                    for(var i = 0; i < data.errors.length; i++){
                        errors += "<span>"+data.errors[i]+"</span><br>"
                    }
                    $('.form-errors').append(errors);
                    $('.form-errors').show();
                    $('.quote-form button').removeClass('disabled');
                    return true;
                }
                $('.form-errors').append('Something went wrong');
                $('.form-errors').show();
                $('.quote-form button').removeClass('disabled');
            },
            error: function(err) {
                console.log(err);
            }
        });
    } else {
        // $('.form-error').show();
        $('.form-error').html(valid);
    }
}

function validateQuoteForm() {
    var valid = "";
    $('input,textarea,.form-item').removeClass('error');
    $('.form-item .desc').hide();

    if (!$(".quote-form--year").val()) {
        $('.form-item-year .desc').show();
        $('.form-item-year').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--make").val()) {
        $('.form-item-make .desc').show();
        $('.form-item-make').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--model").val()) {
        $('.form-item-model .desc').show();
        $('.form-item-model').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--milage").val()) {
        $('.form-item-milage .desc').show();
        $('.quote-form--milage').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--firstName").val()) {
        $('.form-item-firstName .desc').show();
        $('.quote-form--firstName').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--lastName").val()) {
        $('.form-item-lastName .desc').show();
        $('.quote-form--lastName').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--email").val()) {
        $('.form-item-email .desc').show();
        $('.quote-form--email').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--email").val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
        $('.form-item-email .desc').text('Email is not valid');
        $('.form-item-email .desc').show();
        $('.quote-form--email').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--phone").val()) {
        $('.form-item-phone .desc').show();
        $('.quote-form--phone').addClass('error');
        valid = false;
    }
    if (!$(".quote-form--zip").val()) {
        $('.form-item-zip .desc').show();
        $('.quote-form--zip').addClass('error');
        valid = false;
    }

    if(valid === ""){
        valid = true;
    }
    

    return valid;
}

function selectLoading(element, show=true){
    if(show){
        $(element).addClass('loader');
    } else {
        $(element).removeClass('loader');
    }
}

$(document).ready(function(){
    $(".chosen-select").chosen();
    
    selectLoading('.form-item-year .chosen-container.chosen-container-single');
});

var apiUrl = "https://www.carqueryapi.com/api/0.3/";
var selectYear = $('.form-item-year .quote-form--year');
var selectMake = $('.form-item-make .quote-form--make');
var selectModel = $('.form-item-model .quote-form--model');

$.getJSON(apiUrl+"?callback=?", {cmd:"getYears", sold_in_us:1}, function(data) {

    var minYear = data.Years.min_year;
    var maxYear = data.Years.max_year;
    var options = "";
    options += "<option value=''>Select Year</option>";
    for ($i = maxYear; $i >= minYear; $i--){
        options += "<option value="+$i+">"+$i+"</option>";
    }

    selectYear.append(options);
    selectLoading('.form-item-year .chosen-container.chosen-container-single', false);
    selectYear.trigger("chosen:updated");

});

$('body').on('change', '.form-item-year .quote-form--year', function(){
    selectLoading('.form-item-make .chosen-container.chosen-container-single');
    if ($(".quote-form--model").val()) {
        selectLoading('.form-item-model .chosen-container.chosen-container-single');
    }
    var selectYearValue = selectYear.val();
    selectMake.find('option').remove();
    selectModel.find('option').remove();
    
    $.getJSON(apiUrl+"?callback=?", {cmd:"getMakes", year: selectYearValue, sold_in_us:1}, function(data) {

        var makes = data.Makes;

        var options = "";
        options += "<option value=''>Select Make</option>";
        for (var i = 0; i < makes.length; i++){
            options += "<option value="+makes[i].make_id+">"+makes[i].make_display+"</option>";
        }

        selectMake.append(options);
        selectMake.removeAttr('disabled');
        selectMake.parents('.form-item-make').removeClass('non-selectable');
        selectLoading('.form-item-make .chosen-container.chosen-container-single', false);
        selectLoading('.form-item-model .chosen-container.chosen-container-single', false);
        selectModel.attr('disabled', 'disabled');
        selectModel.parents('.form-item-model').addClass('non-selectable');
        selectModel.trigger("chosen:updated");
        selectMake.trigger("chosen:updated");
    
    });

});

$('body').on('change', '.form-item-make .quote-form--make', function(){
    selectLoading('.form-item-model .chosen-container.chosen-container-single');
    var selectYearValue = selectYear.val();
    var selectMakeValue = selectMake.val();
    selectModel.find('option').remove();
    
    $.getJSON(apiUrl+"?callback=?", {cmd:"getModels", make: selectMakeValue, year: selectYearValue, sold_in_us:1}, function(data) {

        var models = data.Models;

        var options = "";
        options += "<option value=''>Select Model</option>";
        for (var i = 0; i < models.length; i++){
            options += "<option value="+models[i].model_make_id+">"+models[i].model_name+"</option>";
        }

        selectModel.append(options);
        selectModel.removeAttr('disabled');
        selectModel.parents('.form-item-model').removeClass('non-selectable');
        selectLoading('.form-item-model .chosen-container.chosen-container-single', false);
        selectModel.trigger("chosen:updated");
    
    });

});

$('input[type=number]').on('keypress', function(e){
    var x=e.which||e.keycode;
    if((x>=48 && x<=57) || x==8 ||
        (x>=35 && x<=40)|| x==46)
        return true;
    else
        return false;
});

$('#quoteForm input').on('keypress', function(e){
    var maxLength = parseInt($(this).attr('maxlength'));
    var curentValLength = $(this).val().length;
    curentValLength = curentValLength+1;
    
    
    if($(this).val().length >= maxLength){
        return false;
    } else {
        return true;
    }
});