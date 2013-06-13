/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

import telcomp.retrieval.control.dataflow.DataAssociation;
import java.util.ArrayList;
import javax.faces.bean.ManagedBean;
import java.util.List;
import javax.faces.application.FacesMessage;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import telcomp.retrieval.matchmaking.ws.Data;
import telcomp.retrieval.matchmaking.ws.Operation;

/**
 *
 * @author javier
 */
@ManagedBean
@SessionScoped
public class FormBean {

//    private List<String> selectedMovies;
//    private List<String> selectedOptions;
//    private Map<String, String> movies;
    private Operation query;
    private Operation target;
    private String queryId;
    private String targetId;
    private List<DataAssociation> dataAssociations;
    //private DataAssociationJpaController controller;
    private DataAssociation dataAssociation;
    private List<String> selectedSource;
    private String selectedTarget;
    private List<Data> sourceDataElements;
    private List<Data> targetDataElements;

    public FormBean() {
        dataAssociation = new DataAssociation();
        dataAssociations = new ArrayList<DataAssociation>();
        selectedSource = new ArrayList<String>();
    }

    public List<String> getSelectedSource() {
        System.out.println("get selected source: " + this.selectedSource);
        return selectedSource;
    }

    public void setSelectedSource(List<String> selectedSource) {
        System.out.println("set selected Source: " + selectedSource);
        this.selectedSource = selectedSource;
    }

    public String getSelectedTarget() {
        System.out.println("get selectedTarget: " + this.selectedTarget);
        return selectedTarget;
    }

    public void setSelectedTarget(String selectedTarget) {
        System.out.println("set selectedTarget: " + selectedTarget);
        this.selectedTarget = selectedTarget;
    }

    public DataAssociation getDataAssociation() {
        return dataAssociation;
    }

    public void setDataAssociation(DataAssociation dataAssociation) {
        this.dataAssociation = dataAssociation;
    }

    public List<Data> getSourceDataElements() {
        return sourceDataElements;
    }

    public void setSourceDataElements(List<Data> sourceDataElements) {
        this.sourceDataElements = sourceDataElements;
    }

    public List<Data> getTargetDataElements() {
        return targetDataElements;
    }

    public void setTargetDataElements(List<Data> targetDataElements) {
        this.targetDataElements = targetDataElements;
    }

//    public void submitMapping() {
//        System.out.println("Entra a Submit Mapping...");
//        for (DataAssociation association : this.dataAssociations) {
//            DataAssociationEntity dataAssociation = new DataAssociationEntity();
//            String associationId;
//            if (association.getTarget() != null) {
//                associationId = association.getSource().getId() + "_*";
//            } else {
//                associationId = association.getSource().getId() + "_" + association.getTarget().getId();
//            }
//            dataAssociation.setId(associationId);
//            dataAssociation.setIdDataSource(association.getSource().getId());
//            dataAssociation.setIdDataSource(association.getTarget().getId());
//            controller.create(dataAssociation);
//        }
//        System.out.println("Mapping submited!");
//    }
    public void destroyWorld() {
        System.out.println("Entro destroy");
        FacesMessage message = new FacesMessage(FacesMessage.SEVERITY_INFO, "System Error", "Please try again later.");
        FacesContext.getCurrentInstance().addMessage(null, message);
    }

//    /**
//     * @param movies the movies to set
//     */
//    public void setMovies(Map<String, String> movies) {
//        this.movies = movies;
//    }
    /**
     * @return the query
     */
    public Operation getQuery() {
        return query;
    }

    /**
     * @param query the query to set
     */
    public void setQuery(Operation query) {
        this.query = query;
    }

    /**
     * @return the target
     */
    public Operation getTarget() {
        return target;
    }

    /**
     * @param target the target to set
     */
    public void setTarget(Operation target) {
        this.target = target;
    }

    /**
     * @return the queryId
     */
    public String getQueryId() {
        return queryId;
    }

    /**
     * @param queryId the queryId to set
     */
    public void setQueryId(String queryId) {
        this.query = retrieveComponentById(Long.parseLong(queryId));
        System.out.println("-Query: " + query.getOperationName());
        this.queryId = queryId;
    }

    /**
     * @return the targetId
     */
    public String getTargetId() {
        return targetId;
    }

    /**
     * @param targetId the targetId to set
     */
    public void setTargetId(String targetId) {
        this.target = retrieveComponentById(Long.parseLong(targetId));
        this.targetId = targetId;
        System.out.println("-Target: " + target.getOperationName());
    }

    /**
     * get a component by Id
     *
     * @param arg0 component's Id
     * @return Retrieved component
     */
    private static Operation retrieveComponentById(long arg0) {
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService service = new telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService();
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWS port = service.getComponentMatchmakerWSPort();
        return port.retrieveComponentById(arg0);
    }

    /**
     * @return the dataAssociations
     */
    public List<DataAssociation> getDataAssociations() {
        return this.dataAssociations;
    }

