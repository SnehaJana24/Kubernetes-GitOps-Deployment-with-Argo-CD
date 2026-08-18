\# 🚀 Kubernetes GitOps Deployment with Argo CD



A complete \*\*GitOps-based Kubernetes deployment\*\* using \*\*Docker, Kubernetes, Helm, Minikube, GitHub, and Argo CD\*\*.



The project demonstrates how an application can be containerized, packaged with Helm, deployed to Kubernetes, and automatically synchronized from a GitHub repository using Argo CD.



\---



\## 📌 Project Overview



This project implements a simple Node.js application and deploys it to a local Kubernetes cluster following a GitOps workflow.



Instead of manually changing Kubernetes resources, the desired deployment configuration is stored in Git. \*\*Argo CD continuously monitors the GitHub repository and automatically synchronizes changes to the Kubernetes cluster.\*\*



\### Workflow



```text

Developer

&#x20;   │

&#x20;   ▼

GitHub Repository

&#x20;   │

&#x20;   │  GitOps source

&#x20;   ▼

&#x20;  Argo CD

&#x20;   │

&#x20;   │  Automatic Sync

&#x20;   ▼

Kubernetes / Minikube

&#x20;   │

&#x20;   ▼

Docker Container

&#x20;   │

&#x20;   ▼

Node.js Application

```



\---



\## 🛠️ Technologies Used



\* \*\*Node.js\*\* – Application runtime

\* \*\*Docker\*\* – Containerization

\* \*\*Kubernetes\*\* – Container orchestration

\* \*\*Minikube\*\* – Local Kubernetes cluster

\* \*\*Helm\*\* – Kubernetes package management

\* \*\*Argo CD\*\* – GitOps continuous delivery

\* \*\*Git \& GitHub\*\* – Source control and GitOps repository

\* \*\*PowerShell\*\* – Windows command-line environment



\---



\## 📁 Project Structure



```text

devops-gitops-project/

│

├── app/

│   ├── index.js

│   └── package.json

│

├── helm/

│   └── devops-gitops/

│       ├── Chart.yaml

│       ├── values.yaml

│       └── templates/

│           ├── \_helpers.tpl

│           ├── deployment.yaml

│           └── service.yaml

│

├── k8s/

│   ├── deployment.yaml

│   └── service.yaml

│

├── Dockerfile

└── README.md

```



\---



\## ⚙️ Application



The application is a lightweight Node.js HTTP server running on port `3000`.



It provides health and application information endpoints that can be used by Kubernetes probes.



Example response:



```json

{

&#x20; "message": "🚀 Kubernetes GitOps Project",

&#x20; "status": "running",

&#x20; "pod": "local"

}

```



\---



\## 🐳 Docker



The application is containerized using a lightweight Node.js Alpine image.



```dockerfile

FROM node:20-alpine



WORKDIR /usr/src/app



COPY app/package\*.json ./



RUN npm install



COPY app/ ./



EXPOSE 3000



CMD \["node", "index.js"]

```



The application image used in the final deployment is:



```text

devops-gitops-app:1.1

```



\---



\## ☸️ Kubernetes Deployment



The project uses Kubernetes Deployment and Service resources.



The application runs with:



```yaml

replicaCount: 2

```



This provides two application pods for basic availability.



Kubernetes health checks use:



```text

/health

```



for both \*\*liveness\*\* and \*\*readiness\*\* probes.



The application is exposed using a Kubernetes `NodePort` service:



```text

Port:     3000

Target:   3000

NodePort: 30080

```



\---



\## ⎈ Helm



Helm is used to package the Kubernetes deployment.



The main configuration is stored in:



```text

helm/devops-gitops/values.yaml

```



Current image configuration:



```yaml

image:

&#x20; repository: devops-gitops-app

&#x20; pullPolicy: IfNotPresent

&#x20; tag: "1.1"

```



The Helm chart was validated using:



```bash

helm lint helm/devops-gitops

```



and successfully passed linting.



The generated Kubernetes manifests were also verified using:



```bash

helm template devops-gitops helm/devops-gitops

```



\---



\## 🔄 GitOps with Argo CD



