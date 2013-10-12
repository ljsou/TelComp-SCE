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
    private boolean isLoggedIn = false;

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
        System.out.println("login");
        RequestContext context = RequestContext.getCurrentInstance();
        FacesMessage msg = null;

        if (username != null && username.equals("admin") && password != null && password.equals("admin") && !this.isLoggedIn) {
            this.isLoggedIn = true;
            msg = new FacesMessage(FacesMessage.SEVERITY_INFO, "Welcome", username);
            //FacesContext.getCurrentInstance().getExternalContext().redirect("http://localhost:8084/TelCompTerminal/");

        } else if (this.isLoggedIn) {
            msg = new FacesMessage(FacesMessage.SEVERITY_INFO, "", "you are already logged in");
        } else {
            this.isLoggedIn = false;
            msg = new FacesMessage(FacesMessage.SEVERITY_WARN, "Login Error", "Invalid credentials");
            //FacesContext.getCurrentInstance().getExternalContext().redirect("faces/index.xhtml#tab4");            
        }

        FacesContext.getCurrentInstance().addMessage(null, msg);
        context.addCallbackParam("loggedIn", this.isLoggedIn);
    }

    public void access() throws IOException {
        FacesMessage msg = null;
        System.out.println("access! " + this.isLoggedIn);
        if (this.isLoggedIn) {
            FacesContext.getCurrentInstance().getExternalContext().redirect("http://localhost:8084/TelCompTerminal/");
        } else {
            //FacesContext.getCurrentInstance().addMessage(null, new FacesMessage(FacesMessage.SEVERITY_WARN,"Sample warn message", "Watch out for PrimeFaces!"));  
            msg = new FacesMessage(FacesMessage.SEVERITY_WARN, "Warning!", "\nTo access this resource you must login.");
            FacesContext.getCurrentInstance().addMessage(null, msg);
        }
    }

    public void loggout() {
        System.out.println("logout!");
        this.isLoggedIn = false;
        FacesMessage msg = new FacesMessage(FacesMessage.SEVERITY_WARN, "Thanks!", "Bye");
        FacesContext.getCurrentInstance().addMessage(null, msg);
    }
}
