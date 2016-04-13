ValidateWebform
===============

#Javascript validation and submission of Drupal Webform

This is a simple jQuery plug-in to validate and submit a Drupal 7 Webform from Javascript, unless reload the page of the form.
You just add the plug-in in your template and attach the event vw() to the id of the your webform.

    jQuery('#webform-client-form-1').vw();

The plugin controll and validate only the filed marked with required in the Form components page of your Webform.
You also need to change the Redirection location to Custom URL in the Form settings page of your Webform: you must create a node and add here the url of your node. When the form is submitted, this page is loaded as thank-you-page.

The settings of the plugins are:

    {
        //the submit button
        submit: "#edit-submit",
        //the privacy checkbox to validate, if the form have one
        privacy: "",
        //loading class name of the div, when the form is validate and submitted
        loading: "loading",
        //object: the page class loaded after submitted
        thanks: {
            page: '.page',
            container: '.container'
        },
        //object: colorbox oprions object.
        colorbox:{},
        //submit the thank-you-page URL to the Google Analitycs
        ga: false
    }

If the last parameter is set to TRUE, you must add an hidden field to the Webform, named **outrack**, with the URL you want to track. For example: `it/contattaci/grazie`.
This url is saved in your Google Analytics profile (in theory the outrack is must be the same of the url of the thank-you-page, instead you have two different tracked page for one form).<br />
The widget degrade gracefully when the javascript is disable (normal server-side webform validation).

###Note for thanks settings

The message must be conseguent to form. This is required becouse you must be multiple forms in a page, so the messagge will loaded correctly in the right form.

###Note for colorbox

Use all the colorbox options EXCLUDE `href` that is added by plugin itselft, represent the value of the hidden field `submitted[thanks]`. The hidden field must be added manualy when created the Webform.