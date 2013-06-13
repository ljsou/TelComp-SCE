/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import telcomp.retrieval.matchmaking.ws.Data;
import telcomp.retrieval.matchmaking.ws.Operation;

/**
 *
 * @author Javier
 */
@ManagedBean
@SessionScoped
public class PruebasManagedBean {

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

    public PruebasManagedBean() {
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

    public UserDataAssociation createUserDataAssociation(){
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
        for (int i = 0; i < l; i++) {
            for (Iterator<telcomp.retrieval.matchmaking.ws.Data> it = this.sourceDataElements.iterator(); it.hasNext();) {
                telcomp.retrieval.matchmaking.ws.Data data = it.next();
                if (getSelectedSource()[i].getDataElementName().equalsIgnoreCase(data.getDataElementName())) {
                    //System.out.println("sourceDataElements.get(j): " + data.getDataElementName());
                    this.selectedSources.add(data);
                }
            }
        }

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
        System.out.println("this.selectedUserDataTarget value before erase: "  + this.selectedUserDataTarget);
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
}