Argo CD is configured to monitor this GitHub repository:



```text

https://github.com/SnehaJana24/devops-gitops-project.git

```



Argo CD uses the Helm chart located at:



```text

helm/devops-gitops

```



The application is configured for:



\* Automatic synchronization

\* Pruning

\* Self-healing



Therefore, Git acts as the \*\*source of truth\*\* for the Kubernetes deployment.



\### GitOps Flow



```text

Git Commit

&#x20;   │

&#x20;   ▼

GitHub main branch

&#x20;   │

&#x20;   ▼

Argo CD detects change

&#x20;   │

&#x20;   ▼

Helm manifests rendered

&#x20;   │

&#x20;   ▼

Kubernetes resources updated

&#x20;   │

&#x20;   ▼

New application pods created

```



\---



\## 🧪 Verification



Argo CD application status:



```text

SYNC STATUS:   Synced

HEALTH STATUS: Healthy

```



The deployed image was verified with:



```bash

kubectl get deployment devops-gitops \\

\-o jsonpath="{.spec.template.spec.containers\[0].image}"

```



Result:



```text

devops-gitops-app:1.1

```



Running pods:



```text

devops-gitops-74c8b94dd5-cvcnc   1/1   Running

devops-gitops-74c8b94dd5-lsp2t   1/1   Running

```



Argo CD synchronized revision:



```text

a9756268d73cf23eaba5df1251b4476a8fb5a470

```



This confirms that the Kubernetes deployment was successfully updated from the latest Git commit.



\---



\## 🌐 Accessing the Application



The application can be exposed locally through Minikube:



```bash

minikube service devops-gitops --url

```



Example:



```text

http://127.0.0.1:<port>

```



Test the application:



```bash

curl.exe http://127.0.0.1:<port>/

```



Example response:



```json

{

&#x20; "message": "🚀 Kubernetes GitOps Project",

&#x20; "status": "running",

&#x20; "pod": "local"

}

```



\---



\## 🔁 Demonstrated GitOps Update



A major part of this project was testing an actual GitOps change.



The application image was updated from:



```text

devops-gitops-app:1.0

```



to:



```text

devops-gitops-app:1.1

```



The change was committed and pushed to GitHub.



Argo CD detected the new Git revision and automatically updated the Kubernetes Deployment.



The final deployment was verified with:



```bash

kubectl get deployment devops-gitops \\

\-o jsonpath="{.spec.template.spec.containers\[0].image}"

```



Result:



```text

devops-gitops-app:1.1

```



This demonstrates the core GitOps principle:



> \*\*Git change → Argo CD synchronization → Kubernetes deployment update\*\*



\---



\## 🎯 Key Learning Outcomes



Through this project, I practiced:



\* Containerizing applications with Docker

\* Creating and managing Kubernetes Deployments

\* Creating Kubernetes Services

\* Configuring health probes

\* Packaging applications with Helm

\* Managing Helm values and templates

\* Running Kubernetes locally with Minikube

\* Setting up Argo CD

\* Connecting Argo CD to a GitHub repository

\* Implementing automated GitOps synchronization

\* Verifying Kubernetes deployments

\* Performing Git-based application updates

\* Troubleshooting Kubernetes and Argo CD issues



\---



\## 🚀 Future Improvements



Possible improvements include:



\* Add GitHub Actions CI pipeline

\* Build Docker images automatically

\* Push images to Amazon ECR or Docker Hub

\* Add automated vulnerability scanning

\* Use separate development and production environments

\* Add Prometheus and Grafana monitoring

\* Deploy to an AWS EKS cluster

\* Add Ingress and HTTPS

\* Implement image version automation



\---



\## 👩‍💻 Author



\*\*Sneha Jana\*\*



Computer Science \& Engineering Student

Interested in \*\*DevOps, Cloud Computing, Kubernetes, and Cloud-Native Technologies\*\*.



\---



\## ⭐ Project Goal



The goal of this project is to demonstrate a practical \*\*GitOps deployment workflow\*\* where application configuration is maintained in Git and Argo CD automatically keeps the Kubernetes cluster synchronized with the desired state.



