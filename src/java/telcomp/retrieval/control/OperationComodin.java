/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Javier
 */
public class OperationComodin {
    private String operationName; 
    private List<telcomp.retrieval.matchmaking.ws.Data> dataElements;

    public OperationComodin() {
        this.operationName = "";
        this.dataElements = new ArrayList<telcomp.retrieval.matchmaking.ws.Data>();
    }       
    
    public String getOperationName() {
        return operationName;
    }

    public void setOperationName(String operationName) {
        this.operationName = operationName;
    }

    public List<telcomp.retrieval.matchmaking.ws.Data> getDataElements() {
        return dataElements;
    }

    public void setDataElements(List<telcomp.retrieval.matchmaking.ws.Data> dataElements) {
        this.dataElements = dataElements;
    }       
    
    public void addDataElement(telcomp.retrieval.matchmaking.ws.Data dataComodin) {
        dataElements.add(dataComodin);
    }
}
