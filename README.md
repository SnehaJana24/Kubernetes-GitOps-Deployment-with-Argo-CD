# 🚀 Kubernetes GitOps Deployment with Argo CD

A GitOps-based Kubernetes deployment using **Docker, Kubernetes, Helm, Minikube, GitHub, and Argo CD** — where Git acts as the source of truth and Argo CD automatically keeps the Kubernetes cluster synchronized with the desired state.

---

## 📌 Overview

This project demonstrates a complete GitOps deployment workflow for a lightweight Node.js application.

The application is containerized with Docker, packaged using Helm, and deployed to a local Kubernetes cluster running on Minikube. Argo CD continuously monitors the GitHub repository and automatically synchronizes changes from Git to Kubernetes.

### Architecture

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    │ desired state
    ▼
Argo CD
    │
    │ auto-sync
    ▼
Helm Chart
    │
    ▼
Kubernetes / Minikube
    │
    ▼
Node.js Application
    │
    ├── Pod 1
    └── Pod 2
```

---

## 🔁 GitOps Update Demonstration

The main purpose of this project was to demonstrate that a change committed to Git can automatically reach the Kubernetes cluster through Argo CD.

A real deployment update was performed:

1. The application image was changed from `devops-gitops-app:1.0` to `devops-gitops-app:1.1`.
2. The Helm `values.yaml` file was updated.
3. The change was committed and pushed to GitHub.
4. Argo CD detected the new Git revision.
5. Argo CD synchronized the Helm chart with Kubernetes.
6. Kubernetes created new pods using the updated image.
7. The deployment was verified as healthy.

The final deployment was verified with:

```powershell
kubectl get application devops-gitops -n argocd
```

```text
SYNC STATUS:   Synced
HEALTH STATUS: Healthy
```

The deployed image was verified with:

```powershell
kubectl get deployment devops-gitops -o jsonpath="{.spec.template.spec.containers[0].image}"
```

Result:

```text
devops-gitops-app:1.1
```

The running pods were also verified:

```powershell
kubectl get pods -l app=devops-gitops
```

Both application pods were running successfully.

### GitOps Flow

```text
Git commit
    ↓
GitHub main branch
    ↓
Argo CD detects change
    ↓
Helm chart rendered
    ↓
Kubernetes Deployment updated
    ↓
New application pods created
```

**Git change → Argo CD synchronization → Kubernetes deployment update**

This is the core GitOps workflow demonstrated by the project.

---

## 🛠️ Technologies Used

| Technology       | Purpose                                     |
| ---------------- | ------------------------------------------- |
| **Node.js**      | Sample application                          |
| **Docker**       | Application containerization                |
| **Kubernetes**   | Container orchestration                     |
| **Minikube**     | Local Kubernetes cluster                    |
| **Helm**         | Kubernetes packaging and templating         |
| **Argo CD**      | GitOps continuous delivery                  |
| **Git & GitHub** | Source control and desired-state management |
| **PowerShell**   | Windows command-line environment            |

---

## 📁 Project Structure

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
│           ├── _helpers.tpl
│           ├── deployment.yaml
│           └── service.yaml
│
├── Dockerfile
└── README.md
```

---

## ⚙️ Application

The project contains a lightweight Node.js HTTP server running on port `3000`.

It provides three endpoints:

| Endpoint  | Purpose                                  |
| --------- | ---------------------------------------- |
| `/`       | Returns the application status           |
| `/health` | Kubernetes liveness and readiness checks |
| `/info`   | Returns application information          |

Example response from `/`:

```json
{
  "message": "🚀 Kubernetes GitOps Project",
  "status": "running",
  "pod": "local"
}
```

---

## 🐳 Docker

The Node.js application is packaged into a lightweight Docker image using `node:20-alpine`.

The Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

COPY app/ ./

EXPOSE 3000

CMD ["node", "index.js"]
```

The image used in the final deployment was:

```text
devops-gitops-app:1.1
```

For local Minikube deployment, the image was loaded into the Minikube environment:

```powershell
minikube image load devops-gitops-app:1.1
```

---

## ☸️ Kubernetes Deployment

The application is deployed using a Kubernetes `Deployment` and `Service`.

### Deployment

The Helm configuration runs:

```yaml
replicaCount: 2
```

Therefore, two application pods are maintained.

This provides basic availability because Kubernetes can maintain another running replica if one pod becomes unavailable.

### Health Probes

Both Kubernetes probes use the application's `/health` endpoint:

```text
/health
```

* **Liveness probe** — checks whether the application is alive.
* **Readiness probe** — checks whether the application is ready to receive traffic.

### Service

The application is exposed using a Kubernetes `NodePort` service:

```text
Application Port: 3000
Target Port:     3000
NodePort:        30080
```

---

## ⎈ Helm

The Kubernetes deployment is packaged as a Helm chart.

Helm allows deployment configuration such as the image version and replica count to be managed through `values.yaml`.

Main configuration:

```text
helm/devops-gitops/values.yaml
```

Current image configuration:

```yaml
image:
  repository: devops-gitops-app
  pullPolicy: IfNotPresent
  tag: "1.1"
