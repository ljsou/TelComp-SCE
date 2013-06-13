/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.model.persistence;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author SemanticaUcauca
 */
@Entity
@Table(name = "Data_Association")
public class DataAssociationEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    private long idDataSource;
    private long idDataTarget;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof DataAssociationEntity)) {
            return false;
        }
        DataAssociationEntity other = (DataAssociationEntity) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "telcomp.retrieval.model.persistence.DataAssociation[ id=" + id + " ]";
    }

    /**
     * @return the idDataSource
     */
    public long getIdDataSource() {
        return idDataSource;
    }

    /**
     * @param idDataSource the idDataSource to set
     */
    public void setIdDataSource(long idDataSource) {
        this.idDataSource = idDataSource;
    }

    /**
     * @return the idDataTarget
     */
    public long getIdDataTarget() {
        return idDataTarget;
    }

    /**
     * @param idDataTarget the idDataTarget to set
     */
    public void setIdDataTarget(long idDataTarget) {
        this.idDataTarget = idDataTarget;
    }
    
}
