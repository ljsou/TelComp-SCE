/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

import java.util.ArrayList;
import java.util.List;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import telcomp.retrieval.matchmaking.ws.Data;
import telcomp.retrieval.matchmaking.ws.Operation;
import webservice.JSLEEorchestrator_Service;

/**
 *
 * @author Javier
 */
@ManagedBean
@SessionScoped
public class ComponentInteractionManagedBean {

    private String componentId;
    private Operation component;
    private String queryId;
    private String userDataQuery;
    private String userDataTarget;
    private String targetId;
    private Operation query;
    private OperationComodin queryUserDataOperation;
    private Operation target;
    private Operation targetUserData;
    private telcomp.retrieval.matchmaking.ws.Data[] selectedSource;
    private String selectedTarget;
    private String selectedUserDataTarget;
    private List<telcomp.retrieval.matchmaking.ws.Data> selectedTargets;
    private List<telcomp.retrieval.matchmaking.ws.Data> selectedSources;
    private List<telcomp.retrieval.matchmaking.ws.Data> sourceDataElements;
    private List<telcomp.retrieval.matchmaking.ws.Data> targetDataElements;
    private List<telcomp.retrieval.matchmaking.ws.Data> targetUserDataElements;
    private DataAssociation association;
    private List<DataAssociation> associations;
    private List<UserDataAssociation> userDataassociations;
    private String userDataOperationName;
    private boolean checked;
    private String jsonGraph;
    private String complexComponentName;

    public ComponentInteractionManagedBean() {
        System.out.println("constructor");
        this.sourceDataElements = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.targetDataElements = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.targetUserDataElements = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.selectedSources = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.selectedTargets = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.association = new DataAssociation();
        this.associations = new ArrayList<DataAssociation>();
        this.userDataassociations = new ArrayList<UserDataAssociation>();
        this.queryUserDataOperation = new OperationComodin();
        this.selectedUserDataTarget = null;
        this.query = new Operation();
        this.target = new Operation();
        this.targetUserData = new Operation();
        

//        for (int i = 0; i < 3; i++) {
//            Data data = new Data();
//            data.setDataName("Source " + i);
//            data.setDataType("Type Source " + i);
//            sourceDataElements.add(data);
//        }

//        for (int i = 0; i < 5; i++) {
//            Data data = new Data();
//            data.setDataName("Target " + i);
//            data.setDataType("Type target" + i);
//            targetDataElements.add(data);
//        }
    }

    public UserDataAssociation createUserDataAssociation() {
        System.out.println("user data association");
        UserDataAssociation uda = new UserDataAssociation();
        System.out.println("getUserDataQuery: " + this.userDataQuery);
        System.out.println("getSelectedTarget: " + this.selectedTarget);
        uda.setSourceData(this.userDataQuery);
        uda.setTargetData(this.selectedTarget);
        this.userDataassociations.add(uda);
        return uda;
    }

