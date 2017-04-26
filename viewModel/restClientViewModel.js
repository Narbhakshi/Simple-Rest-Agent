$(document).ready(function() {
  "use strict"
  var restClientViewModel = function(items) {
    this.selectedRestMethod = ko.observable('');
    this.restURL = ko.observable('');
    this.showHistoryFlag = ko.observable(true);
    this.showPayloadFlag = ko.observable(false);
    this.restPAYLOAD = ko.observable('');
    this.showHeadersSectionFlag = ko.observable(false);
    this.restMethodsArray = ko.observableArray(["GET","POST","PUT","DELETE"]);
    this.headersList = ko.observableArray([{
      headerRank: null,
      headerKey:null,
      headerValue:null
    }]);
    this.itemToAdd = ko.observable('');


    this.onRestMethodChange = function() {
      console.log("url is: " + this.restURL());
      console.log("selectedRestMethod is: " + this.selectedRestMethod());
      if(this.selectedRestMethod() === "GET"){
        this.showPayloadFlag(false);
      }
    }.bind(this);

    this.restSubmitted = function(){
      console.log("EEEEEEEEEEEEEE");
      var method = this.selectedRestMethod();
      var restPayload = this.restPAYLOAD();
      var url = this.restURL();

      $.ajax({
        url: url,
        type: method,
        data: restPayload,
        contentType: "application/json",
        beforeSend: function(xhr) {
          //xhr.setRequestHeader('Authorization', localToken);
        },
        dataType: "json",
        success: function(data, textStatus, request) {
          this.displayResult(data);
        }.bind(this)
      })
    }.bind(this);


    this.displayResult = function(response){
      console.log(response);
    }.bind(this);

    this.showHistorySection = function(){
      this.showHeadersSectionFlag(false);
      this.showPayloadFlag(false);
      this.showHistoryFlag(true);
    }.bind(this);



    this.showHeadersSection = function(){
      this.showHistoryFlag(false);
      this.showPayloadFlag(false);
      this.showHeadersSectionFlag(true);
    }.bind(this);

    this.showPayloadSection = function(){
      this.showHistoryFlag(false);
      this.showHeadersSectionFlag(false);
      this.showPayloadFlag(true);
    }.bind(this);




    this.addItem = function() {
      var tempObject = {};
      tempObject["headerKey"] = this.itemToAdd.headerName;
      tempObject["headerValue"] = this.itemToAdd.headerValue;
      tempObject["headerRank"] = this.headersList().length;
      this.headersList.push(tempObject);
      this.itemToAdd("");
    }.bind(this);





  };
  ko.applyBindings(new restClientViewModel());
});
