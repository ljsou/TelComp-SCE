/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control;

import java.io.IOException;
import javax.faces.application.FacesMessage;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.context.FacesContext;
import javax.faces.event.ActionEvent;
import org.primefaces.context.RequestContext;

/**
 *
 * @author javier
 */
@ManagedBean
@SessionScoped
public class LoginBean {

    private String username;
    private String password;
    private boolean loggedIn2 = false;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void login(ActionEvent actionEvent) throws IOException {
        RequestContext context = RequestContext.getCurrentInstance();
        FacesMessage msg = null;
        boolean loggedIn = false;
        
        if (username != null && username.equals("admin") && password != null && password.equals("admin")) {
            loggedIn = true;
            msg = new FacesMessage(FacesMessage.SEVERITY_INFO, "Welcome", username);
            FacesContext.getCurrentInstance().getExternalContext().redirect("http://localhost:8084/TelCompTerminal/");

        } else {
            loggedIn = false;
            msg = new FacesMessage(FacesMessage.SEVERITY_WARN, "Login Error", "Invalid credentials");
            FacesContext.getCurrentInstance().getExternalContext().redirect("faces/index.xhtml#tab4");
        }

        FacesContext.getCurrentInstance().addMessage(null, msg);
        context.addCallbackParam("loggedIn", loggedIn);
    }

    public void access() throws IOException {
        System.out.println("access!" + this.loggedIn2);
        if (this.loggedIn2) {
            FacesContext.getCurrentInstance().getExternalContext().redirect("http://localhost:8084/TelCompTerminal/");
        }
    }
}
