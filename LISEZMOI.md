# Invitation Cédrick & Ruth — mise en ligne

## 1. Stockage des confirmations (gratuit, sans base de données)
1. Créez une Google Sheet vide → Extensions → Apps Script.
2. Collez le contenu de `apps-script.gs` et changez `CLE_ADMIN` (c'est votre mot de passe administrateur).
3. Déployer → Nouveau déploiement → Application Web → Exécuter en tant que : *Moi* ; Accès : *Tout le monde*.
4. Copiez l'URL obtenue dans `config.js` (`ENDPOINT`).

Chaque clic sur « Confirmer ma présence » ajoute une ligne (nom, téléphone, table, boissons) dans la Sheet.

## 2. Voir les confirmés
Ouvrez `admin.html` et entrez votre mot de passe : liste, recherche, total par boisson, export CSV.
(Sans `ENDPOINT`, le site fonctionne en mode test : données gardées dans le navigateur, mot de passe `admin`.)

## 3. GitHub Pages
Déposez tous les fichiers à la racine du dépôt → Settings → Pages → branche `main`.

## Invités personnalisés
`https://votre-site/?invite=Kabanga&table=Samuel` pré-remplit le nom et la table.
