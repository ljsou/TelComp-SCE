/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

import java.util.ArrayList;
import java.util.List;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import telcomp.retrieval.matchmaking.ws.Data;
import telcomp.retrieval.matchmaking.ws.Operation;
import telcomp.retrieval.matchmaking.ws.ComponentRankingElement;

/**
 *
 * @author SemanticaUcauca
 */
@ManagedBean
@RequestScoped
public class ComponentRetrievalManagedBean {

    private List<ComponentRankingElement> componentsByKeyword;
    private List<ComponentRankingElement> componentsByQuery;
    private String keyword = "";
    private Operation queryComponent;
    private String jsVarKw = "'';";
    private String jsVarQy = "'';";
    private String selectedComponentId;
    private Operation selectedComponent;

    /**
     * Creates a new instance of ComponentRetrievalManagedBean
     */
    public ComponentRetrievalManagedBean() {
    }

    public void retrieveComponentsByKeyword() {
        long t0 = System.currentTimeMillis();
        if (!keyword.equals("")) {
            System.out.println("Keyword: " + keyword);
            setComponentsByKeyword(retrieveComponentByKeyword(keyword));
            jsVarKw = " {\n"
                    + "   language: 'myLanguage', \n"
                    + "   modules: [";
            if (componentsByKeyword.size() > 10) {
                componentsByKeyword = componentsByKeyword.subList(0, 10);
            }
            for (ComponentRankingElement retrievedOperation : componentsByKeyword) {
                jsVarKw += createModule(retrievedOperation);
            }
            jsVarKw += "   ]\n };";
//            System.out.println("jsVar: \n" + jsVar);
        }
        long t1 = System.currentTimeMillis();
        System.out.println("Done!" + " (" + (t1 - t0) / 1000.0 + "s)");
    }

    public void retrieveComponentsByQuery() {
        long t0 = System.currentTimeMillis();
        if (this.queryComponent != null) {
            System.out.println("Query: " + this.queryComponent.getOperationName() + "(" + this.queryComponent.getId() + ")");
            setComponentsByQuery(retrieveComponentsByQuery(this.queryComponent));
            jsVarQy = " {\n"
                    + "   language: 'myLanguage', \n"
                    + "   modules: [";
            if (componentsByQuery.size() > 10) {
                componentsByQuery = componentsByQuery.subList(0, 10);
            }
            for (ComponentRankingElement retrievedOperation : componentsByQuery) {
                jsVarQy += createModule(retrievedOperation);
            }
            jsVarQy += "   ]\n };";
//            System.out.println("jsVar: \n" + jsVar);
        }
        long t1 = System.currentTimeMillis();
        System.out.println("Done!" + " (" + (t1 - t0) / 1000.0 + "s)");
    }
    
    /**
     * @return the keyword
     */
    public String getKeyword() {
        return keyword;
    }

    /**
     * @param keyword the keyword to set
     */
    public void setKeyword(String keyword) {
        this.keyword = keyword;
        //retrieveComponents();
    }

    /**
     * @return the components
     */
    public List<ComponentRankingElement> getComponentsByKeyword() {
        return componentsByKeyword;
    }

    /**
     * @param components the components to set
     */
    public void setComponentsByKeyword(List<ComponentRankingElement> components) {
        this.componentsByKeyword = components;
    }

    /**
     * @return the jsVar
     */
    public String getJsVarKw() {
        retrieveComponentsByKeyword();
        //setJsonGraphToJSEEOrchestrate(jsVarKw);
        return jsVarKw;
    }

    /**
     * @param jsVar the jsVar to set
     */
    public void setJsVarKw(String jsVar) {
        System.out.println("--Jsvar: " + jsVar);
        this.jsVarKw = jsVar;
    }

    public String createModule(ComponentRankingElement component) {
        String result = "{ \n"
                + "       'name': '" + component.getRetrievedAttribute().getOperationName() + "', \n"
                + "       'container': {\n"
                + "           'xtype':'WireIt.InOutContainer',\n"
                + "           'icon': 'res/icons/service2.png',\n"
                + "           'idcomp': " + component.getRetrievedAttribute().getId() + ",\n";
        if (hasInputs(component.getRetrievedAttribute())) {
            result += "           'inputs':['In'],\n";
        }
        if (hasOutputs(component.getRetrievedAttribute())) {
            result += "           'outputs':['Out'],\n";
        }
//                + listDataElements(component.getRetrievedAttribute(), true)
//                + listDataElements(component.getRetrievedAttribute(), false)
        result += "       }\n"
                + "   },\n";
        return result;
    }