    /**
     * @param dataAssociations the dataAssociations to set
     */
    public void setDataAssociations(List<DataAssociation> dataAssociations) {
        System.out.println("setDataAssociations...");
        this.dataAssociations.add(executeDataAssociation());
    }

    public List<Data> initSourceDataElements() {
        System.out.println("initSourceDataElements...");
        this.sourceDataElements = new ArrayList<Data>();
        this.sourceDataElements = getOperationOutputs();
//        for (Data dataSource : getOperationOutputs()) {
//            //this.dataAssociations.add(new DataAssociation(dataSource, null));
//            this.sourceDataElements.add(dataSource);
//        }
        System.out.println("sourceDataElements: " + this.sourceDataElements.size());
        return this.sourceDataElements;
    }

    public List<Data> initTargetDataElements() {
        System.out.println("initTargetDataElements...");
        this.targetDataElements = new ArrayList<Data>();
        this.targetDataElements = getOperationInputs();
//        for (Data dataSource : getOperationInputs()) {
//            //this.dataAssociations.add(new DataAssociation(dataSource, null));
//            this.targetDataElements.add(dataSource);
//        }
        System.out.println("targetDataElements: " + this.targetDataElements.size());
        return this.targetDataElements;
    }

    private void initDataAssociations() {
        System.out.println("initDataAssociations");
        getSelectedValues();
        this.dataAssociations = new ArrayList<DataAssociation>();
        for (Data dataSource : getOperationOutputs()) {
            this.dataAssociations.add(new DataAssociation(dataSource, null));
        }
    }

    public void getSelectedValues() {
        for (Data dataSource : getOperationOutputs()) {
            System.out.println("::" + selectedSource);
//            if (dataSource.getDataElementName().equalsIgnoreCase(selectedSource)) {
//                System.out.println("Este es el valor seleccionado para el modulo source: " + selectedSource);
//            }
        }
        for (Data dataTarget : getOperationInputs()) {
            System.out.println("::" + selectedTarget);
            if (dataTarget.getDataElementName().equalsIgnoreCase(selectedTarget)) {
                System.out.println("Este es el valor seleccionado para el modulo target: " + selectedTarget);
            }
        }
    }

    public List<Data> getOperationInputs() {
        List<Data> inputData = new ArrayList<Data>();
        //System.out.println("Elementos de Entrada: " + this.query.getOperationName() + "(" + this.query.getDataElements().size() + ")");
        for (int i = 0; i < this.target.getDataElements().size(); i++) {
            Data data = this.target.getDataElements().get(i);
            if (data.isInput()) {
                //System.out.println("Elementos de Entrada: " + i + ". " + data.getDataElementName());
                inputData.add(data);
                //this.sourceDataElements.add(data);
            }
        }

        return inputData;
    }

    public List<Data> getOperationOutputs() {
        List<Data> outputData = new ArrayList<Data>();
        //System.out.println("Elementos de Salida: " + this.query.getOperationName() + "(" + this.query.getDataElements().size() + ")");
        for (int i = 0; i < this.query.getDataElements().size(); i++) {
            Data data = this.query.getDataElements().get(i);
            if (!data.isInput()) {
                //System.out.println("Elementos de Salida: " + i + ". " + data.getDataElementName());
                outputData.add(data);
                //this.targetDataElements.add(data);
            }
        }
        //System.out.println("Datos de Salida: " + outputData);
        return outputData;
    }

    public DataAssociation executeDataAssociation() {
        System.out.println("executeDataAssociation...");
        String result = "nada";
        if (sourceDataElements != null && targetDataElements != null) {
            for (int i = 0; i < sourceDataElements.size(); i++) {
                System.out.println("size source: " + sourceDataElements.size());
                Data deSource = sourceDataElements.get(i);
                //System.out.println("source: " + deSource.getDataElementName() + " - " + selectedSourceDataElement);
                for (int j = 0; j < selectedSource.size(); j++) {
                    if (deSource.getDataElementName().equalsIgnoreCase(selectedSource.get(i))) {
                        dataAssociation.setSource(deSource);
                    }
                }

            }
            for (int i = 0; i < targetDataElements.size(); i++) {
                System.out.println("size target: " + targetDataElements.size());
                Data deTarget = targetDataElements.get(i);
                //System.out.println("source: " + deTarget.getDataElementName() + " - " + selectedTargetDataElement);
                if (deTarget.getDataElementName().equalsIgnoreCase(selectedTarget)) {
                    dataAssociation.setTarget(deTarget);
                    result = dataAssociations.get(0).getTarget().getDataElementName();
                }
            }
            //System.out.println("DataAssociation: " + dataAssociation.getSource().getDataElementName() + " - " + dataAssociation.getTarget().getDataElementName());
            //System.out.println("dataFlow: " + dataAssociations.size() + " - " + dataAssociations.get(dataAssociations.size() - 1).getSource().getDataElementName());
        } else {
            System.out.println("sourceDataElements or targetDataElements are null...");
        }
        return dataAssociation;
    }
}