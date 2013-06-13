/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

/**
 *
 * @author Javier
 */
public class DataAssociation {
    private long idDataAssociation;
    private telcomp.retrieval.matchmaking.ws.Data sourceData;
    private telcomp.retrieval.matchmaking.ws.Data targetData;

    public DataAssociation() {  
    }
    
    public telcomp.retrieval.matchmaking.ws.Data getSourceData() {
        return sourceData;
    }

    public void setSourceData(telcomp.retrieval.matchmaking.ws.Data sourceData) {
        this.sourceData = sourceData;
    }

    public telcomp.retrieval.matchmaking.ws.Data getTargetData() {
        return targetData;
    }

    public void setTargetData(telcomp.retrieval.matchmaking.ws.Data targetData) {
        this.targetData = targetData;
    }

    public long getIdDataAssociation() {
        return idDataAssociation;
    }

    public void setIdDataAssociation(long idDataAssociation) {
        this.idDataAssociation = idDataAssociation;
    }        
}
