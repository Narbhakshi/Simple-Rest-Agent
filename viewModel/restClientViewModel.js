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
    this.restMethodsArray = ko.observableArray(["GET","POST","PUT","DELETE"]);
    this.headersList = ko.observableArray([]);
    this.itemToAdd = ko.observable('');
    this.disablePayloadSection = ko.observable(true);
    this.restOutputAvailable = ko.observable(false);
    this.toggleFullOutputText = ko.observable('Show more');
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
          this.displayResult(data);
        }.bind(this)
      })
    }.bind(this);


    this.displayResult = function(response){
      console.log(response);
      this.restOutput(JSON.stringify(response.data, null, 2));
      delete response.data;
      delete response.json;
      this.fullRestOutput(JSON.stringify(response, null, 2));
      this.restOutputAvailable(true);
    }.bind(this);

    this.showHistorySection = function(){
      this.showHeadersSectionFlag(false);
      this.showPayloadFlag(false);
      this.showHistoryFlag(true);
    }.bind(this);

    this.toggleFullOutput = function(){
      if(this.showFullRestOutput()){
        this.showFullRestOutput(false);
        this.toggleFullOutputText('Show less');
      }else {
        this.showFullRestOutput(true);
        this.toggleFullOutputText('Show more');
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
        this.itemToAdd("");
      }
    }.bind(this);

    this.removeHeader = function(header) {
      this.headersList.remove(header);
    }.bind(this);



  };
  ko.applyBindings(new restClientViewModel());
});
