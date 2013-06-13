/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package telcomp.retrieval.control.persistence;

import java.io.Serializable;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import javax.persistence.EntityNotFoundException;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import telcomp.retrieval.control.persistence.exceptions.NonexistentEntityException;
import telcomp.retrieval.model.persistence.DataAssociationEntity;

/**
 *
 * @author SemanticaUcauca
 */
public class DataAssociationJpaController implements Serializable {

    public DataAssociationJpaController(EntityManagerFactory emf) {
        this.emf = emf;
    }
    private EntityManagerFactory emf = null;

    public EntityManager getEntityManager() {
        return emf.createEntityManager();
    }

    public void create(DataAssociationEntity dataAssociation) {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            em.persist(dataAssociation);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void edit(DataAssociationEntity dataAssociation) throws NonexistentEntityException, Exception {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            dataAssociation = em.merge(dataAssociation);
            em.getTransaction().commit();
        } catch (Exception ex) {
            String msg = ex.getLocalizedMessage();
            if (msg == null || msg.length() == 0) {
                String id = dataAssociation.getId();
                if (findDataAssociation(id) == null) {
                    throw new NonexistentEntityException("The dataAssociation with id " + id + " no longer exists.");
                }
            }
            throw ex;
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public void destroy(String id) throws NonexistentEntityException {
        EntityManager em = null;
        try {
            em = getEntityManager();
            em.getTransaction().begin();
            DataAssociationEntity dataAssociation;
            try {
                dataAssociation = em.getReference(DataAssociationEntity.class, id);
                dataAssociation.getId();
            } catch (EntityNotFoundException enfe) {
                throw new NonexistentEntityException("The dataAssociation with id " + id + " no longer exists.", enfe);
            }
            em.remove(dataAssociation);
            em.getTransaction().commit();
        } finally {
            if (em != null) {
                em.close();
            }
        }
    }

    public List<DataAssociationEntity> findDataAssociationEntities() {
        return findDataAssociationEntities(true, -1, -1);
    }

    public List<DataAssociationEntity> findDataAssociationEntities(int maxResults, int firstResult) {
        return findDataAssociationEntities(false, maxResults, firstResult);
    }

    private List<DataAssociationEntity> findDataAssociationEntities(boolean all, int maxResults, int firstResult) {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            cq.select(cq.from(DataAssociationEntity.class));
            Query q = em.createQuery(cq);
            if (!all) {
                q.setMaxResults(maxResults);
                q.setFirstResult(firstResult);
            }
            return q.getResultList();
        } finally {
            em.close();
        }
    }

    public DataAssociationEntity findDataAssociation(String id) {
        EntityManager em = getEntityManager();
        try {
            return em.find(DataAssociationEntity.class, id);
        } finally {
            em.close();
        }
    }

    public int getDataAssociationCount() {
        EntityManager em = getEntityManager();
        try {
            CriteriaQuery cq = em.getCriteriaBuilder().createQuery();
            Root<DataAssociationEntity> rt = cq.from(DataAssociationEntity.class);
            cq.select(em.getCriteriaBuilder().count(rt));
            Query q = em.createQuery(cq);
            return ((Long) q.getSingleResult()).intValue();
        } finally {
            em.close();
        }
    }
    
}
