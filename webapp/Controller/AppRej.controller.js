sap.ui.define(
    // "arvind.sd.creditlimit.dateext"
    ["arvind/sd/creditlimit/dateext/Controller/baseController",
        "sap/ui/core/Fragment",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
     "arvind/sd/creditlimit/dateext/Controller/oDataCall",
        "sap/m/MessageBox",
        "sap/m/MessageToast"
    ],
    function (baseController, Fragment, Filter, FilterOp,oDataCall, MessageBox, MessageToast) {
        return baseController.extend("arvind.sd.creditlimit.dateext.Controller.AppRej", {
            onInit() {

                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("init").attachMatched(this.RHM, this);
            },
            sEntitySet:"",
            RHM:function(oEvent){
                const oFilter = [];
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                var oJson = new sap.ui.model.json.JSONModel();
                debugger;
                var sStatus = oEvent.getParameter("arguments").RID.split("=")[0];
                 
                var EntitySet = "/ZSD_CREDIT_REQTSet('" + sStatus + "')";
                this.sEntitySet = EntitySet; 
                debugger;
                oDataCall.callGetOdata(oModel, oFilter, EntitySet)
                .then(function (responce) {
                    oJson.setData(responce);
                    that.oLocalModel = oJson;
                    that.getView().setModel(that.oLocalModel, "Detail");
                })  
                .catch(function (Error, sPath) {
                    oBusy.close();
                    MessageBox.error("Error in Processing");

                });
              

            },
            updateStatus:function(status){
                var that = this;

                var oModel = this.getOwnerComponent().getModel();
                var oJson = new sap.ui.model.json.JSONModel();
                oJson = this.getView().getModel("Detail").getData();
                debugger;
                oJson.Zstatus = status;
                oJson.Znewdt = this.getView().byId("DP1").getDateValue();
                oDataCall.UpdateCall(oModel, this.sEntitySet, oJson)
                .then(function (responce) {
                    debugger;
                    var vMessage = "Data Updated Successfully";
                    
                    MessageBox.information(vMessage, {
                        actions: [MessageBox.Action.CLOSE],

                        onClose: function (sAction) {
                            location.reload();
                            // MessageToast.show("Action selected: " + sAction);
                        },
                        dependentOn: that.getView()
                    });

                })
                .catch(function (Error, sPath) {
                    debugger;
                });

            },
            onApprove:function(){
                this.updateStatus("A");
                

            },
            onReject:function(){

                this.updateStatus("R");

            }


        });
    });