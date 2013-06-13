/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control.dataflow;

import java.util.ArrayList;
import java.util.List;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import telcomp.retrieval.matchmaking.ws.Data;
import telcomp.retrieval.matchmaking.ws.Operation;

/**
 *
 * @author SemanticaUcauca
 */
@ManagedBean
@SessionScoped
public class ControlDataFlow {

    private String selectedSourceDataElement;
    private String selectedTargetDataElement;
    private Operation queryOperation;
    private Operation targetOperation;
    private String queryOperationId;
    private String targetOperationId;
    private List<Data> sourceDataElements;
    private List<Data> targetDataElements;
    private DataAssociation dataAssociation;
    private List<DataAssociation> dataFlow;

    public ControlDataFlow() {
        initValues();
    }

    public final void initValues() {
        System.out.println("init...");
        sourceDataElements = new ArrayList<Data>();
        targetDataElements = new ArrayList<Data>();
        dataAssociation = new DataAssociation();
        dataFlow = new ArrayList<DataAssociation>();

        for (int i = 1; i < 5; i++) {
            Data sourceDataElement = new Data();
            sourceDataElement.setId(i);
            sourceDataElement.setDataElementName("SourceDataElement " + i);
            sourceDataElement.setDataType("String");
            sourceDataElement.setInput(false);
            sourceDataElement.setOperationId(100 + i);
            sourceDataElements.add(sourceDataElement);
        }

        for (int i = 1; i < 10; i++) {
            Data targetDataElement = new Data();
            targetDataElement.setId(1);
            targetDataElement.setDataElementName("TargetDataElement " + i);
            targetDataElement.setDataType("String");
            targetDataElement.setInput(false);
            targetDataElement.setOperationId(200 + i);
            targetDataElements.add(targetDataElement);
        }
    }

    public void executeDataAssociation() {
        for (int i = 0; i < sourceDataElements.size(); i++) {
            Data deSource = sourceDataElements.get(i);
            //System.out.println("source: " + deSource.getDataElementName() + " - " + selectedSourceDataElement);
            if (deSource.getDataElementName().equalsIgnoreCase(selectedSourceDataElement)) {
                dataAssociation.setSource(deSource);
            }
        }
        for (int i = 0; i < targetDataElements.size(); i++) {
            Data deTarget = targetDataElements.get(i);
            //System.out.println("source: " + deTarget.getDataElementName() + " - " + selectedTargetDataElement);
            if (deTarget.getDataElementName().equalsIgnoreCase(selectedTargetDataElement)) {
                dataAssociation.setTarget(deTarget);
            }
        }
        //System.out.println("DataAssociation: " + dataAssociation.getSource().getDataElementName() + " - " + dataAssociation.getTarget().getDataElementName());
        dataFlow.add(dataAssociation);
        System.out.println("dataFlow: " + dataFlow.size() + " - " + dataFlow.get(dataFlow.size() - 1).getSource().getDataElementName());
    }

    public String getSelectedSourceDataElement() {
        return selectedSourceDataElement;
    }

    public void setSelectedSourceDataElement(String selectedSourceDataElement) {
        this.selectedSourceDataElement = selectedSourceDataElement;
    }

    public String getSelectedTargetDataElement() {
        return selectedTargetDataElement;
    }

    public void setSelectedTargetDataElement(String selectedTargetDataElement) {
        this.selectedTargetDataElement = selectedTargetDataElement;
    }

    public DataAssociation getDataAssociation() {
        return dataAssociation;
    }

    public void setDataAssociation(DataAssociation dataAssociation) {
        this.dataAssociation = dataAssociation;
    }

    public List<DataAssociation> getDataFlow() {
        return dataFlow;
    }

    public void setDataFlow(List<DataAssociation> dataFlow) {
        this.dataFlow = dataFlow;
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

    public Operation getQueryOperation() {
        return queryOperation;
    }

    public void setQueryOperation(Operation queryOperation) {
        this.queryOperation = queryOperation;
    }

    public Operation getTargetOperation() {
        return targetOperation;
    }

    public void setTargetOperation(Operation targetOperation) {
        this.targetOperation = targetOperation;
    }

    public String getQueryOperationId() {
        return queryOperationId;
    }

    public void setQueryOperationId(String queryOperationId) {
        this.queryOperation = retrieveComponentById(Long.parseLong(queryOperationId));
        initSourceDataElements();
        this.queryOperationId = queryOperationId;
    }

    public String getTargetOperationId() {
        return targetOperationId;
    }

    public void setTargetOperationId(String targetOperationId) {
        this.targetOperation = retrieveComponentById(Long.parseLong(targetOperationId));
        initTargetDataElements();
        this.targetOperationId = targetOperationId;
    }
    
    private void initSourceDataElements() {
        System.out.println("initSourceDataElements");
        for (Data dataSource : getOperationOutputs()) {
            //this.dataAssociations.add(new DataAssociation(dataSource, null));
            this.sourceDataElements.add(dataSource);
        }
    }
    
    private void initTargetDataElements() {
        System.out.println("initSourceDataElements");
        for (Data dataSource : getOperationInputs()) {
            //this.dataAssociations.add(new DataAssociation(dataSource, null));
            this.targetDataElements.add(dataSource);
        }
    }
    
    public List<Data> getOperationOutputs() {
        System.out.println("getOperationOutputs");
        List<Data> outputData = new ArrayList<Data>();
        //System.out.println("Elementos de salida: " + this.query.getOperationName() + "(" + this.query.getDataElements().size() + ")");
        for (int i = 0; i < this.queryOperation.getDataElements().size(); i++) {
            Data data = this.queryOperation.getDataElements().get(i);
            if (!data.isInput()) {
                //System.out.println("Output-" + i);
                outputData.add(data);
            }
        }
        //System.out.println("Datos de Salida: " + outputData);
        return outputData;
    }
    
    public List<Data> getOperationInputs() {
        System.out.println("getOperationInputs");
        List<Data> inputData = new ArrayList<Data>();
        for (int i = 0; i < this.targetOperation.getDataElements().size(); i++) {
            Data data = this.targetOperation.getDataElements().get(i);
            if (data.isInput()) {
                inputData.add(data);
            }
        }
        //System.out.println("Datos de Entrada: " + inputData);
        return inputData;
    }

    private static Operation retrieveComponentById(long arg0) {
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService service = new telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService();
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWS port = service.getComponentMatchmakerWSPort();
        return port.retrieveComponentById(arg0);
    }
}