    public void sJVar(String jsVar) {
        System.out.println("-->Jsvar: " + jsVar + "---");
        this.jsVarKw = jsVar;
    }

    public boolean hasInputs(Operation component) {
        if (!component.getDataElements().isEmpty()) {
            for (Data data : component.getDataElements()) {
                if (data.isInput()) {
                    return true;
                }
            }
        }
        return false;
    }

    public boolean hasOutputs(Operation component) {
        if (!component.getDataElements().isEmpty()) {
            for (Data data : component.getDataElements()) {
                if (!data.isInput()) {
                    return true;
                }
            }
        }
        return false;
    }

    public String listDataElements(Operation component, boolean type) {
        String header = (type) ? "           'inputs':[" : "           'outputs':[";
        String dataElements = "";
        List<Data> operationData = filterRootData(component.getDataElements(), type);
        if (!operationData.isEmpty()) {
            for (Data data : operationData) {
//                if(data instanceof ComplexData)
//                    System.out.println("ComplexData found!");
                if (data.isInput() == type) {
                    dataElements += "'" + data.getDataElementName() + "', ";
                }
            }
        }
        if (dataElements.isEmpty()) {
            System.out.println("Is Empty... ");
            dataElements = "";
        } else {
            int lastColon = dataElements.lastIndexOf(",");
            dataElements = header + dataElements.substring(0, lastColon) + "],\n";
        }

        return dataElements;
    }

    public List<Data> filterRootData(List<Data> dataElements, boolean type) {
        List<Data> result = new ArrayList<Data>();
        for (Data data : dataElements) {
            if (data.getComplexDataElementId() == -1 && data.isInput() == type) {
                result.add(data);
            }
        }
        if (result.isEmpty()) {
            return dataElements;
        }
        return result;
    }

    private static java.util.List<telcomp.retrieval.matchmaking.ws.ComponentRankingElement> retrieveComponentByKeyword(java.lang.String arg0) {
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService service = new telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService();
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWS port = service.getComponentMatchmakerWSPort();
        return port.retrieveComponentByKeyword(arg0);
    }

    /**
     * @return the selectedComponentId
     */
    public String getSelectedComponentId() {
        return selectedComponentId;
    }

    /**
     * @param selectedComponentId the selectedComponentId to set
     */
    public void setSelectedComponentId(String selectedComponentId) {
        this.queryComponent = getComponent(Long.parseLong(selectedComponentId));
        this.selectedComponentId = selectedComponentId;
    }

    private static java.util.List<telcomp.retrieval.matchmaking.ws.ComponentRankingElement> retrieveComponentsByQuery(Operation arg0) {
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService service = new telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService();
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWS port = service.getComponentMatchmakerWSPort();
        return port.retrieveComponentsByQuery(arg0);
    }

    private static Operation retrieveComponentById(long arg0) {
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService service = new telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWSService();
        telcomp.retrieval.matchmaking.ws.ComponentMatchmakerWS port = service.getComponentMatchmakerWSPort();
        return port.retrieveComponentById(arg0);
    }

    /**
     * @return the selectedComponent
     */
    public Operation getSelectedComponent() {
        return selectedComponent;
    }

    /**
     * @param selectedComponent the selectedComponent to set
     */
    public void setSelectedComponent(Operation selectedComponent) {
        this.selectedComponent = selectedComponent;
    }

    /**
     * @return the componentsByQuery
     */
    public List<ComponentRankingElement> getComponentsByQuery() {
        return componentsByQuery;
    }

    /**
     * @param componentsByQuery the componentsByQuery to set
     */
    public void setComponentsByQuery(List<ComponentRankingElement> componentsByQuery) {
        this.componentsByQuery = componentsByQuery;
    }

    private Operation getComponent(long selectedComponentId) {
        return retrieveComponentById(selectedComponentId);
    }

    /**
     * @return the queryComponent
     */
    public Operation getQueryComponent() {
        System.out.println("Query: " + this.queryComponent);
        return queryComponent;
    }

    /**
     * @param queryComponent the queryComponent to set
     */
    public void setQueryComponent(Operation queryComponent) {
        System.out.println("Query: " + this.queryComponent);
        this.queryComponent = queryComponent;
    }

    /**
     * @return the jsVarQy
     */
    public String getJsVarQy() {
        retrieveComponentsByQuery();
        return jsVarQy;
    }

    /**
     * @param jsVarQy the jsVarQy to set
     */
    public void setJsVarQy(String jsVarQy) {
        this.jsVarQy = jsVarQy;
    }
}
