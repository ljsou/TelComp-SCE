/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.servlet.ServletContext;

import org.primefaces.model.DefaultStreamedContent;
import org.primefaces.model.StreamedContent;
import webservice.JSLEEorchestrator_Service;
import webservice.OrchestrateService;

/**
 *
 * @author SemanticaUcauca
 */
@ManagedBean
@SessionScoped
public class FileDownloadController {

    private StreamedContent file;
    private String jsonContent = "";

    public FileDownloadController() {
        InputStream stream = ((ServletContext) FacesContext.getCurrentInstance().getExternalContext().getContext()).getResourceAsStream("/images/text.xml");
        file = new DefaultStreamedContent(stream, "application/xml", "text.xml");
    }

    public StreamedContent getFile() {
        System.out.println("Download!");
        return file;
    }

    public String getJsonContent() {
        return jsonContent;
    }

    public void setJsonContent(String jsonContent) {
        this.jsonContent = jsonContent;
    }

    public void setJsonContentOnFile() {
        System.out.println("Voy a meter esto en el json: " + this.jsonContent);
        sentJson(this.jsonContent);
        try {

            //String content = "This is the content to write into file";
            String path = "C:/Users/SemanticaUcauca/Documents/NetBeansProjects/TelComp-SCE/web/images/";
            //String path = "";
            String fileName = "text.xml";
            File jsonFile = new File(path, fileName);

            // if file doesnt exists, then create it
            if (!jsonFile.exists()) {
                System.out.println("doesnt Exist!");
                jsonFile.createNewFile();
            }

            FileWriter fw = new FileWriter(jsonFile.getAbsoluteFile());
            BufferedWriter bw = new BufferedWriter(fw);
            bw.write(this.jsonContent);
            bw.close();

            System.out.println("Done!!");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void exportFile() {
//        try {
        System.out.println("entró para desargar el archivo!");
        //String content = "This is the content to write into file";
        String path = "C:/Users/SemanticaUcauca/Documents/NetBeansProjects/TelComp-SCE/web/images/";
        //String path = "";
        String fileName = "text.xml";
//            File jsonFile = new File(path, fileName);
//
//            // if file doesnt exists, then create it
//            if (!jsonFile.exists()) {
//                System.out.println("doesnt Exist!");
//                jsonFile.createNewFile();
//            }
//            FileReader fr = new FileReader(jsonFile.getAbsoluteFile());
//            BufferedReader br = new BufferedReader(fr);
//            String line = "";
//            while ((line = br.readLine()) != null) {
//                line = line + line;
//                System.out.println("-: " + line);
//            }

//            URL filePath = getClass().getClassLoader().getResource(fileName);
//            System.out.println("PATH: " + filePath);
//            //InputStream stream = filePath.openStream();
//            InputStream stream = new ((ServletContext) FacesContext.getCurrentInstance().getExternalContext().getContext()).getResourceAsStream("/images/JSONgraph.json");
//            //file = new DefaultStreamedContent(stream, "application/json", "*.json");
//            file = new DefaultStreamedContent(stream, "application/xml", "telcompgraph.xml");
////        } catch (IOException ex) {
//            System.out.println("fallo");
//             ex.printStackTrace();
//        }
    }

    private static void setJsonGraphToJSEEOrchestrate(java.lang.String arg0) {
        System.out.println("setJsonGraph!");
//        webservice.JSLEEorchestrator_Service jslees = new JSLEEorchestrator_Service();
//        jslees.getJSLEEorchestratorPort().orchestrateService(arg0, true);
    }
    
    public void sentJson(String jsonContent) {
        //setJsonGraphToJSEEOrchestrate(" {\"containers\":[{\"idcomp\":195,\"title\":\"getCurrencyValue\"},{\"idcomp\":1547,\"title\":\"GetCurrencies\"}],\"wires\":[{\"src\":{\"moduleId\":1},\"tgt\":{\"moduleId\":0}}]}");
        setJsonGraphToJSEEOrchestrate(jsonContent);
    }
}