```

### Helm Validation

The chart was validated using:

```powershell
helm lint helm/devops-gitops
```

The chart passed linting successfully.

The generated Kubernetes manifests were also inspected using:

```powershell
helm template devops-gitops helm/devops-gitops
```

---

## 🔄 Argo CD

Argo CD is used as the GitOps continuous delivery tool.

The configured repository is:

```text
https://github.com/SnehaJana24/devops-gitops-project.git
```

Argo CD monitors:

```text
Branch: main
Path:   helm/devops-gitops
```

The application uses the Helm chart as its deployment source.

### Automated Sync

The Argo CD application is configured with:

* **Automated synchronization**
* **Prune**
* **Self-heal**

This means Git remains the desired state for the Kubernetes deployment.

When a configuration change is pushed to GitHub:

```text
GitHub
   ↓
Argo CD detects new revision
   ↓
Helm chart rendered
   ↓
Kubernetes resources synchronized
```

Argo CD can also correct configuration drift when the live Kubernetes state differs from the desired state stored in Git.

---

## 🧪 Verification

The final Argo CD application status:

```text
SYNC STATUS:   Synced
HEALTH STATUS: Healthy
```

The deployed image:

```text
devops-gitops-app:1.1
```

The final deployment contained two running replicas:

```text
devops-gitops-74c8b94dd5-cvcnc
devops-gitops-74c8b94dd5-lsp2t
```

The deployment was also verified with:

```powershell
kubectl get deployment devops-gitops
```

Expected result:

```text
READY   UP-TO-DATE   AVAILABLE
2/2     2            2
```

---

## 🌐 Running the Application

Start Minikube:

```powershell
minikube start --driver=docker
```

Load the local Docker image:

```powershell
minikube image load devops-gitops-app:1.1
```

After Argo CD has synchronized the application, obtain the service URL:

```powershell
minikube service devops-gitops --url
```

Example:

```text
http://127.0.0.1:<port>
```

Test the application:

```powershell
curl.exe http://127.0.0.1:<port>/
```

Test the health endpoint:

```powershell
curl.exe http://127.0.0.1:<port>/health
```

---

## 🐞 Problems Encountered and Resolved

### 1. Minikube Startup Issue

Minikube initially failed to start because Docker Desktop's Linux engine was not ready.

The issue was resolved by starting Docker Desktop completely and then running:

```powershell
minikube start --driver=docker
```

---

### 2. Argo CD ApplicationSet CRD Missing

The Argo CD ApplicationSet controller initially reported:

```text
no matches for kind "ApplicationSet"
in version "argoproj.io/v1alpha1"
```

The required ApplicationSet CRD was missing.

The issue was diagnosed using:

```powershell
kubectl get crd applicationsets.argoproj.io
```

The CRD was then installed from the Argo CD installation manifest.

After installation, the ApplicationSet controller became healthy.

---

### 3. Private GitHub Repository Authentication

Argo CD initially could not access the GitHub repository and reported:

```text
authentication required:
Repository not found
```

A GitHub access token was configured for the repository in Argo CD.

The repository connection was then verified successfully.

---

### 4. Argo CD Synchronization Delay

After pushing the image update, Argo CD initially continued reporting the previous Git revision.

The Git repository was verified using:

```powershell
git log --oneline origin/main -3
```

The Argo CD revision was then compared with the Git revision.

A hard refresh was triggered using:

```powershell
kubectl -n argocd annotate application devops-gitops `
  argocd.argoproj.io/refresh=hard --overwrite
```

Argo CD subsequently detected the new revision and synchronized the application.

The final deployment changed from:

```text
devops-gitops-app:1.0
```

to:

```text
devops-gitops-app:1.1
```

---

## 🎯 What This Project Demonstrates

This project provided hands-on practice with:

* Docker containerization
* Kubernetes Deployments
* Kubernetes Services
* Liveness and readiness probes
* Minikube
* Helm charts
* Helm values and templates
* Git and GitHub
* Argo CD
* GitOps principles
* Automated synchronization
* Kubernetes health verification
* Git-based deployment updates
* Troubleshooting Kubernetes and Argo CD issues

Most importantly, it demonstrates a working GitOps workflow rather than simply installing the individual tools.

---

## 🔮 Future Improvements

Possible next steps include:

* Add GitHub Actions for CI
* Automatically build Docker images after every push
* Push images to Amazon ECR or Docker Hub
* Add automated vulnerability scanning
* Use unique image tags for every release
* Add Prometheus and Grafana monitoring
* Deploy the application to AWS EKS
* Add Kubernetes Ingress and HTTPS
* Implement separate development and production environments
* Automate image version updates

---

## 👩‍💻 Author

**Sneha Jana**

Computer Science & Engineering Student

Interested in **DevOps, Cloud Computing, Kubernetes, and Cloud-Native Technologies**.

---

## ⭐ Project Goal

The goal of this project is to demonstrate a practical **GitOps deployment workflow** where the desired Kubernetes state is maintained in Git and Argo CD automatically keeps the cluster synchronized with that state.

