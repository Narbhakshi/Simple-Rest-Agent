$(document).ready(function() {
  "use strict"
  var restClientViewModel = function(items) {
    this.selectedRestMethod = ko.observable('');
    this.restURL = ko.observable('');
    this.showHistoryFlag = ko.observable(false);
    this.showPayloadFlag = ko.observable(false);
    this.isRestUrlValid = ko.observable('1');
    this.fullRestOutput  = ko.observable('');
    this.restPAYLOAD = ko.observable('');
    this.restOutput = ko.observable('');
    this.restSuccess = ko.observable(false);
    this.restFail = ko.observable(false);
    this.showHeadersSectionFlag = ko.observable(true);
    this.restMethodsArray = ko.observableArray(["GET","POST","PUT","DELETE"]);
    this.headersList = ko.observableArray([]);
    this.restURLInputClass = ko.observable('');
    this.itemToAddHeaderValue = ko.observable('');
    this.itemToAddHeaderName = ko.observable('');
    this.isLoading = ko.observable(true);
    this.disablePayloadSection = ko.observable(true);
    this.restOutputAvailable = ko.observable(false);
    this.toggleFullOutputText = ko.observable('Show more');
    this.showFullRestOutput = ko.observable(false);

    var self = this;


    setTimeout(function(){
      self.isLoading(false);
    }, 500);


    /*
     Tooltips must be initialized with jQuery
    */
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })



    this.onRestMethodChange = function() {
      if(this.selectedRestMethod() === "GET" || this.selectedRestMethod() === "DELETE" ){
        this.showPayloadFlag(false);
        this.disablePayloadSection(true);
        this.showHeadersSectionFlag(true);
      }else{
        this.showPayloadFlag(true);
        this.disablePayloadSection(false);
        this.showHeadersSectionFlag(false);
      }
    }.bind(this);

    /*
    This subscribe to any change in the input URL
    and validate the URL
    */
    this.restURL.subscribe(function(newValue){
      var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
      var regex = new RegExp(expression);
      var restUrl =  newValue.replace(/ /g,'');
      if (restUrl.match(regex)) {
        self.isRestUrlValid(true);
      } else {
        self.isRestUrlValid(false);
      }
    });

    this.isRestUrlValid.subscribe(function(newValue){
      if (newValue) {
        self.restURLInputClass('restURLValid');
      } else {
        self.restURLInputClass('restURLNOTValid');
      }
    });

    this.restSubmitted = function(){
      this.restOutputAvailable(false);
      this.toggleLoader();
      var method = this.selectedRestMethod();
      var restPayload = this.restPAYLOAD();
      var url = this.restURL().replace(/ /g,'');
      var headerArray = this.headersList();


      var setHeaders = function(xhr){
        $.each(headerArray, function( index , object){
          xhr.setRequestHeader(object.headerKey, object.headerValue);
        });
      }

      $.ajax({
        url: url,
        type: method,
        data: restPayload,
        contentType: "application/json",
        beforeSend: setHeaders,
        dataType: "json",
        success: function(data, textStatus, request) {
          this.displayResult(data, textStatus, request);
        }.bind(this),
        error: function(data, textStatus, request){
          this.onFailureResponse(data, textStatus, request);
        }.bind(this)
      })
    }.bind(this);


    this.displayResult = function(response, textStatus, request){
      console.log(response);
      this.restOutput(JSON.stringify(response, null, 2));
      this.fullRestOutput(request.getAllResponseHeaders());
      this.restOutputAvailable(true);
      this.restSuccess(true);
      this.restFail(false);
      this.toggleLoader();
    }.bind(this);

    this.onFailureResponse = function(data, textStatus, request){
      this.restOutputAvailable(true);
      this.restSuccess(false);
      this.restFail(true);
      var iframe = document.getElementById('restErrorPlaceHolder');
      var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
      iframedoc.body.innerHTML = data.responseText;



      this.fullRestOutput(data.getAllResponseHeaders());
      //console.error('ERRRRRRRRRRRROOOOOOOOORRRRRRRRRRRR');
      this.toggleLoader();
    }.bind(this);

    this.copyToClipboard = function(){
      console.log("copyToClipbo restOutputClass");
      var copyTextarea = document.querySelector('.restOutputClass');
      copyTextarea.select();
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
      } catch (err) {
        console.log('Oops, unable to copy');
      }
    }.bind(this);

    this.showHistorySection = function(){
      this.showHeadersSectionFlag(false);
      this.showPayloadFlag(false);
      this.showHistoryFlag(true);
    }.bind(this);

    this.toggleFullOutput = function(){
      if(this.showFullRestOutput()){
        this.showFullRestOutput(false);
        this.toggleFullOutputText('Show more');
      }else {
        this.showFullRestOutput(true);
        this.toggleFullOutputText('Show less');
      }
    }.bind(this);

    this.showHeadersSection = function(){
      this.showHistoryFlag(false);
      this.showPayloadFlag(false);
      this.showHeadersSectionFlag(true);
    }.bind(this);

    this.showPayloadSection = function(){
      if(this.disablePayloadSection()){
        return;
      }
      this.showHistoryFlag(false);
      this.showHeadersSectionFlag(false);
      this.showPayloadFlag(true);
    }.bind(this);

    this.toggleLoader = function(){
      if(this.isLoading()){
        this.isLoading(false);
      }else {
        this.isLoading(true);
      }
    }.bind(this);




    this.addItem = function() {
      if(this.itemToAddHeaderName() && this.itemToAddHeaderValue()){
        var tempObject = {};
        tempObject["headerKey"] = this.itemToAddHeaderName();
        tempObject["headerValue"] = this.itemToAddHeaderValue();
        tempObject["headerRank"] = this.headersList().length + 1;
        this.headersList.push(tempObject);
        this.itemToAddHeaderName ("") ;
        this.itemToAddHeaderValue("") ;
      }
    }.bind(this);

    this.removeHeader = function(header) {
      this.headersList.remove(header);
    }.bind(this);



  };
  ko.applyBindings(new restClientViewModel());
});
