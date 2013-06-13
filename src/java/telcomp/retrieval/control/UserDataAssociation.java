/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

/**
 *
 * @author Javier
 */
public class UserDataAssociation {
    private long idDataAssociation;
    private String sourceData;
    private String targetData;

    public UserDataAssociation() {  
    }
    
    public String getSourceData() {
        return sourceData;
    }

    public void setSourceData(String sourceData) {
        this.sourceData = sourceData;
    }

    public String getTargetData() {
        return targetData;
    }

    public void setTargetData(String targetData) {
        this.targetData = targetData;
    }

    public long getIdDataAssociation() {
        return idDataAssociation;
    }

    public void setIdDataAssociation(long idDataAssociation) {
        this.idDataAssociation = idDataAssociation;
    }        
}
