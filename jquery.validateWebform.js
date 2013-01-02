/*
 * ValidateWebform v1.0 - jQuery plugin for validating and submitting a Webform via Ajax
 *
 * Copyright (c) 2013 Giovanni Buffa
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 */

(function($) {
	var setup = {
	  loading:function(settings){
  	  return $('body').append('<div class="'+settings.loading+'"></div>');
	  },
	  unloading:function(settings){
  	  return $('.'+settings.loading).remove();
	  },
	  form:function(target, settings){
  	  $('#'+target.id).each(function(){
    	  var $action, $entry, $drupal, $content_lead, $boundry, $entered;
    	  $action = $(this).attr('action');
    	  $entry = $(this).find('input.form-text, input.form-checkbox, select.form-select, textarea');
    	  $drupal = $(this).find('input:hidden');
    	  $content_lead = '\nContent-Disposition: form-data;';
    	  $boundry = '-----------------------------1626259126772';
    	  $entered = '';
    	  
    	  $(settings.submit, this).click(function(){
    	    var message = "";
    	    //required input
    	    $('input.required', '#'+target.id).each(function(){
      	    var $element, count, id, name, value, type;
      	    $element = $(this);
      	    count = $element.size();
      	    id = $element.attr('id');
      	    name = $('label[for='+id+']').text();
      	    value = $element.val();
      	    type = $element[0].type.toLowerCase();
      	    //validate email field
      	    if($element.hasClass('email') && validate.email(value) == false){
        	    message += Drupal.t("You must insert a vadil email address\n");
      	    }
      	    //validate text field
      	    message += validate.text(name, value);
    	    });
    	    //required select list
    	    $('select.required', '#'+target.id).each(function(){
      	    var $element, id, name, value;
      	    $element = $(this);
      	    id = $element.attr('id');
      	    name = $('label[for='+id+']').text();
      	    value = $element.val();
      	    
      	    console.log(id);
    	    })
    	    //required privacy, if defined
    	    $(settings.privacy, '#'+target.id).each(function(){
      	    var selected = $(this+':checked').length;
      	    message += validate.privacy(selected);
    	    })
    	    //test that the required field is inserted
    	    if(message == ""){
      	    setup.loading(settings);
      	    $entry.each(function(){
        	    var $name, $value;
        	    $name = $(this).attr('name');
        	    $value = $(this).val();
        	    $entered += $boundry + $content_lead + ' name="' + $name + '"\n\n' + $value+'\n';
      	    })
      	    $drupal.each(function(){
        	    var $name, $value;
        	    $name = $(this).attr('name');
        	    $value = $(this).val();
        	    $entered += $boundry + $content_lead + ' name="' + $name + '"\n\n' + $value+'\n';
      	    })
      	    $entered += $boundry + '\nContent-Disposition: form-data; name="op"\n\nSubmit\n'+$boundry +'--\n\n';
      	    $.ajaxSetup({contentType: 'multipart/form-data; boundary=---------------------------1626259126772', cache: false});
      	    $.post($action, $entered, function(data){
        	    var $temp = data;
        	    setup.unloading(settings);
        	    $(settings.thanks.container).fadeOut('fast', function(){
          	    $(this).parent().append($(settings.thanks.page, data));
          	    $(settings.thanks.page).fadeIn('fast');
        	    })
      	    });
    	    }else{
      	    alert(message);
    	    }
      	  return false;
    	  })
  	  })
	  }
	},
	validate = {
  	email:function(mail){
    	var pattern = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    	return pattern.test(mail);
  	},
  	text:function(name, value){
    	if(value == ""){
    	  return Drupal.t("The field "+name.replace(" *","")+" is mandatory.\n");
      }else{
        return "";
      }
  	},
  	privacy:function(selected){
  	  if(selected == 1){
    	  return "";
  	  }else{
    	  return Drupal.t("You must accept the privacy.\n");
  	  }
  	}
	},
	methods = {
    init:function(options){
      if(this.length){
    	  var settings = {
    	    submit:"#edit-submit",
    	    privacy:"",
    	    loading:"loading",
    	    thanks:{
      	    'page':'.page',
      	    'container':'.container'
    	    }
    	  }
    	  
    	  return this.each(function(){
      	  if(options){
        	  $.extend(settings, options)
      	  }
      	  setup.form(this, settings);
    	  })
      }
    }
  };
  
  $.fn.vw = function(method){
    if(methods[method]){
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		}else if(typeof method === 'object' || ! method){
			return methods.init.apply(this, arguments);
		}else{
			$.error('Method '+method+' does not exist on jQuery.validateWebform');
		}
  }
	  
})(jQuery);		
