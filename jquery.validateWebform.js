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
    	  var $action, $entry, $drupal, $content_lead, $boundry, $entered, $track, $deliver;
    	  $action = $(this).attr('action');
    	  $entry = $(this).find('input.form-text, input.form-checkbox, input.form-radio, select.form-select, textarea');
    	  $drupal = $(this).find('input:hidden');
    	  $content_lead = '\nContent-Disposition: form-data;';
    	  $boundry = '-----------------------------1626259126772';
    	  $entered = '';
    	  $track = $('input[name="submitted[outrack]"]', this).val();

    	  $(settings.submit, this).click(function(){
    	    var $this = $(this);
    	    $deliver = $('input[name="submitted[thanks]"]', '#'+target.id).val();
    	    var message = "";
    	    //required input
    	    $('input.required:visible', '#'+target.id).each(function(){
      	    var $element, count, id, name, value, type;
      	    $element = $(this);
      	    count = $element.size();
      	    id = $element.attr('id');
      	    name = $('label[for='+id+']').text();
      	    value = $element.val();
      	    type = $element[0].type.toLowerCase();
      	    //validate email field
      	    if($element.hasClass('email') && validate.email(value) == false){
        	    message += Drupal.t("You must insert a valid email address\n");
      	    }
      	    //validate text field
      	    message += validate.text(name, value);
    	    });
    	    //required select list
    	    $('select.required:visible', '#'+target.id).each(function(){
      	    var $element, id, name, value;
      	    $element = $(this);
      	    id = $element.attr('id');
      	    name = $('label[for='+id+']').text();
      	    value = $element.val();

      	    message += validate.select(name, value);
    	    })
    	    //required radios
    	    $('.webform-component-radios', '#'+target.id).each(function(){
      	    var $element, required, checked, id, name;
      	    $element = $(this);
      	    required = $('.form-required', $element);
      	    checked = $('input[type=radio]:checked', $element);
      	    id = $('.form-radios', $element).attr('id');
      	    name = $('label[for='+id+']').text();

      	    if(required[0]){
      	      message += validate.radios(checked, name);
      	    }
    	    })
    	    //required checkboxes
    	    $('.webform-component-checkboxes', '#'+target.id).each(function(){
      	    var $element, required, checked, id, name;
      	    $element = $(this);
      	    required = $('.form-required', $element);
      	    checked = $('input[type=checkbox]:checked', $element);
      	    id = $('.form-checkboxes', $element).attr('id');
      	    name = $('label[for='+id+']').text();

      	    if(required[0]){
        	    message += validate.checkboxes(checked, name);
      	    }
    	    })
    	    //required textarea
    	    $('textarea.required:visible', '#'+target.id).each(function(){
      	    var $element, id, name, value;
      	    $element = $(this);
      	    id = $element.attr('id');
      	    name = $('label[for='+id+']').text();
      	    value = $element.val();

      	    message += validate.textarea(name, value);
    	    })
    	    //required privacy, if defined
    	    $(settings.privacy, '#'+target.id).each(function(){
      	    var selected = $(this).is(':checked');
      	    message += validate.privacy(selected);
    	    })
    	    //test that the required field is inserted
    	    if(message == ""){
    	      $this.hide().parent().append('<span class="inline-loading"></span>');
      	    setup.loading(settings);

      	    var $params = '?html=ajax&page=ajax';

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
        	    if(!$.isEmptyObject(settings.extra_fields)){
        	      for(var i = 0; i < settings.extra_fields.length; i++){
          	      if(settings.extra_fields[i] == $name){
            	      $params += '&'+settings.extra_fields[i]+'='+$value;
          	      }
        	      }
        	    }
      	    })
      	    $entered += $boundry + '\nContent-Disposition: form-data; name="op"\n\nSubmit\n'+$boundry +'--\n\n';
      	    $.ajaxSetup({contentType: 'multipart/form-data; boundary=---------------------------1626259126772', cache: false});
      	    $.post($action, $entered).done(function(data){
        	    var $temp = data;
        	    $this.show().parent().find('.inline-loading').remove();
        	    $(settings.privacy).prop('checked', false);
        	    if($.isEmptyObject(settings.colorbox)){
        	      setup.unloading(settings);
          	    $(settings.thanks.container).fadeOut('fast', function(){
          	      $(this).parent().append($(settings.thanks.page, data));
          	      $(settings.thanks.page).fadeIn('fast');
          	    })
        	    }else{
        	      settings.colorbox['href'] = $deliver+$params;
          	    $.colorbox(settings.colorbox);
        	    }
        	    if(settings.ga == true && $track){
                //_gaq.push(['_trackPageview', $track]);
								ga('send', 'pageview', {
									'page': $track
								});
              }
      	    }).fail(function(e){
        	    alert(Drupal.t("There is a problem submitting the form. Please, retry later."));
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
    	  return Drupal.t("The field @name is required.\n", {'@name':name.replace(" *","")});
      }else{
        return "";
      }
  	},
  	textarea:function(name, value){
    	if(value == ""){
    	  return Drupal.t("The field @name is required.\n", {'@name':name.replace(" *","")});
      }else{
        return "";
      }
  	},
  	radios:function(checked, name){
    	if(checked[0]){
      	return "";
    	}else{
      	return Drupal.t("You must select an option from @name.\n", {'@name':name.replace(" *","")});
    	}
  	},
  	select:function(name, value){
  	  if(value == "" || value == "--"){
    	  return Drupal.t("You must select an option from @name.\n", {'@name':name.replace(" *","")});
      }else{
        return "";
      }
  	},
  	checkboxes:function(checked, name){
    	if(checked[0]){
      	return "";
    	}else{
      	return Drupal.t("You must select at least one option from @name.\n", {'@name':name.replace(" *","")});
    	}
  	},
  	privacy:function(selected){
  	  if(selected){
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
    	    },
    	    ga:false,
    	    colorbox:{},
    	    extra_fields:[]
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
