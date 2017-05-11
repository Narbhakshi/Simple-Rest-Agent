$(document).ready(function() {
  "use strict"
  var restClientViewModel = function(items) {
    this.selectedRestMethod = ko.observable('');
    this.restURL = ko.observable('');
    this.showHistoryFlag = ko.observable(false);
    this.showPayloadFlag = ko.observable(false);
    this.fullRestOutput  = ko.observable('');
    this.restPAYLOAD = ko.observable('');
    this.restOutput = ko.observable('');
    this.showHeadersSectionFlag = ko.observable(true);
    this.restMethodsArray = ko.observableArray(["POST","GET","PUT","DELETE"]);
    this.headersList = ko.observableArray([]);
    this.itemToAdd = ko.observable('');
    this.disablePayloadSection = ko.observable(false);
    this.restOutputAvailable = ko.observable(false);
    this.toggleFullOutputText = ko.observable('Show less');
    this.showFullRestOutput = ko.observable(false);



    this.onRestMethodChange = function() {
      if(this.selectedRestMethod() === "GET"){
        this.showPayloadFlag(false);
        this.disablePayloadSection(true);
        this.showHeadersSectionFlag(true);
      }else{
        this.showPayloadFlag(true);
        this.disablePayloadSection(false);
        this.showHeadersSectionFlag(false);
      }
    }.bind(this);

    this.restSubmitted = function(){
      var method = this.selectedRestMethod();
      var restPayload = this.restPAYLOAD();
      var url = this.restURL();
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
        error: function(){
          this.onFailureResponse();
        }.bind(this)
      })
    }.bind(this);


    this.displayResult = function(response, textStatus, request){
      console.log(response);
      this.restOutput(JSON.stringify(response, null, 2));
      this.fullRestOutput(request.getAllResponseHeaders());
      this.restOutputAvailable(true);
    }.bind(this);

    this.onFailureResponse = function(){
      console.error('ERRRRRRRRRRRROOOOOOOOORRRRRRRRRRRR');
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




    this.addItem = function() {
      if(this.itemToAdd.headerName && this.itemToAdd.headerValue){
        var tempObject = {};
        tempObject["headerKey"] = this.itemToAdd.headerName;
        tempObject["headerValue"] = this.itemToAdd.headerValue;
        tempObject["headerRank"] = this.headersList().length;
        this.headersList.push(tempObject);
        this.itemToAdd.headerName("");
      }
    }.bind(this);

    this.removeHeader = function(header) {
      this.headersList.remove(header);
    }.bind(this);



  };
  ko.applyBindings(new restClientViewModel());
});