    public DataAssociation createAssociation() {
        System.out.println("entró!!");
        int l = getSelectedSource().length;
        for (int i = 0; i < this.sourceDataElements.size(); i++) {
            for (int j = 0; j < l; j++) {
                if ((this.sourceDataElements.get(i).getDataElementName()).equalsIgnoreCase(getSelectedSource()[j].getDataElementName())) {
                    this.selectedSources.add(getSelectedSource()[j]);
                }
            }
        }

//        for (int k = 0; k < l; k++) {
//            for (Iterator<telcomp.retrieval.matchmaking.ws.Data> it = this.sourceDataElements.iterator(); it.hasNext();) {
//                telcomp.retrieval.matchmaking.ws.Data data = it.next();
//                if (getSelectedSource()[k].getDataElementName().equalsIgnoreCase(data.getDataElementName())) {
//                    //System.out.println("sourceDataElements.get(j): " + data.getDataElementName());
//                    this.selectedSources.add(data);
//                }
//            }
//        }

        for (int i = 0; i < this.selectedSources.size(); i++) {
            this.association = new DataAssociation();
            this.association.setSourceData(this.selectedSources.get(i));
            this.association.setTargetData(this.selectedTargets.get(i));
            this.associations.add(association);
        }
        return this.association;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getOperationOutputs() {
        List<telcomp.retrieval.matchmaking.ws.Data> outputData = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        if (this.query != null) {
            for (int i = 0; i < this.query.getDataElements().size(); i++) {
                telcomp.retrieval.matchmaking.ws.Data data = this.query.getDataElements().get(i);
                if (!data.isInput()) {
                    outputData.add(data);
                }
            }
            this.sourceDataElements = outputData;
            //System.out.println("source data: " + this.sourceDataElements.size());
        }
        return this.sourceDataElements;

    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getOperationInputs() {
        List<telcomp.retrieval.matchmaking.ws.Data> inputData = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        for (int i = 0; i < this.target.getDataElements().size(); i++) {
            telcomp.retrieval.matchmaking.ws.Data data = this.target.getDataElements().get(i);
            if (data.isInput()) {
                inputData.add(data);
            }
        }
        this.targetDataElements = inputData;
        // System.out.println("target data: " + this.targetDataElements.size());
        return this.targetDataElements;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getUserDataOperationInputs() {
        List<telcomp.retrieval.matchmaking.ws.Data> inputData = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        for (int i = 0; i < this.targetUserData.getDataElements().size(); i++) {
            telcomp.retrieval.matchmaking.ws.Data data = this.targetUserData.getDataElements().get(i);
            if (data.isInput()) {
                inputData.add(data);
            }
        }
        this.targetUserDataElements = inputData;
        // System.out.println("target data: " + this.targetDataElements.size());
        return this.targetUserDataElements;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getComponentInputs() {
        List<telcomp.retrieval.matchmaking.ws.Data> inputData = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        if (this.component != null) {
            System.out.println("getComponentInputs: " + this.component.getDataElements().size());
            for (int i = 0; i < this.component.getDataElements().size(); i++) {
                telcomp.retrieval.matchmaking.ws.Data data = this.component.getDataElements().get(i);
                if (data.isInput()) {
                    inputData.add(data);
                }
            }
        }
        return inputData;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getComponentOutputs() {
        List<telcomp.retrieval.matchmaking.ws.Data> outputData = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        if (this.component != null) {
            System.out.println("getComponentOutputs: " + this.component.getDataElements().size());
            for (int i = 0; i < this.component.getDataElements().size(); i++) {
                telcomp.retrieval.matchmaking.ws.Data data = this.component.getDataElements().get(i);
                if (!data.isInput()) {
                    outputData.add(data);
                }
            }
        }
        return outputData;
    }

    public String getComplexComponentName() {
         System.out.println("-Name: " +  this.complexComponentName);
        return this.complexComponentName;
    }

    public void setComplexComponentName(String complexComponentName) {
        System.out.println("--Name: " +  complexComponentName);
        this.complexComponentName = complexComponentName;
    }

    public void verCC(){
        System.out.println("Complex Component:  " + this.complexComponentName);
    }
    
    public String getUserDataQuery() {
        return this.userDataQuery;
    }

    public void setUserDataQuery(String userDataQuery) {
        this.userDataQuery = userDataQuery;
        //DataComodin dataComodin = new DataComodin();
        telcomp.retrieval.matchmaking.ws.Data dataComodin = new telcomp.retrieval.matchmaking.ws.Data();
        dataComodin.setDataElementName(this.userDataQuery);
        dataComodin.setDataType("String");

        this.queryUserDataOperation = new OperationComodin();
        this.queryUserDataOperation.setOperationName(this.userDataOperationName);
        this.queryUserDataOperation.addDataElement(dataComodin);
    }

    public String getUserDataOperationName() {
        return userDataOperationName;
    }

    public void setUserDataOperationName(String userDataOperationName) {
        this.userDataOperationName = userDataOperationName;
    }

    public String getComponentId() {
        System.out.println("this.componentId: " + this.componentId);
        return componentId;
    }

    public void setComponentId(String componentId) {
        this.componentId = componentId;
        this.component = retrieveComponentById(Long.parseLong(this.componentId));
    }

    public Operation getComponent() {
        return component;
    }

    public void setComponent(Operation component) {
        this.component = component;
    }

    public OperationComodin getQueryUserDataOperation() {
        return queryUserDataOperation;
    }

    public void setQueryUserDataOperation(OperationComodin queryUserDataOperation) {
        this.queryUserDataOperation = queryUserDataOperation;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getUserDataOutputs() {
        return this.queryUserDataOperation.getDataElements();
    }

    public String getQueryId() {
        return queryId;
    }

    public void setQueryId(String queryId) {
        this.queryId = queryId;
        this.query = retrieveComponentById(Long.parseLong(this.queryId));
        //System.out.println("+Query: " + this.query.getOperationName());
    }

    public String getTargetId() {
        return targetId;
    }

    public void setTargetId(String targetId) {
        this.targetId = targetId;
        this.target = retrieveComponentById(Long.parseLong(this.targetId));
        //System.out.println("+Target: " + target.getOperationName());
    }

    public Operation getQuery() {
        return query;
    }

    public void setQuery(Operation query) {
        this.query = query;
    }

    public Operation getTarget() {
        return target;
    }

    public void setTarget(Operation target) {
        this.target = target;
    }

    public String getUserDataTarget() {
        return userDataTarget;
    }

    public void setUserDataTarget(String userDataTarget) {
        this.userDataTarget = userDataTarget;
        this.targetUserData = retrieveComponentById(Long.parseLong(this.userDataTarget));
    }

    public Operation getTargetUserData() {
        return targetUserData;
    }

    public void setTargetUserData(Operation targetUserData) {
        this.targetUserData = targetUserData;
    }

    public telcomp.retrieval.matchmaking.ws.Data[] getSelectedSource() {
        System.out.println("//getSelectedSource: " + selectedSource);
        return selectedSource;
    }

    public void setSelectedSource(telcomp.retrieval.matchmaking.ws.Data[] selectedSource) {
        this.selectedSource = selectedSource;
        System.out.println("//setSelectedSource: " + this.selectedSource);
    }

    public String getSelectedUserDataTarget() {
        System.out.println("//getSelectedUserDataTarget " + this.selectedUserDataTarget);
        return this.selectedUserDataTarget;
    }

    public void setSelectedUserDataTarget(String selectedUserDataTarget) {
        System.out.println("//setSelectedUserDataTarget --> " + selectedUserDataTarget);
        this.selectedUserDataTarget = selectedUserDataTarget;
    }

    public String getSelectedTarget() {
        System.out.println("//getSelectedTarget " + this.selectedTarget);
        return this.selectedTarget;
    }

    public void setSelectedTarget(String selectedTarget) {
        System.out.println("//setSelectedTarget --> " + selectedTarget);
        this.selectedTarget = selectedTarget;
        if (selectedTarget.equalsIgnoreCase("")) {
//            System.out.println("setSelectedTarget: blanco");
        } else {
//            System.out.println("setSelectedTarget: else");
            for (int i = 0; i < targetDataElements.size(); i++) {
                if (targetDataElements.get(i).getDataElementName().equalsIgnoreCase(selectedTarget)) {
                    System.out.println("target seleccionado: " + targetDataElements.get(i));
                    this.selectedTargets.add(targetDataElements.get(i));
                }
            }
            System.out.println("setSelectedTargets: " + this.selectedTargets.size());
        }
    }

    public List<Data> getSelectedTargets() {
        return selectedTargets;
    }

    public void setSelectedTargets(List<Data> selectedTargets) {
        this.selectedTargets = selectedTargets;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getSourceDataElements() {
        return sourceDataElements;
    }

    public void setSourceDataElements(List<telcomp.retrieval.matchmaking.ws.Data> sourceDataElements) {
        this.sourceDataElements = sourceDataElements;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getTargetDataElements() {
        return targetDataElements;
    }

    public void setTargetDataElements(List<telcomp.retrieval.matchmaking.ws.Data> targetDataElements) {
        this.targetDataElements = targetDataElements;
    }

    public List<Data> getTargetUserDataElements() {
        return targetUserDataElements;
    }

    public void setTargetUserDataElements(List<Data> targetUserDataElements) {
        this.targetUserDataElements = targetUserDataElements;
    }

    public DataAssociation getAssociation() {
        return this.association;
    }

    public void setAssociation(DataAssociation dataAssociation) {
        this.association = dataAssociation;
    }

    public List<DataAssociation> getAssociations() {
        return associations;
    }

    public void setAssociations(List<DataAssociation> associations) {
        this.associations = associations;
    }

    public List<UserDataAssociation> getUserDataassociations() {
        return userDataassociations;
    }

    public void setUserDataassociations(List<UserDataAssociation> userDataassociations) {
        this.userDataassociations = userDataassociations;
    }

    public void eraseAll() {
//        this.selectedSources = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
//        this.selectedTargets = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
//        this.association = new DataAssociation();
//        this.associations = new ArrayList<DataAssociation>();
        System.out.println("this.selectedUserDataTarget value before erase: " + this.selectedUserDataTarget);
        this.selectedSource = null;
        this.selectedTarget = "";
        this.selectedUserDataTarget = null;
        this.userDataQuery = null;
        this.userDataOperationName = null;
        this.sourceDataElements = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.targetDataElements = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.selectedSources = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.selectedTargets = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
        this.association = new DataAssociation();
        this.associations = new ArrayList<DataAssociation>();
        this.queryUserDataOperation = new OperationComodin();

    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getSelectedSources() {
        return this.selectedSources;
    }

    public void setSelectedSources(List<telcomp.retrieval.matchmaking.ws.Data> selectedSources) {
        this.selectedSources = selectedSources;
    }

    private static Operation retrieveComponentById(long arg0) {
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService service = new telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService();
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWS port = service.getComponentMatchmakerWSPort();
        return port.retrieveComponentById(arg0);
    }

    public void setChecked(boolean checked) {
        this.checked = checked;
    }

    public boolean isChecked() {
        return checked;
    }

    public void addMessage() {
        //String summary = checked ? "Now, this edge will be both data and control." : "Now, this one will be just a data flow edge. ";
        String summary = checked ? "Edge type changed!" : "Edge type changed!!";
        FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(summary));
    }

    public String getJsonGraph() {
        //System.out.println("ok! " + jsonGraph);
        return jsonGraph;
    }

    public void setJsonGraph(String jsonGraph) {
        //System.out.println("ok!! " + this.jsonGraph);
        this.jsonGraph = jsonGraph;
    }

    private static boolean setJsonGraphToJSEEOrchestrate(java.lang.String arg0, String name) {
        System.out.println("setJsonGraph! " + arg0);
        webservice.JSLEEorchestrator_Service jslees = new JSLEEorchestrator_Service();
        return jslees.getJSLEEorchestratorPort().orchestrateService(arg0, name, true);
    }

    public void sendJson() {
        try {
            System.out.println("Nombre de la composición: " + this.complexComponentName);
            System.out.println("+-json: " + this.jsonGraph);
            //setJsonGraphToJSEEOrchestrate(" {\"containers\":[{\"idcomp\":195,\"title\":\"getCurrencyValue\"},{\"idcomp\":1547,\"title\":\"GetCurrencies\"}],\"wires\":[{\"src\":{\"moduleId\":1},\"tgt\":{\"moduleId\":0}}]}");
            boolean result = setJsonGraphToJSEEOrchestrate(this.jsonGraph, this.complexComponentName);
            System.out.println(result);

        } catch (Exception e) {
            System.out.println("trigger exception...");
        }

    }
}
