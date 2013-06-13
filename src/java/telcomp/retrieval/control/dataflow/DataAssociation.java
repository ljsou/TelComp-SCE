/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control.dataflow;

import telcomp.retrieval.matchmaking.ws.Data;

/**
 *
 * @author SemanticaUcauca
 */
public class DataAssociation {

    private String id;
    private Data source;
    private Data target;

    public DataAssociation() {
    }

    public DataAssociation(Data source, Data target) {
        this.source = source;
        this.target = target;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Data getSource() {
        return source;
    }

    public void setSource(Data source) {
        this.source = source;
    }

    public Data getTarget() {
        return target;
    }

    public void setTarget(Data target) {
        this.target = target;
    }
}
