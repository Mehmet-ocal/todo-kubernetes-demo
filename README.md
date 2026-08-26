# Kubernetes To-Do App 🚀

This project is a 3-tier (Frontend, Backend, MySQL) To-Do application configured and deployed on a bare-metal Kubernetes Cluster.

## Architecture
* **Frontend:** User interface exposed externally via NodePort.
* **Backend:** Node.js-based REST API service (ClusterIP).
* **Database:** MySQL configured with persistent storage (PV/PVC).
* **Security:** Sensitive data and passwords are secured using Kubernetes Secrets.

## Installation Steps
Thanks to the numbered directory structure, you can deploy the entire infrastructure with a single recursive command. Run the following command on your Master node:

```bash
kubectl apply -R -f k8s/
